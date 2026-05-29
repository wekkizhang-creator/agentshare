from __future__ import annotations

import argparse
import json
import os
import sqlite3
import uuid
from contextlib import closing
from datetime import UTC, datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = BASE_DIR / "agentport.db"
VALID_VISIBILITY = {"private", "team", "marketplace"}


def now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def init_db(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(db_path)) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS agent_drafts (
                id TEXT PRIMARY KEY,
                owner_user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                visibility TEXT NOT NULL CHECK (visibility IN ('private', 'team', 'marketplace')),
                status TEXT NOT NULL CHECK (status IN ('draft', 'sandbox_ready', 'submitted', 'published', 'rejected')),
                instruction_encrypted TEXT,
                model_provider TEXT,
                model_name TEXT,
                temperature REAL,
                pricing_mode TEXT CHECK (pricing_mode IS NULL OR pricing_mode IN ('free', 'token_usage')),
                credit_price INTEGER,
                trial_quota INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS agent_build_steps (
                id TEXT PRIMARY KEY,
                agent_draft_id TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN (
                    'profile',
                    'instruction',
                    'knowledge',
                    'tool',
                    'workflow',
                    'sandbox',
                    'publish'
                )),
                status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
                payload_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (agent_draft_id) REFERENCES agent_drafts(id) ON DELETE CASCADE
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS agent_invocation_requests (
                id TEXT PRIMARY KEY,
                owner_user_id TEXT NOT NULL,
                agent_id TEXT NOT NULL,
                user_message TEXT NOT NULL,
                estimated_credit INTEGER NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
                created_at TEXT NOT NULL
            )
            """
        )
        connection.commit()


def connect(db_path: Path) -> sqlite3.Connection:
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def row_to_agent_draft(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "ownerUserId": row["owner_user_id"],
        "name": row["name"],
        "description": row["description"],
        "visibility": row["visibility"],
        "status": row["status"],
        "instructionEncrypted": row["instruction_encrypted"],
        "modelProvider": row["model_provider"],
        "modelName": row["model_name"],
        "temperature": row["temperature"],
        "pricingMode": row["pricing_mode"],
        "creditPrice": row["credit_price"],
        "trialQuota": row["trial_quota"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def read_json(handler: SimpleHTTPRequestHandler) -> dict[str, Any]:
    raw_length = handler.headers.get("Content-Length")
    if raw_length is None:
        raise ValueError("请求体不能为空")
    try:
        length = int(raw_length)
    except ValueError as error:
        raise ValueError("Content-Length 非法") from error
    if length <= 0:
        raise ValueError("请求体不能为空")
    body = handler.rfile.read(length)
    try:
        value = json.loads(body.decode("utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError("请求体必须是合法 JSON") from error
    if not isinstance(value, dict):
        raise ValueError("请求体必须是 JSON object")
    return value


def validate_required_text(payload: dict[str, Any], field: str, label: str, max_length: int) -> str:
    value = payload.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label}不能为空")
    value = value.strip()
    if len(value) > max_length:
        raise ValueError(f"{label}不能超过 {max_length} 个字符")
    return value


def create_agent_draft(db_path: Path, owner_user_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    owner_user_id = owner_user_id.strip()
    if not owner_user_id:
        raise PermissionError("缺少 X-User-Id")

    name = validate_required_text(payload, "name", "Agent 名称", 80)
    description = validate_required_text(payload, "description", "目标说明", 1000)
    visibility = payload.get("visibility", "private")
    if visibility not in VALID_VISIBILITY:
        raise ValueError("visibility 只能是 private、team 或 marketplace")

    draft_id = f"agd_{uuid.uuid4().hex}"
    step_id = f"step_{uuid.uuid4().hex}"
    timestamp = now_iso()

    with closing(connect(db_path)) as connection:
        with connection:
            connection.execute(
                """
                INSERT INTO agent_drafts (
                    id,
                    owner_user_id,
                    name,
                    description,
                    visibility,
                    status,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)
                """,
                (draft_id, owner_user_id, name, description, visibility, timestamp, timestamp),
            )
            connection.execute(
                """
                INSERT INTO agent_build_steps (
                    id,
                    agent_draft_id,
                    type,
                    status,
                    payload_json,
                    created_at
                )
                VALUES (?, ?, 'profile', 'completed', ?, ?)
                """,
                (
                    step_id,
                    draft_id,
                    json.dumps(
                        {
                            "name": name,
                            "description": description,
                            "visibility": visibility,
                        },
                        ensure_ascii=False,
                        separators=(",", ":"),
                    ),
                    timestamp,
                ),
            )
            row = connection.execute("SELECT * FROM agent_drafts WHERE id = ?", (draft_id,)).fetchone()

    draft = row_to_agent_draft(row)
    draft["nextStep"] = "instruction"
    return draft


def get_agent_draft(db_path: Path, draft_id: str, owner_user_id: str) -> dict[str, Any] | None:
    with closing(connect(db_path)) as connection:
        row = connection.execute(
            "SELECT * FROM agent_drafts WHERE id = ? AND owner_user_id = ?",
            (draft_id, owner_user_id.strip()),
        ).fetchone()
        if row is None:
            return None
        steps = connection.execute(
            """
            SELECT id, type, status, payload_json, created_at
            FROM agent_build_steps
            WHERE agent_draft_id = ?
            ORDER BY created_at ASC
            """,
            (draft_id,),
        ).fetchall()

    draft = row_to_agent_draft(row)
    draft["steps"] = [
        {
            "id": step["id"],
            "type": step["type"],
            "status": step["status"],
            "payload": json.loads(step["payload_json"]),
            "createdAt": step["created_at"],
        }
        for step in steps
    ]
    return draft


def create_agent_invocation_request(
    db_path: Path,
    owner_user_id: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    owner_user_id = owner_user_id.strip()
    if not owner_user_id:
        raise PermissionError("缺少 X-User-Id")

    agent_id = validate_required_text(payload, "agentId", "Agent ID", 120)
    user_message = validate_required_text(payload, "message", "用户消息", 4000)
    estimated_credit = payload.get("estimatedCredit")
    if not isinstance(estimated_credit, int) or estimated_credit < 0:
        raise ValueError("estimatedCredit 必须是非负整数，用作兼容字段")

    invocation_id = f"inv_{uuid.uuid4().hex}"
    timestamp = now_iso()
    with closing(connect(db_path)) as connection:
        with connection:
            connection.execute(
                """
                INSERT INTO agent_invocation_requests (
                    id,
                    owner_user_id,
                    agent_id,
                    user_message,
                    estimated_credit,
                    status,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, 'completed', ?)
                """,
                (invocation_id, owner_user_id, agent_id, user_message, estimated_credit, timestamp),
            )

    return {
        "id": invocation_id,
        "agentId": agent_id,
        "estimatedCredit": estimated_credit,
        "status": "completed",
        "createdAt": timestamp,
    }


def build_invocation_preview_answer(invocation: dict[str, Any]) -> str:
    return (
        "本次请求已处理。"
        f"请求编号 {invocation['id']}，本次不展示积分或 Token 估算。"
        "在完整接入模型和工具执行器后，这里会展示节点执行日志、产出摘要和后续行动项。"
    )


def make_handler(static_dir: Path, db_path: Path) -> type[SimpleHTTPRequestHandler]:
    class WpsAgentHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            super().__init__(*args, directory=str(static_dir), **kwargs)

        def do_POST(self) -> None:
            parsed = urlparse(self.path)
            if parsed.path == "/api/agent-drafts":
                self.handle_create_agent_draft()
                return
            if parsed.path == "/api/agent-invocations":
                self.handle_create_agent_invocation()
                return
            self.send_json(
                HTTPStatus.NOT_FOUND,
                {"error": "RouteNotFound", "message": "当前未配置该 API 路由"},
            )

        def do_GET(self) -> None:
            parsed = urlparse(self.path)
            if parsed.path.startswith("/api/agent-drafts/"):
                self.handle_get_agent_draft(parsed.path.rsplit("/", 1)[-1])
                return
            if parsed.path.startswith("/api/"):
                self.send_json(
                    HTTPStatus.NOT_FOUND,
                    {"error": "RouteNotFound", "message": "当前未配置该 API 路由"},
                )
                return
            super().do_GET()

        def handle_create_agent_draft(self) -> None:
            try:
                payload = read_json(self)
                draft = create_agent_draft(db_path, self.headers.get("X-User-Id", ""), payload)
            except PermissionError as error:
                self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Unauthorized", "message": str(error)})
            except ValueError as error:
                self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"error": "ValidationError", "message": str(error)})
            except sqlite3.DatabaseError:
                self.send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"error": "DatabaseError", "message": "数据库写入失败"},
                )
            else:
                self.send_json(HTTPStatus.CREATED, {"draft": draft})

        def handle_create_agent_invocation(self) -> None:
            try:
                payload = read_json(self)
                invocation = create_agent_invocation_request(
                    db_path,
                    self.headers.get("X-User-Id", ""),
                    payload,
                )
            except PermissionError as error:
                self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Unauthorized", "message": str(error)})
            except ValueError as error:
                self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"error": "ValidationError", "message": str(error)})
            except sqlite3.DatabaseError:
                self.send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"error": "DatabaseError", "message": "数据库写入失败"},
                )
            else:
                self.send_json(
                    HTTPStatus.OK,
                    {
                        "invocation": invocation,
                        "answer": build_invocation_preview_answer(invocation),
                    },
                )

        def handle_get_agent_draft(self, draft_id: str) -> None:
            owner_user_id = self.headers.get("X-User-Id", "")
            if not owner_user_id.strip():
                self.send_json(HTTPStatus.UNAUTHORIZED, {"error": "Unauthorized", "message": "缺少 X-User-Id"})
                return
            draft = get_agent_draft(db_path, draft_id, owner_user_id)
            if draft is None:
                self.send_json(HTTPStatus.NOT_FOUND, {"error": "NotFound", "message": "Agent 草稿不存在"})
                return
            self.send_json(HTTPStatus.OK, {"draft": draft})

        def send_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, format: str, *args: Any) -> None:
            if os.environ.get("AGENTPORT_HTTP_LOGS") == "1":
                super().log_message(format, *args)

    return WpsAgentHandler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="WPS Agent共享平台 local API and static server")
    parser.add_argument("--host", default=os.environ.get("AGENTPORT_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("AGENTPORT_PORT", "4173")))
    parser.add_argument("--db", default=os.environ.get("AGENTPORT_DB_PATH", str(DEFAULT_DB_PATH)))
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    db_path = Path(args.db).resolve()
    init_db(db_path)
    server = ThreadingHTTPServer((args.host, args.port), make_handler(BASE_DIR, db_path))
    print(f"WPS Agent共享平台 running at http://{args.host}:{args.port}")
    print(f"SQLite database: {db_path}")
    server.serve_forever()


if __name__ == "__main__":
    main()
