from __future__ import annotations

import io
import math
import struct
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SCREEN_DIR = ROOT / "video_assets" / "screens"
OUT_DIR = ROOT / "deliverables"
OUT_PATH = OUT_DIR / "agentport_intro_2k.avi"

WIDTH = 2560
HEIGHT = 1440
FPS = 1
JPEG_QUALITY = 84


@dataclass(frozen=True)
class Segment:
    seconds: int
    screen: str
    title: str
    subtitle: str
    bullets: tuple[str, ...]


SEGMENTS = [
    Segment(
        14,
        "01_market.png",
        "WPS Agent共享平台",
        "从发现、搭建、导入到调用计费，形成一个完整的 Agent 产品闭环。",
        ("Agent 市场", "自建 Agent", "导入中心", "调用工作台"),
    ),
    Segment(
        28,
        "01_market.png",
        "像挑选应用一样挑选 Agent",
        "市场页展示评分、分类、开发者、版本、用户量、精选案例和价格信息。",
        ("搜索与分类筛选", "详情信息更完整", "可直接添加到工作台"),
    ),
    Segment(
        34,
        "02_office_agents.png",
        "办公场景：覆盖高频工作流",
        "会议纪要、PPT 大纲、Excel 公式、文档摘要、日报周报和邮件润色，都可以作为可复用 Agent 能力。",
        ("减少重复提示词编写", "让结果结构稳定", "贴近真实办公流程"),
    ),
    Segment(
        28,
        "03_paid_agents.png",
        "付费 Agent：让专业能力进入市场",
        "智能出图、网文创作和番茄小说写作等付费 Agent，可按次消耗积分调用。",
        ("创作者可沉淀能力", "用户按需购买", "为分成结算预留空间"),
    ),
    Segment(
        36,
        "04_build_agent.png",
        "自建 Agent：从目标描述开始",
        "用户填写名称、场景和可见范围后，前端发起真实 HTTP 请求，后端校验并写入 SQLite 草稿。",
        ("不是静态表单", "真实后端路由", "真实数据库记录"),
    ),
    Segment(
        36,
        "05_import_bind.png",
        "导入中心：新增绑定智能体",
        "复制 Skill 指令给外部智能体，等待它读取能力描述并返回授权码，再粘贴回平台完成后续绑定。",
        ("支持 Coze、Dify、GitHub 等来源", "新增 Skill 文件 + 授权码", "不伪造绑定状态"),
    ),
    Segment(
        30,
        "06_run_workspace.png",
        "调用工作台：调用前先看清成本",
        "用户选择 Agent 后，可以输入任务并查看输出长度、工具次数、模型成本和创作者溢价。",
        ("积分预估透明", "支持试用次数", "适合后续接入真实模型调用"),
    ),
    Segment(
        30,
        "07_creator_console.png",
        "创作者后台：能力可以运营",
        "创作者可以查看收入、调用次数、好评率、健康度、版本灰度和收益明细。",
        ("收入统计", "版本灰度", "收益明细"),
    ),
    Segment(
        20,
        "08_billing.png",
        "积分账单：商业闭环落到用户侧",
        "充值套餐、计费公式、调用流水和退款记录，让平台具备可持续商业化基础。",
        ("充值与余额", "调用扣费", "退款流水"),
    ),
    Segment(
        16,
        "09_closing.png",
        "总结",
        "WPS Agent共享平台的目标不是静态展示页，而是一个可运行、可扩展、可商业化的 Agent 共享平台。",
        ("找到 Agent", "搭建 Agent", "迁移 Agent", "变现 Agent"),
    ),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


FONT_TITLE = font(66, True)
FONT_SUBTITLE = font(34)
FONT_BULLET = font(30, True)
FONT_SMALL = font(24)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for char in text:
        trial = current + char
        if draw.textbbox((0, 0), trial, font=font_obj)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = char
    if current:
        lines.append(current)
    return lines


def rounded_rect(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], radius: int, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def make_frame(segment: Segment, second_in_segment: int, elapsed: int, total: int) -> Image.Image:
    screenshot = Image.open(SCREEN_DIR / segment.screen).convert("RGB").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    frame = screenshot.filter(ImageFilter.GaussianBlur(radius=0.35)).convert("RGBA")
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(8, 12, 14, 42))
    rounded_rect(draw, (74, 72, 940, 348), 28, (10, 16, 20, 214), (255, 255, 255, 34), 1)
    rounded_rect(draw, (74, 1090, 2486, 1358), 28, (10, 16, 20, 222), (255, 255, 255, 40), 1)

    draw.text((116, 112), segment.title, font=FONT_TITLE, fill=(255, 255, 255, 255))
    subtitle_lines = wrap_text(draw, segment.subtitle, FONT_SUBTITLE, 760)
    y = 204
    for line in subtitle_lines[:3]:
        draw.text((116, y), line, font=FONT_SUBTITLE, fill=(224, 234, 232, 248))
        y += 48

    pill_x = 116
    pill_y = 296
    for bullet in segment.bullets[:4]:
        text_w = draw.textbbox((0, 0), bullet, font=FONT_SMALL)[2]
        rounded_rect(draw, (pill_x, pill_y, pill_x + text_w + 40, pill_y + 44), 22, (235, 246, 241, 235))
        draw.text((pill_x + 20, pill_y + 8), bullet, font=FONT_SMALL, fill=(19, 82, 75, 255))
        pill_x += text_w + 54
        if pill_x > 820:
            break

    caption = f"{elapsed:02d}s / {total}s"
    draw.text((2290, 86), caption, font=FONT_SMALL, fill=(226, 233, 231, 230))

    line_x = 118
    line_y = 1132
    draw.text((line_x, line_y), segment.title, font=FONT_BULLET, fill=(255, 255, 255, 255))
    line_y += 52
    for line in wrap_text(draw, segment.subtitle, FONT_SUBTITLE, 2160)[:2]:
        draw.text((line_x, line_y), line, font=FONT_SUBTITLE, fill=(232, 238, 236, 248))
        line_y += 48
    if segment.bullets:
        draw.text((line_x, 1294), " · ".join(segment.bullets), font=FONT_SMALL, fill=(169, 198, 192, 245))

    progress = min(1.0, max(0.0, elapsed / total))
    rounded_rect(draw, (116, 1368, 2444, 1382), 7, (255, 255, 255, 42))
    rounded_rect(draw, (116, 1368, 116 + int(2328 * progress), 1382), 7, (22, 118, 104, 235))

    # A tiny movement keeps players from treating long sections as still images.
    if second_in_segment % 2 == 1:
        draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(255, 255, 255, 3))

    return Image.alpha_composite(frame, overlay).convert("RGB")


