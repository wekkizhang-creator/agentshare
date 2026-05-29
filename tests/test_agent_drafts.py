from __future__ import annotations

import json
import sqlite3
import tempfile
import threading
import unittest
from contextlib import closing
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class AgentDraftApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tmp.name) / "agentport-test.db"
        server.init_db(self.db_path)
        handler = server.make_handler(PROJECT_ROOT, self.db_path)
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        host, port = self.httpd.server_address
        self.base_url = f"http://{host}:{port}"

    def tearDown(self) -> None:
        self.httpd.shutdown()
        self.thread.join(timeout=3)
        self.httpd.server_close()
        self.tmp.cleanup()

    def request_json(self, method: str, path: str, payload: dict | None = None, user_id: str | None = None):
        data = None if payload is None else json.dumps(payload).encode("utf-8")
        headers = {"Content-Type": "application/json"}
        if user_id is not None:
            headers["X-User-Id"] = user_id
        request = Request(f"{self.base_url}{path}", data=data, method=method, headers=headers)
        with urlopen(request, timeout=5) as response:
            return response.status, json.loads(response.read().decode("utf-8"))

    def test_create_agent_draft_persists_to_sqlite(self) -> None:
        status, body = self.request_json(
            "POST",
            "/api/agent-drafts",
            {
                "name": "竞品研究助手",
                "description": "根据用户输入的产品方向，沉淀竞品研究任务并进入下一步人设配置。",
                "visibility": "private",
            },
            user_id="user_builder_001",
        )

        self.assertEqual(status, 201)
        draft = body["draft"]
        self.assertEqual(draft["name"], "竞品研究助手")
        self.assertEqual(draft["ownerUserId"], "user_builder_001")
        self.assertEqual(draft["status"], "draft")
        self.assertEqual(draft["nextStep"], "instruction")

        with closing(sqlite3.connect(self.db_path)) as connection:
            row = connection.execute(
                "SELECT owner_user_id, name, visibility, status FROM agent_drafts WHERE id = ?",
                (draft["id"],),
            ).fetchone()
            step_row = connection.execute(
                "SELECT type, status, payload_json FROM agent_build_steps WHERE agent_draft_id = ?",
                (draft["id"],),
            ).fetchone()

        self.assertEqual(row, ("user_builder_001", "竞品研究助手", "private", "draft"))
        self.assertEqual(step_row[0:2], ("profile", "completed"))
        self.assertEqual(json.loads(step_row[2])["visibility"], "private")

    def test_create_agent_draft_requires_user_header(self) -> None:
        with self.assertRaises(HTTPError) as raised:
            self.request_json(
                "POST",
                "/api/agent-drafts",
                {
                    "name": "未登录草稿",
                    "description": "没有用户标识时不能创建草稿。",
                    "visibility": "private",
                },
            )

        self.assertEqual(raised.exception.code, 401)

        with closing(sqlite3.connect(self.db_path)) as connection:
            count = connection.execute("SELECT COUNT(*) FROM agent_drafts").fetchone()[0]
        self.assertEqual(count, 0)

    def test_agent_invocation_records_request_and_returns_answer(self) -> None:
        status, body = self.request_json(
            "POST",
            "/api/agent-invocations",
            {
                "agentId": "finance-close-agent",
                "message": "请帮我生成本月月结检查清单。",
                "estimatedCredit": 32,
            },
            user_id="user_builder_001",
        )

        self.assertEqual(status, 200)
        invocation_id = body["invocation"]["id"]
        self.assertIn("本次请求已处理", body["answer"])

        with closing(sqlite3.connect(self.db_path)) as connection:
            row = connection.execute(
                """
                SELECT owner_user_id, agent_id, user_message, estimated_credit, status
                FROM agent_invocation_requests
                WHERE id = ?
                """,
                (invocation_id,),
            ).fetchone()

        self.assertEqual(
            row,
            (
                "user_builder_001",
                "finance-close-agent",
                "请帮我生成本月月结检查清单。",
                32,
                "completed",
            ),
        )


if __name__ == "__main__":
    unittest.main()
