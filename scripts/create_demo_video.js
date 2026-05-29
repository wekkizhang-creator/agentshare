const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "deliverables");
const screenDir = path.join(root, "video_assets", "demo_screens");
const videoPath = path.join(outDir, "wps_agent_demo_no_subtitles.avi");
const styledVideoPath = path.join(outDir, "wps_agent_demo_with_styled_subtitles.avi");
const subtitlePath = path.join(outDir, "wps_agent_demo_captions.srt");

const width = 1920;
const height = 1080;
const fps = 2;
const jpegQuality = 82;

const cues = [
  ["market_home", 4, "WPS Agent共享平台是一个垂直 Agent 双边市场，给专业问题专业答案。"],
  ["market_home", 4, "用户来这里找懂行的 Agent，创作者把行业 know-how 变成生意。"],
  ["market_home", 4, "先从用户视角看，这是 Agent 市场首屏。"],
  ["market_categories", 4, "Agent 按专业领域组织，法律、电商、医疗、财税、教育、设计等场景都能找到。"],
  ["market_home", 4, "每个 Agent 都标了评分、调用量、价格、试用次数，一眼判断好不好用。"],
  ["market_detail", 4, "详情页有版本、用户量、精选案例和评分分布，选之前心里有数。"],
  ["market_detail", 4, "先试用、再付费，不合适随时换，几乎没有试错成本。"],
  ["market_legal", 4, "看三个具体场景，都是没有垂直知识就做不了的事。"],
  ["market_contract", 4, "合同审查：通用 AI 会漏掉条款陷阱；法律 Agent 接了类案数据库，逐条标风险。"],
  ["market_legal_doc", 4, "法律文书：通用 AI 套个模板就交差；法律 Agent 按地方法院格式起草，改完就能用。"],
  ["market_commerce", 4, "电商选品：通用 AI 凭印象推荐；选品 Agent 拉得到销量、退货率和竞品价格，推的是数据。"],
  ["market_detail", 4, "通用 AI 像一个聪明的实习生，垂直 Agent 是一个干过十年的老手。"],
  ["market_paid", 4, "创作者把多年的实战经验沉淀成产品。"],
  ["billing", 4, "按次付费，不订阅、不绑定，用一次扣一次积分。"],
  ["billing", 4, "不用先充一整年会员才能试。"],
  ["billing", 4, "这是对用户最公平的方式。"],
  ["creator", 3, "现在翻到另一面，这些专业 Agent 从哪里来？"],
  ["build_blank", 4, "如果你在一个行业里有积累，可以从零搭建一个 Agent。"],
  ["build_filled", 4, "描述你的专业能力、目标用户、典型问题，几分钟出雏形。"],
  ["build_filled", 4, "全程零代码，人设、知识库、工具调用，平台一步步带你做。"],
  ["build_filled", 4, "律师、会计、医生、电商运营，任何行业里干了多年的人，都能把经验做成 Agent。"],
  ["build_filled", 4, "沙箱试跑没问题，就能上架到市场，让全国有这个需求的人都找得到你。"],
  ["import_sources", 3, "如果你已经在其他平台做过 Agent，也可以直接搬过来。"],
  ["import_sources", 3, "Coze、Dify、ChatGPT GPTs、GitHub、Markdown，一键导入，不用重做。"],
  ["import_sources", 3, "你在外部积累的内容，直接进入 WPS Agent共享平台的商业化体系。"],
  ["import_bind", 3, "还有一种方式，把你正在用的智能体直接绑定进来。"],
  ["import_bind", 3, "复制一段授权指令贴出去，智能体回传授权码，接入完成。"],
  ["import_bind", 3, "你在外部积累的用户和口碑，跟着 Agent 一起带过来。"],
  ["import_bind", 3, "自建、导入、绑定三条路径，让创作者低成本把能力放上市场。"],
  ["run_workspace", 4, "回到用户视角，选好 Agent，进入调用工作台。"],
  ["run_workspace", 4, "当前 Agent、剩余试用次数、任务输入框，信息全部前置。"],
  ["run_workspace", 4, "右边是积分预估区，输出长度、工具调用、模型成本都提前算好。"],
  ["run_workspace", 4, "在你确认之前，就知道这次大概花多少积分。"],
  ["run_workspace", 4, "没有黑盒、没有意外，也没有用了才知道贵。"],
  ["market_closing", 4, "一句话，WPS Agent共享平台是垂直 Agent 的双边市场。"],
  ["creator", 4, "用户找到懂行的 Agent，创作者赚到该赚的钱。"],
  ["market_closing", 4, "WPS Agent共享平台，找 Agent、做 Agent，都从这里开始。"],
];

const shotOrder = [...new Set(cues.map(([shot]) => shot))];

