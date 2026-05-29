const fsp = require("node:fs/promises");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "deliverables");
const videoDir = path.join(root, "video_assets", "litigation_recording");
const finalVideoPath = path.join(outDir, "zhang_lawyer_litigation_demo.webm");
const subtitlePath = path.join(outDir, "zhang_lawyer_litigation_demo.srt");
const appUrl = process.env.AGENTPT_URL || "http://127.0.0.1:4173/";
const viewport = { width: 1920, height: 1080 };

const narration = [
  [0, 5, "进入 WPS Agent 市场，找到张律师民事诉讼助手。"],
  [5, 18, "用户把借款时间、金额、还款约定和催收情况一次性输入给 Agent。"],
  [18, 34, "Agent 先判断是否适合自起诉，并追问关键证据。"],
  [34, 48, "用户补充借条、转账回单、微信催收和借款人身份信息。"],
  [48, 70, "Agent 将从现在到法院受理拆成九个可执行节点。"],
  [70, 90, "点击时效节点，Agent 给出时效判断和证据保全建议。"],
  [90, 118, "点击证据节点，Agent 标出现金交付部分的举证风险。"],
  [118, 140, "点击费用节点，Agent 估算受理费、保全费和担保成本。"],
  [140, 162, "点击立案节点，Agent 生成起诉状、证据目录和保全申请书。"],
  [162, 178, "收尾回看工作流、证据评估、费用明细和材料包。"],
];

const workflowSteps = [
  "诉讼时效校验",
  "证据完整性与效力评估",
  "管辖法院确定",
  "自动生成诉讼文书",
  "费用计算与保全策略建议",
  "财产保全同步申请",
  "立案材料包生成与提交",
  "节点追踪与提醒",
  "执行阶段预案",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpGet(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeoutMs = 12000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await httpGet(appUrl)) return true;
    await sleep(300);
  }
  return false;
}

async function ensureServer() {
  if (await waitForServer(1200)) return null;

  const child = spawn("python", ["server.py", "--host", "127.0.0.1", "--port", "4173"], {
    cwd: root,
    stdio: "ignore",
    windowsHide: true,
  });

  const ready = await waitForServer(15000);
  if (!ready) {
    child.kill();
    throw new Error("Unable to start local server on http://127.0.0.1:4173/");
  }
  return child;
}

