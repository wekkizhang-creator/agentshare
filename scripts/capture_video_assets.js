const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "video_assets", "screens");

async function capture(page, name) {
  await page.waitForTimeout(350);
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: false,
  });
}

async function setMarketCategory(page, category, agentId) {
  await page.evaluate(
    ({ category, agentId }) => {
      state.activeView = "market";
      state.activeCategory = category;
      state.activeAgentId = agentId;
      setView("market");
      renderCategories();
      renderAgentGrid();
    },
    { category, agentId },
  );
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await page.waitForLoadState("domcontentloaded");

  await capture(page, "01_market");

  await setMarketCategory(page, "办公", "spreadsheet-helper");
  await capture(page, "02_office_agents");

  await setMarketCategory(page, "小说创作", "tomato-novel-writer");
  await capture(page, "03_paid_agents");

  await page.click('[data-view="build"]');
  await page.fill("#builderOwnerId", "demo_user_001");
  await page.fill("#builderAgentName", "产品原型顾问");
  await page.fill("#builderGoal", "帮助产品经理把一句话需求拆成页面结构、交互流程、关键状态和可验证的原型任务。");
  await capture(page, "04_build_agent");

  await page.click('[data-view="import"]');
  await page.click('[data-source="AgentBind"]');
  await page.fill("#authorizationCode", "AP-DEMO-2026-BIND");
  await capture(page, "05_import_bind");

  await page.click('[data-view="run"]');
  await capture(page, "06_run_workspace");

  await page.click('[data-view="creator"]');
  await capture(page, "07_creator_console");

  await page.click('[data-view="billing"]');
  await capture(page, "08_billing");

  await setMarketCategory(page, "全部", "commerce");
  await capture(page, "09_closing");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