async function waitAndCapture(page, shotName) {
  await page.waitForTimeout(500);
  const buffer = await page.screenshot({
    fullPage: false,
    type: "jpeg",
    quality: jpegQuality,
    path: path.join(screenDir, `${shotName}.jpg`),
  });
  return buffer;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function showStyledSubtitle(page, text) {
  await page.evaluate((subtitleText) => {
    const existing = document.querySelector("#demoSubtitleOverlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "demoSubtitleOverlay";
    overlay.innerHTML = `
      <div class="demo-subtitle-card">
        <span>WPS Agent共享平台</span>
        <strong>${escapeHtml(subtitleText)}</strong>
      </div>
    `;
    document.body.appendChild(overlay);
  }, escapeHtml(text));
}

async function installSubtitleStyles(page) {
  await page.addStyleTag({
    content: `
      #demoSubtitleOverlay {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 54px;
        z-index: 99999;
        display: flex;
        justify-content: center;
        pointer-events: none;
        font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
      }

      .demo-subtitle-card {
        max-width: min(1320px, calc(100vw - 220px));
        padding: 18px 30px 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 22px;
        background: linear-gradient(180deg, rgba(13, 25, 28, 0.88), rgba(7, 13, 16, 0.92));
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        color: #fff;
        text-align: center;
        backdrop-filter: blur(18px);
      }

      .demo-subtitle-card span {
        display: inline-flex;
        align-items: center;
        min-height: 26px;
        margin-bottom: 8px;
        padding: 0 12px;
        border-radius: 999px;
        background: rgba(226, 243, 239, 0.16);
        color: #a8e7da;
        font-size: 17px;
        font-weight: 800;
        letter-spacing: 0.04em;
      }

      .demo-subtitle-card strong {
        display: block;
        color: #fff;
        font-size: 34px;
        font-weight: 800;
        line-height: 1.45;
        letter-spacing: 0.01em;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.36);
      }
    `,
  });
}

async function setMarket(page, category, agentId) {
  await page.evaluate(
    ({ category, agentId }) => {
      state.activeView = "market";
      state.activeCategory = category;
      state.activeAgentId = agentId;
      setView("market");
      renderCategories();
      renderAgentGrid();
      window.scrollTo(0, 0);
    },
    { category, agentId },
  );
}

async function prepareShot(page, shotName) {
  switch (shotName) {
    case "market_home":
      await setMarket(page, "全部", "finance-close-agent");
      break;
    case "market_categories":
      await setMarket(page, "行业垂直", "medical-record-summary");
      break;
    case "market_detail":
      await setMarket(page, "财务", "finance-close-agent");
      break;
    case "market_legal":
      await setMarket(page, "法务合同", "contract-review-sop-agent");
      break;
    case "market_contract":
      await setMarket(page, "法务合同", "contract-lifecycle-agent");
      break;
    case "market_legal_doc":
      await setMarket(page, "法务合同", "legal-document-generator");
      break;
    case "market_commerce":
      await setMarket(page, "跨境电商", "commerce");
      break;
    case "market_paid":
      await setMarket(page, "小说创作", "tomato-novel-writer");
      break;
    case "market_closing":
      await setMarket(page, "全部", "commerce");
      break;
    case "billing":
      await page.click('[data-view="billing"]');
      break;
    case "creator":
      await page.click('[data-view="creator"]');
      break;
    case "build_blank":
      await page.click('[data-view="build"]');
      await page.fill("#builderOwnerId", "");
      await page.fill("#builderAgentName", "");
      await page.fill("#builderGoal", "");
      break;
    case "build_filled":
      await page.click('[data-view="build"]');
      await page.fill("#builderOwnerId", "demo_user_001");
      await page.fill("#builderAgentName", "行业合同审查 Agent");
      await page.fill(
        "#builderGoal",
        "面向中小企业法务和业务负责人，识别合同高风险条款，输出可执行的修改建议和待确认问题。",
      );
      break;
    case "import_sources":
      await page.click('[data-view="import"]');
      await page.click('[data-source="Coze"]');
      break;
    case "import_bind":
      await page.click('[data-view="import"]');
      await page.click('[data-source="AgentBind"]');
      await page.fill("#authorizationCode", "WPS-DEMO-2026-BIND");
      break;
    case "run_workspace":
      await page.evaluate(() => {
        state.activeAgentId = "contract-review-sop-agent";
        setView("run");
        renderRunView();
        window.scrollTo(0, 0);
      });
      break;
    default:
      throw new Error(`Unknown shot: ${shotName}`);
  }
}

async function captureShots() {
  await fsp.mkdir(outDir, { recursive: true });
  await fsp.mkdir(screenDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await page.waitForLoadState("domcontentloaded");

  const frames = new Map();
  for (const shotName of shotOrder) {
    await prepareShot(page, shotName);
    frames.set(shotName, await waitAndCapture(page, shotName));
  }

  await browser.close();
  return frames;
}

async function captureStyledSubtitleSequence() {
  await fsp.mkdir(outDir, { recursive: true });
  await fsp.mkdir(screenDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await page.waitForLoadState("domcontentloaded");
  await installSubtitleStyles(page);

  const sequence = [];
  for (let cueIndex = 0; cueIndex < cues.length; cueIndex += 1) {
    const [shotName, seconds, text] = cues[cueIndex];
    await prepareShot(page, shotName);
    await showStyledSubtitle(page, text);
    await page.waitForTimeout(350);
    const frame = await page.screenshot({
      fullPage: false,
      type: "jpeg",
      quality: jpegQuality,
      path: path.join(screenDir, `caption_${String(cueIndex + 1).padStart(2, "0")}.jpg`),
    });
    for (let index = 0; index < seconds * fps; index += 1) {
      sequence.push(frame);
    }
  }

  await browser.close();
  return sequence;
}

function uint32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function int32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeInt32LE(value, 0);
  return buffer;
}

function uint16(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

function chunk(tag, data) {
  const pad = data.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([Buffer.from(tag), uint32(data.length), data, pad]);
}

function listChunk(kind, data) {
  const payload = Buffer.concat([Buffer.from(kind), data]);
  const pad = payload.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([Buffer.from("LIST"), uint32(payload.length), payload, pad]);
}

function aviHeader(totalFrames, maxFrameSize, moviSize, idxSize) {
  const avih = Buffer.concat([
    uint32(Math.floor(1_000_000 / fps)),
    uint32(maxFrameSize * fps),
    uint32(0),
    uint32(0x10),
    uint32(totalFrames),
    uint32(0),
    uint32(1),
    uint32(maxFrameSize),
    uint32(width),
    uint32(height),
    uint32(0),
    uint32(0),
    uint32(0),
    uint32(0),
  ]);

  const strh = Buffer.concat([
    Buffer.from("vids"),
    Buffer.from("MJPG"),
    uint32(0),
    uint16(0),
    uint16(0),
    uint32(0),
    uint32(1),
    uint32(fps),
    uint32(0),
    uint32(totalFrames),
    uint32(maxFrameSize),
    uint32(0xffffffff),
    uint32(0),
    int32(0),
    int32(0),
    int32(width),
    int32(height),
  ]);

  const strf = Buffer.concat([
    uint32(40),
    int32(width),
    int32(height),
    uint16(1),
    uint16(24),
    Buffer.from("MJPG"),
    uint32(maxFrameSize),
    int32(0),
    int32(0),
    uint32(0),
    uint32(0),
  ]);

  const hdrl = listChunk("hdrl", Buffer.concat([chunk("avih", avih), listChunk("strl", Buffer.concat([chunk("strh", strh), chunk("strf", strf)]))]));
  const riffSize = 4 + hdrl.length + 8 + moviSize + idxSize;
  return Buffer.concat([Buffer.from("RIFF"), uint32(riffSize), Buffer.from("AVI "), hdrl]);
}

function buildFrameSequence(framesByShot) {
  const sequence = [];
  for (const [shotName, seconds] of cues) {
    const jpeg = framesByShot.get(shotName);
    const frameCount = seconds * fps;
    for (let index = 0; index < frameCount; index += 1) {
      sequence.push(jpeg);
    }
  }
  return sequence;
}

async function writeVideoToPath(targetPath, sequence) {
  const maxFrameSize = Math.max(...sequence.map((frame) => frame.length));
  const moviPayloadSize = sequence.reduce((sum, frame) => sum + 8 + frame.length + (frame.length % 2), 0);
  const moviSize = 4 + moviPayloadSize;
  const idxSize = 8 + sequence.length * 16;

  const output = fs.createWriteStream(targetPath);
  output.write(aviHeader(sequence.length, maxFrameSize, moviSize, idxSize));
  output.write(Buffer.from("LIST"));
  output.write(uint32(moviSize));
  output.write(Buffer.from("movi"));

  let offset = 4;
  const indexEntries = [];
  for (const frame of sequence) {
    output.write(Buffer.from("00dc"));
    output.write(uint32(frame.length));
    output.write(frame);
    if (frame.length % 2) output.write(Buffer.from([0]));
    indexEntries.push(Buffer.concat([Buffer.from("00dc"), uint32(0x10), uint32(offset), uint32(frame.length)]));
    offset += 8 + frame.length + (frame.length % 2);
  }
  output.write(chunk("idx1", Buffer.concat(indexEntries)));
  await new Promise((resolve) => output.end(resolve));
}

async function writeVideo(framesByShot) {
  await writeVideoToPath(videoPath, buildFrameSequence(framesByShot));
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

async function writeSubtitles() {
  let cursor = 0;
  const blocks = cues.map(([, seconds, text], index) => {
    const start = cursor;
    cursor += seconds;
    return `${index + 1}\n${formatTime(start)} --> ${formatTime(cursor)}\n${text}`;
  });
  await fsp.writeFile(subtitlePath, `${blocks.join("\n\n")}\n`, "utf8");
}

async function main() {
  const framesByShot = await captureShots();
  await writeVideo(framesByShot);
  await writeSubtitles();
  const styledSequence = await captureStyledSubtitleSequence();
  await writeVideoToPath(styledVideoPath, styledSequence);
  const duration = cues.reduce((sum, [, seconds]) => sum + seconds, 0);
  console.log(`wrote ${videoPath}`);
  console.log(`wrote ${styledVideoPath}`);
  console.log(`wrote ${subtitlePath}`);
  console.log(`duration ${duration}s, resolution ${width}x${height}, fps ${fps}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
