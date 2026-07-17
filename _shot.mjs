import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000/birmingham-plumbing-demo";
const out = process.argv[3] || "shot";
const dir = "/tmp/claude-1000/-workspaces-New/1cf6cbbf-c43b-4d64-9542-847b34a09742/scratchpad";

const browser = await chromium.launch();

// Desktop full page
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const dp = await desktop.newPage();
await dp.goto(url, { waitUntil: "networkidle" });
// Scroll through to trigger whileInView reveals, then return to top.
await dp.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});
await dp.waitForTimeout(600);
await dp.screenshot({ path: `${dir}/${out}-desktop.png`, fullPage: true });

// Desktop hero only (above the fold)
await dp.screenshot({ path: `${dir}/${out}-hero.png`, clip: { x: 0, y: 0, width: 1440, height: 820 } });

// Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mp = await mobile.newPage();
await mp.goto(url, { waitUntil: "networkidle" });
await mp.waitForTimeout(1200);
await mp.screenshot({ path: `${dir}/${out}-mobile.png`, fullPage: true });

await browser.close();
console.log("done");