function findBrowserExecutable() {
  const candidates = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function installDemoLayer(page) {
  await page.addStyleTag({
    content: `
      :root {
        --demo-teal: #0f7f72;
        --demo-ink: #1f2528;
        --demo-muted: #657075;
        --demo-border: #d9e1de;
        --demo-paper: #ffffff;
        --demo-wash: #f5f8f6;
        --demo-blue: #2556a2;
      }

      body {
        cursor: none !important;
      }

      .demo-cursor {
        position: fixed;
        width: 28px;
        height: 28px;
        left: 0;
        top: 0;
        z-index: 2147483647;
        border: 3px solid rgba(15, 127, 114, 0.96);
        border-radius: 999px;
        background: rgba(15, 127, 114, 0.16);
        box-shadow: 0 0 0 10px rgba(15, 127, 114, 0.11), 0 12px 30px rgba(15, 127, 114, 0.24);
        transform: translate3d(120px, 120px, 0);
        pointer-events: none;
        transition: transform 520ms cubic-bezier(.2,.8,.2,1), opacity 240ms ease;
      }

      .litigation-stage {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 392px;
        gap: 18px;
        height: calc(100vh - 162px);
      }

      .litigation-chat-panel,
      .litigation-side-panel {
        min-height: 0;
        border: 1px solid var(--demo-border);
        border-radius: 8px;
        background: var(--demo-paper);
        overflow: hidden;
      }

      .litigation-chat-panel {
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .litigation-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px;
        border-bottom: 1px solid var(--demo-border);
        background: linear-gradient(180deg, #fff, #f8faf9);
      }

      .litigation-head h2,
      .litigation-side-panel h3,
      .brand-title {
        margin: 0;
        color: var(--demo-ink);
        letter-spacing: 0;
      }

      .litigation-head h2 {
        font-size: 22px;
        line-height: 1.2;
      }

      .litigation-head p {
        margin: 4px 0 0;
        color: var(--demo-muted);
        font-size: 14px;
      }

      .litigation-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
        color: var(--demo-teal);
        font-weight: 700;
        font-size: 14px;
      }

      .litigation-status::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--demo-teal);
        box-shadow: 0 0 0 5px rgba(15, 127, 114, 0.12);
      }

      .litigation-stream {
        min-height: 0;
        overflow: auto;
        padding: 24px;
        background:
          linear-gradient(180deg, rgba(245, 248, 246, 0.96), rgba(255, 255, 255, 0.98)),
          radial-gradient(circle at 12% 10%, rgba(15, 127, 114, 0.05), transparent 34%);
      }

      .litigation-bubble-row {
        display: flex;
        margin: 0 0 18px;
      }

      .litigation-bubble-row.user {
        justify-content: flex-end;
      }

      .litigation-bubble {
        max-width: min(820px, 78%);
        padding: 16px 18px;
        border-radius: 8px;
        border: 1px solid var(--demo-border);
        background: #fff;
        box-shadow: 0 12px 30px rgba(21, 37, 35, 0.06);
        color: #252b2e;
        font-size: 17px;
        line-height: 1.62;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .litigation-bubble-row.user .litigation-bubble {
        border-color: rgba(15, 127, 114, 0.38);
        background: #e8f4f1;
      }

      .litigation-bubble-label {
        margin-bottom: 8px;
        color: var(--demo-muted);
        font-size: 13px;
        font-weight: 700;
      }

      .litigation-files {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .litigation-file {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 34px;
        padding: 6px 10px;
        border: 1px solid #cbdad6;
        border-radius: 8px;
        background: #fff;
        color: #394245;
        font-size: 13px;
        font-weight: 700;
      }

      .litigation-composer {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
        padding: 16px 18px;
        border-top: 1px solid var(--demo-border);
        background: #fff;
      }

      .litigation-composer textarea {
        width: 100%;
        height: 78px;
        resize: none;
        border: 1px solid #cdd8d5;
        border-radius: 8px;
        padding: 14px;
        color: var(--demo-ink);
        font: 16px/1.5 Inter, "Microsoft YaHei", sans-serif;
        outline: none;
      }

      .litigation-composer button,
      .workflow-run-button {
        border: 0;
        border-radius: 8px;
        background: var(--demo-teal);
        color: #fff;
        font-weight: 800;
        font-size: 15px;
      }

      .litigation-composer button {
        width: 108px;
        height: 78px;
      }

      .litigation-side-panel {
        padding: 22px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .litigation-side-panel h3 {
        font-size: 24px;
      }

      .side-kicker {
        margin: 4px 0 0;
        color: var(--demo-muted);
        font-size: 14px;
      }

      .agent-intro-text {
        margin: 0;
        color: #354044;
        font-size: 15px;
        line-height: 1.75;
      }

      .intro-metric-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .intro-metric {
        border: 1px solid var(--demo-border);
        border-radius: 8px;
        padding: 12px;
        background: #f8faf9;
      }

      .intro-metric strong {
        display: block;
        color: var(--demo-ink);
        font-size: 20px;
      }

      .intro-metric span {
        color: var(--demo-muted);
        font-size: 12px;
      }

      .intro-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .intro-tags span,
      .level-badge,
      .risk-badge {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
      }

      .intro-tags span {
        border: 1px solid #cbdad6;
        color: #39514b;
        background: #f5f9f7;
      }

      .side-mini-list {
        display: grid;
        gap: 10px;
        margin-top: auto;
      }

      .side-mini-list div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid var(--demo-border);
        color: var(--demo-muted);
        font-size: 14px;
      }

      .side-mini-list strong {
        color: var(--demo-ink);
      }

      .workflow-card,
      .result-card,
      .brand-card {
        width: min(940px, 100%);
        border: 1px solid #d5dfdc;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 16px 36px rgba(21, 37, 35, 0.08);
        overflow: hidden;
        margin: 4px 0 20px;
      }

      .workflow-card-head,
      .result-card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 20px;
        border-bottom: 1px solid var(--demo-border);
        background: #f8faf9;
      }

      .workflow-card h3,
      .result-card h3 {
        margin: 0;
        color: var(--demo-ink);
        font-size: 21px;
        line-height: 1.25;
      }

      .workflow-card p,
      .result-card p {
        margin: 5px 0 0;
        color: var(--demo-muted);
        font-size: 14px;
        line-height: 1.5;
      }

      .workflow-summary {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .workflow-summary span {
        border: 1px solid #cbdad6;
        border-radius: 8px;
        padding: 8px 10px;
        background: #fff;
        color: #344043;
        font-size: 13px;
        font-weight: 800;
      }

      .workflow-list {
        display: grid;
        gap: 10px;
        padding: 16px 18px 18px;
      }

      .workflow-step {
        display: grid;
        grid-template-columns: 36px 1fr auto;
        gap: 12px;
        align-items: center;
        min-height: 54px;
        padding: 10px 12px;
        border: 1px solid #d8e2df;
        border-radius: 8px;
        background: #fff;
      }

      .workflow-step.active {
        border-color: rgba(15, 127, 114, 0.55);
        background: #eef8f5;
        box-shadow: inset 4px 0 0 var(--demo-teal);
      }

      .step-number {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        background: #e5efec;
        color: #24544c;
        font-weight: 900;
      }

      .workflow-step strong {
        display: block;
        color: var(--demo-ink);
        font-size: 16px;
        line-height: 1.35;
      }

      .workflow-step small {
        display: block;
        margin-top: 3px;
        color: var(--demo-muted);
        font-size: 12px;
      }

      .level-badge {
        color: #235348;
        background: #e8f4f1;
      }

      .workflow-run-button {
        padding: 9px 12px;
      }

      .result-body {
        padding: 18px 20px 20px;
      }

      .verdict-grid,
      .fee-grid,
      .package-grid {
        display: grid;
        gap: 10px;
      }

      .verdict-row,
      .fee-row,
      .package-row {
        display: grid;
        align-items: center;
        gap: 12px;
        min-height: 56px;
        padding: 12px 14px;
        border: 1px solid #d8e2df;
        border-radius: 8px;
        background: #fff;
      }

      .verdict-row {
        grid-template-columns: 180px 96px 1fr;
      }

      .fee-row {
        grid-template-columns: 1fr 160px 180px;
      }

      .package-row {
        grid-template-columns: 1fr 160px;
      }

      .verdict-row strong,
      .fee-row strong,
      .package-row strong {
        color: var(--demo-ink);
        font-size: 16px;
      }

      .verdict-row span,
      .fee-row span,
      .package-row span {
        color: #4f5c60;
        font-size: 14px;
        line-height: 1.45;
      }

      .risk-badge.ok {
        color: #176954;
        background: #e3f3ee;
      }

      .risk-badge.warn {
        color: #9a3d1d;
        background: #fff0e8;
      }

      .result-tip {
        margin-top: 14px;
        padding: 13px 14px;
        border-radius: 8px;
        background: #eef3ff;
        color: #274a8f;
        line-height: 1.6;
        font-size: 14px;
      }

      .recap-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }

      .recap-card {
        min-height: 160px;
        border: 1px solid var(--demo-border);
        border-radius: 8px;
        padding: 16px;
        background: #fff;
        box-shadow: 0 12px 28px rgba(21, 37, 35, 0.07);
      }

      .recap-card h4 {
        margin: 0 0 12px;
        color: var(--demo-ink);
        font-size: 18px;
      }

      .recap-card p {
        margin: 0;
        color: var(--demo-muted);
        font-size: 14px;
        line-height: 1.55;
      }

      .brand-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        display: grid;
        place-items: center;
        background: linear-gradient(180deg, rgba(248, 250, 249, .98), rgba(236, 244, 241, .98));
      }

      .brand-card {
        width: min(980px, calc(100vw - 160px));
        padding: 54px 64px;
        text-align: left;
      }

      .brand-title {
        font-size: 54px;
        line-height: 1.05;
      }

      .brand-card p {
        margin: 22px 0 0;
        color: #405057;
        font-size: 28px;
        line-height: 1.45;
      }

      @media (max-width: 1200px) {
        .litigation-stage {
          grid-template-columns: 1fr;
        }
        .litigation-side-panel {
          display: none;
        }
      }
    `,
  });

  await page.evaluate(() => {
    if (!document.querySelector(".demo-cursor")) {
      const cursor = document.createElement("div");
      cursor.className = "demo-cursor";
      document.body.appendChild(cursor);
    }
  });
}

async function moveCursor(page, x, y, duration = 520) {
  await page.evaluate(
    ({ nextX, nextY }) => {
      const cursor = document.querySelector(".demo-cursor");
      if (cursor) cursor.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    },
    { nextX: x, nextY: y },
  );
  await page.mouse.move(x + 14, y + 14, { steps: 14 });
  await page.waitForTimeout(duration);
}

async function paceTo(page, startedAt, targetSeconds) {
  const remaining = targetSeconds * 1000 - (Date.now() - startedAt);
  if (remaining > 0) await page.waitForTimeout(remaining);
}

async function clickWithCursor(page, selector, offset = { x: 20, y: 20 }) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) throw new Error(`Missing selector: ${selector}`);
  const x = box.x + Math.min(offset.x, Math.max(8, box.width - 8));
  const y = box.y + Math.min(offset.y, Math.max(8, box.height - 8));
  await moveCursor(page, x - 14, y - 14, 500);
  await page.mouse.click(x, y);
  await page.waitForTimeout(650);
}