def chunk(tag: bytes, data: bytes) -> bytes:
    pad = b"\0" if len(data) % 2 else b""
    return tag + struct.pack("<I", len(data)) + data + pad


def list_chunk(kind: bytes, data: bytes) -> bytes:
    payload = kind + data
    return b"LIST" + struct.pack("<I", len(payload)) + payload + (b"\0" if len(payload) % 2 else b"")


def avi_header(total_frames: int, max_frame_size: int, movi_size: int, idx_size: int) -> bytes:
    avih = struct.pack(
        "<IIIIIIIIIIIIII",
        int(1_000_000 / FPS),
        max_frame_size * FPS,
        0,
        0x10,
        total_frames,
        0,
        1,
        max_frame_size,
        WIDTH,
        HEIGHT,
        0,
        0,
        0,
        0,
    )
    strh = struct.pack(
        "<4s4sIHHIIIIIIIIiiii",
        b"vids",
        b"MJPG",
        0,
        0,
        0,
        0,
        1,
        FPS,
        0,
        total_frames,
        max_frame_size,
        0xFFFFFFFF,
        0,
        0,
        0,
        WIDTH,
        HEIGHT,
    )
    strf = struct.pack(
        "<IiiHH4sIiiII",
        40,
        WIDTH,
        HEIGHT,
        1,
        24,
        b"MJPG",
        max_frame_size,
        0,
        0,
        0,
        0,
    )
    hdrl = list_chunk(b"hdrl", chunk(b"avih", avih) + list_chunk(b"strl", chunk(b"strh", strh) + chunk(b"strf", strf)))
    riff_size = 4 + len(hdrl) + 8 + movi_size + idx_size
    return b"RIFF" + struct.pack("<I", riff_size) + b"AVI " + hdrl


def encode_frame(frame: Image.Image) -> bytes:
    buffer = io.BytesIO()
    frame.save(buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    return buffer.getvalue()


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total_seconds = sum(segment.seconds for segment in SEGMENTS)
    encoded_frames: list[bytes] = []
    elapsed = 0

    for segment in SEGMENTS:
      for second in range(segment.seconds):
          elapsed += 1
          encoded_frames.append(encode_frame(make_frame(segment, second, elapsed, total_seconds)))

    max_frame_size = max(len(frame) for frame in encoded_frames)
    movi_payload_size = sum(8 + len(frame) + (len(frame) % 2) for frame in encoded_frames)
    movi_size = 4 + movi_payload_size
    idx_size = 8 + len(encoded_frames) * 16
    header = avi_header(len(encoded_frames), max_frame_size, movi_size, idx_size)

    offset = 4
    index_entries: list[bytes] = []
    with OUT_PATH.open("wb") as output:
        output.write(header)
        output.write(b"LIST")
        output.write(struct.pack("<I", movi_size))
        output.write(b"movi")
        for frame in encoded_frames:
            output.write(b"00dc")
            output.write(struct.pack("<I", len(frame)))
            output.write(frame)
            if len(frame) % 2:
                output.write(b"\0")
            index_entries.append(struct.pack("<4sIII", b"00dc", 0x10, offset, len(frame)))
            offset += 8 + len(frame) + (len(frame) % 2)
        output.write(chunk(b"idx1", b"".join(index_entries)))

    print(f"wrote {OUT_PATH}")
    print(f"resolution {WIDTH}x{HEIGHT}, duration {total_seconds}s, fps {FPS}, frames {len(encoded_frames)}")


if __name__ == "__main__":
    main()