async function prepareRunDemo(page) {
  await page.evaluate((steps) => {
    const runShell = document.querySelector("#runView .run-layout");
    if (!runShell) return;
    runShell.innerHTML = `
      <section class="litigation-stage">
        <div class="litigation-chat-panel">
          <header class="litigation-head">
            <div>
              <h2>张律师民事诉讼助手</h2>
              <p>面向民间借贷等民事纠纷，按诉讼节点拆解材料、风险和下一步动作。</p>
            </div>
            <span class="litigation-status">工作流模式</span>
          </header>
          <div class="litigation-stream" id="litigationStream"></div>
          <div class="litigation-composer">
            <textarea id="litigationComposer" aria-label="任务输入"></textarea>
            <button id="litigationSend" type="button">发送</button>
          </div>
        </div>
        <aside class="litigation-side-panel">
          <div>
            <h3>Agent 介绍</h3>
            <p class="side-kicker">张律师民事诉讼助手</p>
          </div>
          <p class="agent-intro-text">
            面向民间借贷等民事纠纷，覆盖时效校验、证据评估、管辖法院、诉讼文书、
            费用保全、立案提交、节点提醒和执行预案。按实际 Token 与工具调用记录结算。
          </p>
          <div class="intro-metric-grid">
            <div class="intro-metric"><strong>9 步</strong><span>标准诉讼流程</span></div>
            <div class="intro-metric"><strong>4 类</strong><span>核心材料检查</span></div>
            <div class="intro-metric"><strong>3 份</strong><span>立案文书生成</span></div>
            <div class="intro-metric"><strong>HITL</strong><span>关键节点人工确认</span></div>
          </div>
          <div class="intro-tags">
            <span>民事诉讼</span><span>证据审查</span><span>财产保全</span><span>线上立案</span>
          </div>
          <div class="side-mini-list">
            ${steps.slice(0, 5).map((step, index) => `<div><span>节点 ${index + 1}</span><strong>${step}</strong></div>`).join("")}
          </div>
        </aside>
      </section>
    `;
  }, workflowSteps);
}

async function typeComposer(page, text, files = []) {
  await page.locator("#litigationComposer").fill("");
  await page.locator("#litigationComposer").type(text, { delay: 14 });
  await page.waitForTimeout(350);
  await moveCursor(page, 1462, 920, 360);
  await page.mouse.click(1495, 956);
  await page.evaluate(
    ({ message, uploadFiles }) => {
      const stream = document.querySelector("#litigationStream");
      const textarea = document.querySelector("#litigationComposer");
      if (textarea) textarea.value = "";
      const filesHtml = uploadFiles.length
        ? `<div class="litigation-files">${uploadFiles.map((file) => `<span class="litigation-file">${file}</span>`).join("")}</div>`
        : "";
      stream.insertAdjacentHTML(
        "beforeend",
        `<div class="litigation-bubble-row user">
          <div class="litigation-bubble">
            <div class="litigation-bubble-label">用户</div>
            ${message.replaceAll("\n", "<br>")}${filesHtml}
          </div>
        </div>`,
      );
      stream.scrollTop = stream.scrollHeight;
    },
    { message: escapeForBrowser(text), uploadFiles: files.map(escapeForBrowser) },
  );
  await page.waitForTimeout(500);
}

function escapeForBrowser(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function agentReply(page, text, hold = 1600) {
  await page.evaluate(() => {
    const stream = document.querySelector("#litigationStream");
    stream.insertAdjacentHTML(
      "beforeend",
      `<div class="litigation-bubble-row assistant pending">
        <div class="litigation-bubble">
          <div class="litigation-bubble-label">张律师民事诉讼助手</div>
          <span id="streamingReply"></span>
        </div>
      </div>`,
    );
    stream.scrollTop = stream.scrollHeight;
  });

  const chunks = [];
  for (let i = 0; i < text.length; i += 18) chunks.push(text.slice(0, i + 18));
  for (const chunk of chunks) {
    await page.evaluate((value) => {
      const target = document.querySelector("#streamingReply");
      const stream = document.querySelector("#litigationStream");
      if (target) target.innerHTML = value.replaceAll("\n", "<br>");
      stream.scrollTop = stream.scrollHeight;
    }, escapeForBrowser(chunk));
    await page.waitForTimeout(90);
  }

  await page.evaluate(() => {
    const target = document.querySelector("#streamingReply");
    if (target) target.removeAttribute("id");
    document.querySelector(".pending")?.classList.remove("pending");
  });
  await page.waitForTimeout(hold);
}

async function addWorkflowCard(page, activeIndex = 0) {
  await page.evaluate(
    ({ steps, active }) => {
      const stream = document.querySelector("#litigationStream");
      const rows = steps
        .map((step, index) => {
          const level = [1, 3, 5, 7].includes(index) ? "人工确认" : "自动执行";
          const desc = [
            "核对还款日、催收记录和中断证据",
            "检查主体、借条、转账、现金交付证明",
            "按被告住所地和合同履行地匹配法院",
            "生成起诉状、证据目录和保全申请",
            "估算受理费、保全费和担保费用",
            "同步形成保全申请与财产线索清单",
            "整理线上/线下立案材料包",
            "跟踪受理、缴费、补正、开庭节点",
            "胜诉后衔接执行申请与财产查询",
          ][index];
          return `
            <div class="workflow-step ${index === active ? "active" : ""}" data-node="${index + 1}">
              <span class="step-number">${index + 1}</span>
              <div><strong>${step}</strong><small>${desc}</small></div>
              <span class="level-badge">${level}</span>
            </div>`;
        })
        .join("");
      stream.insertAdjacentHTML(
        "beforeend",
        `<article class="workflow-card">
          <div class="workflow-card-head">
            <div>
              <h3>从现在到法院受理的 9 步工作流</h3>
              <p>每个节点都能继续追问、检查材料并生成下一步文件。</p>
            </div>
            <div class="workflow-summary">
              <span>9 个节点</span><span>约 2-4 周</span><span>4 次人工确认</span>
            </div>
          </div>
          <div class="workflow-list">${rows}</div>
        </article>`,
      );
      stream.scrollTop = stream.scrollHeight;
    },
    { steps: workflowSteps, active: activeIndex },
  );
  await page.waitForTimeout(1800);
}

async function setWorkflowActive(page, activeIndex) {
  await page.evaluate((active) => {
    document.querySelectorAll(".workflow-step").forEach((node, index) => {
      node.classList.toggle("active", index === active);
    });
    document.querySelector(".workflow-card")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, activeIndex);
  await page.waitForTimeout(800);
}

async function addEvidenceCard(page) {
  await page.evaluate(() => {
    const stream = document.querySelector("#litigationStream");
    stream.insertAdjacentHTML(
      "beforeend",
      `<article class="result-card" id="evidenceCard">
        <div class="result-card-head">
          <div>
            <h3>证据完整性与效力评估</h3>
            <p>先看是否能证明借贷合意、资金交付和主体身份。</p>
          </div>
        </div>
        <div class="result-body">
          <div class="verdict-grid">
            <div class="verdict-row"><strong>主体证据</strong><span class="risk-badge ok">齐全</span><span>身份证号、户籍地址已提供。</span></div>
            <div class="verdict-row"><strong>借贷合意</strong><span class="risk-badge ok">齐全</span><span>借条原件清晰，金额、日期、签名完整。</span></div>
            <div class="verdict-row"><strong>交付凭证</strong><span class="risk-badge warn">缺失 200 万</span><span>银行回单覆盖 300 万，现金交付部分举证难度较高。</span></div>
          </div>
          <div class="result-tip">建议补充银行取现流水、当日沟通记录或在场见证人；无法补强时，可优先围绕转账部分确定诉讼请求。</div>
        </div>
      </article>`,
    );
    stream.scrollTop = stream.scrollHeight;
  });
  await page.waitForTimeout(1900);
}

async function addFeeCard(page) {
  await page.evaluate(() => {
    const stream = document.querySelector("#litigationStream");
    stream.insertAdjacentHTML(
      "beforeend",
      `<article class="result-card" id="feeCard">
        <div class="result-card-head">
          <div>
            <h3>费用计算与保全策略建议</h3>
            <p>以下为诉讼环节费用估算，最终以法院和担保机构确认为准。</p>
          </div>
        </div>
        <div class="result-body">
          <div class="fee-grid">
            <div class="fee-row"><strong>案件受理费</strong><span>约 46,800 元</span><span>立案时缴纳</span></div>
            <div class="fee-row"><strong>财产保全申请费</strong><span>5,000 元</span><span>申请保全时缴纳</span></div>
            <div class="fee-row"><strong>保全保函费用</strong><span>1.5%-3%</span><span>按担保公司报价</span></div>
          </div>
          <div class="result-tip">胜诉后可主张由被告承担案件受理费，但原告通常需要先行垫付。</div>
        </div>
      </article>`,
    );
    stream.scrollTop = stream.scrollHeight;
  });
  await page.waitForTimeout(1800);
}

async function addPackageCard(page) {
  await page.evaluate(() => {
    const stream = document.querySelector("#litigationStream");
    stream.insertAdjacentHTML(
      "beforeend",
      `<article class="result-card" id="packageCard">
        <div class="result-card-head">
          <div>
            <h3>立案材料包</h3>
            <p>已按管辖法院常用格式整理，可用于线上立案或线下提交。</p>
          </div>
        </div>
        <div class="result-body">
          <div class="package-grid">
            <div class="package-row"><strong>起诉状.docx</strong><span>诉讼请求、事实理由、证据引用已填写</span></div>
            <div class="package-row"><strong>证据目录.xlsx</strong><span>借条、回单、微信催收按证明目的归类</span></div>
            <div class="package-row"><strong>财产保全申请书.docx</strong><span>同步包含担保材料和财产线索清单</span></div>
          </div>
        </div>
      </article>`,
    );
    stream.scrollTop = stream.scrollHeight;
  });
  await page.waitForTimeout(1600);
}

async function addRecap(page) {
  await page.evaluate(() => {
    const stream = document.querySelector("#litigationStream");
    stream.insertAdjacentHTML(
      "beforeend",
      `<section class="workflow-card" id="recapCard">
        <div class="workflow-card-head">
          <div>
            <h3>流程结果回看</h3>
            <p>工作流、证据、费用和材料包都沉淀为可继续执行的节点。</p>
          </div>
        </div>
        <div class="result-body">
          <div class="recap-grid">
            <div class="recap-card"><h4>工作流图</h4><p>9 个节点覆盖从时效到执行预案的完整路径。</p></div>
            <div class="recap-card"><h4>证据评估</h4><p>明确现金交付举证风险和补强动作。</p></div>
            <div class="recap-card"><h4>费用明细</h4><p>拆分受理费、保全费和保函费用。</p></div>
            <div class="recap-card"><h4>材料包</h4><p>输出起诉状、证据目录和保全申请书。</p></div>
          </div>
        </div>
      </section>`,
    );
    stream.scrollTop = stream.scrollHeight;
  });
  await page.waitForTimeout(3000);
}

async function showBrandEnd(page) {
  await page.evaluate(() => {
    const overlay = document.createElement("div");
    overlay.className = "brand-overlay";
    overlay.innerHTML = `
      <section class="brand-card">
        <h1 class="brand-title">AgentShare</h1>
        <p>把一个高门槛的行业流程，带着用户一步步跑完。</p>
      </section>
    `;
    document.body.appendChild(overlay);
  });
  await page.waitForTimeout(5200);
}

function formatSrtTime(seconds) {
  const ms = Math.floor((seconds % 1) * 1000);
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

async function writeSubtitles() {
  const blocks = narration.map(([start, end, text], index) => {
    return `${index + 1}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${text}`;
  });
  await fsp.writeFile(subtitlePath, `\ufeff${blocks.join("\n\n")}\n`, "utf8");
}

async function record() {
  await fsp.mkdir(outDir, { recursive: true });
  await fsp.rm(videoDir, { recursive: true, force: true });
  await fsp.mkdir(videoDir, { recursive: true });

  const server = await ensureServer();
  const executablePath = findBrowserExecutable();
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ["--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    locale: "zh-CN",
    recordVideo: {
      dir: videoDir,
      size: viewport,
    },
  });
  const page = await context.newPage();

  try {
    await page.goto(`${appUrl}?recording=${Date.now()}`, { waitUntil: "networkidle" });
    await installDemoLayer(page);
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
    });

    const startedAt = Date.now();
    await moveCursor(page, 180, 180, 500);
    await page.waitForTimeout(900);
    await moveCursor(page, 610, 424, 700);
    await page.waitForTimeout(900);
    await moveCursor(page, 1010, 424, 700);
    await page.waitForTimeout(900);
    await clickWithCursor(page, '[data-agent-id="private-lending-litigation-agent"]', { x: 170, y: 116 });
    await page.waitForTimeout(900);
    await clickWithCursor(page, '[data-run-agent="private-lending-litigation-agent"]', { x: 80, y: 22 });
    await page.waitForTimeout(900);
    await prepareRunDemo(page);
    await moveCursor(page, 1350, 910, 500);
    await paceTo(page, startedAt, 5);

    await typeComposer(
      page,
      "我 2022 年 3 月借给一个朋友 500 万，约定 2023 年 6 月还，到现在一直拖着不还，催了几次都没回。我想自己起诉，能搞吗？",
    );
    await paceTo(page, startedAt, 18);
    await agentReply(
      page,
      "可以自起诉。从时间看诉讼时效还在 3 年内，但标的金额较高，我需要先确认几个关键信息：\n1. 是否有借条或借款合同？\n2. 资金是转账还是现金交付？\n3. 催收记录是否能证明对方承认欠款？\n4. 是否掌握借款人身份证号和住所地？",
      1800,
    );
    await paceTo(page, startedAt, 34);

    await typeComposer(
      page,
      "借条有，500 万里 300 万走的银行转账，剩下 200 万是现金。催过 3 次都是微信。借款人身份证号我也有。",
      ["借条.pdf", "银行回单.jpg", "微信催收.png"],
    );
    await page.waitForTimeout(1000);
    await paceTo(page, startedAt, 48);
    await typeComposer(page, "好了，材料都给你了，接下来我该怎么办？");
    await agentReply(
      page,
      "好。根据你提供的借条、回单和催收记录，我把“从现在到法院受理”这条路拆成了 9 个步骤，你可以一步步往下点。",
      1200,
    );
    await addWorkflowCard(page, 0);
    await paceTo(page, startedAt, 70);

    await moveCursor(page, 332, 454, 500);
    await typeComposer(page, "[点击节点①] → 时效有问题吗？");
    await setWorkflowActive(page, 0);
    await agentReply(
      page,
      "时效本身没过：从约定还款日 2023-06-01 到今天还没满 3 年。我检查了你上传的 3 条微信催收记录，其中一条对方回复了“再等等”，可以作为时效中断证据。建议保留原始聊天文件做公证备用。",
      1800,
    );
    await paceTo(page, startedAt, 90);

    await moveCursor(page, 362, 526, 500);
    await typeComposer(page, "那我的证据够不够？");
    await setWorkflowActive(page, 1);
    await agentReply(page, "先看证据链：主体身份和借贷合意比较完整，主要风险在现金交付部分。", 900);
    await addEvidenceCard(page);
    await paceTo(page, startedAt, 118);

    await moveCursor(page, 370, 752, 500);
    await typeComposer(page, "整套打下来要花多少钱？");
    await setWorkflowActive(page, 4);
    await agentReply(page, "我按案件受理、财产保全和担保费用三部分拆给你看：", 900);
    await addFeeCard(page);
    await paceTo(page, startedAt, 140);

    await moveCursor(page, 364, 882, 500);
    await typeComposer(page, "[点击节点⑦] → 帮我准备立案材料。");
    await setWorkflowActive(page, 6);
    await agentReply(
      page,
      "好，我按管辖法院的格式给你打包好了。你可以走法院线上立案小程序提交，也可以打印后线下递交。",
      1000,
    );
    await addPackageCard(page);
    await paceTo(page, startedAt, 162);
    await addRecap(page);
    await paceTo(page, startedAt, 172);
    await showBrandEnd(page);
    await paceTo(page, startedAt, 178);

    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    const recordedPath = await video.path();
    await fsp.copyFile(recordedPath, finalVideoPath);
    await writeSubtitles();

    if (server) server.kill();
  } catch (error) {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    if (server) server.kill();
    throw error;
  }
}

record()
  .then(async () => {
    const video = await fsp.stat(finalVideoPath);
    console.log(`wrote ${finalVideoPath}`);
    console.log(`wrote ${subtitlePath}`);
    console.log(`size ${(video.size / 1024 / 1024).toFixed(1)} MB`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
