#!/usr/bin/env node
// Minimal chromium-cli-alike REPL driver for the Arvand Chair static site.
// Serves the project root over HTTP (fonts/CDN scripts need http:, not file:)
// and drives a headless Chromium against it via Playwright.
//
// Usage:
//   node driver.mjs                 # interactive: reads commands from stdin
//   node driver.mjs < script.txt    # batch: pipe a command script
//
// Commands (one per line):
//   serve [port]                    start the static server (default 4173)
//   nav <path>                      goto http://localhost:<port><path>
//   wait-for text=<substring>       wait until text appears on the page
//   wait-for <css-selector>         wait until selector is visible
//   screenshot [name]               full-page PNG -> screenshots/<name>.png
//   screenshot-element <sel> [name] crop screenshot of one element
//   click <selector>
//   fill <selector> <text...>
//   press <key>
//   scroll <pixels>                 window.scrollBy(0, pixels)
//   scroll-to <selector>            scrollIntoView on selector
//   eval <js-expression>            evaluate in page, prints JSON result
//   console                         print all buffered console messages
//   console --errors                print only page errors / console.error
//   quit                            close browser + server, exit

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", ".."); // .claude/skills/run-arvand-template -> project root
const SHOT_DIR = path.join(__dirname, "screenshots");
if (!existsSync(SHOT_DIR)) mkdirSync(SHOT_DIR, { recursive: true });

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".json": "application/json",
};

let server = null;
let port = 4173;
let browser = null;
let page = null;
const consoleLog = [];
let shotCounter = 0;

function log(...args) { console.log(...args); }

async function startServer(p) {
  if (server) return;
  port = p || port;
  server = createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(PROJECT_ROOT, urlPath);
    if (!filePath.startsWith(PROJECT_ROOT) || !existsSync(filePath)) {
      res.writeHead(404); res.end("not found"); return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  });
  await new Promise((resolve) => server.listen(port, resolve));
  log(`server listening on http://localhost:${port} (root: ${PROJECT_ROOT})`);
}

async function ensureBrowser() {
  if (browser) return;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  page = await context.newPage();
  page.on("console", (msg) => consoleLog.push({ type: msg.type(), text: msg.text() }));
  page.on("pageerror", (err) => consoleLog.push({ type: "pageerror", text: String(err) }));
}

function parseArgs(rest, n) {
  // splits into n parts, last part keeps remaining spaces (e.g. `fill sel some text`)
  const parts = rest.split(" ");
  const head = parts.slice(0, n - 1);
  const tail = parts.slice(n - 1).join(" ");
  return [...head, tail];
}

async function handle(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return true;
  const sp = trimmed.indexOf(" ");
  const cmd = sp === -1 ? trimmed : trimmed.slice(0, sp);
  const rest = sp === -1 ? "" : trimmed.slice(sp + 1).trim();

  switch (cmd) {
    case "serve": {
      await startServer(rest ? Number(rest) : undefined);
      break;
    }
    case "nav": {
      await ensureBrowser();
      await startServer();
      const url = rest.startsWith("http") ? rest : `http://localhost:${port}${rest.startsWith("/") ? "" : "/"}${rest}`;
      await page.goto(url, { waitUntil: "load" });
      log(`nav -> ${url}`);
      break;
    }
    case "wait-for": {
      if (rest.startsWith("text=")) {
        const text = rest.slice(5);
        await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout: 15000 });
      } else {
        await page.waitForSelector(rest, { state: "visible", timeout: 15000 });
      }
      log(`wait-for ${rest} -> ok`);
      break;
    }
    case "screenshot": {
      const name = rest || `shot-${++shotCounter}`;
      const file = path.join(SHOT_DIR, `${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      log(`screenshot -> ${file}`);
      break;
    }
    case "screenshot-element": {
      const [sel, name] = parseArgs(rest, 2);
      const el = page.locator(sel).first();
      const file = path.join(SHOT_DIR, `${name || `shot-${++shotCounter}`}.png`);
      await el.screenshot({ path: file });
      log(`screenshot-element ${sel} -> ${file}`);
      break;
    }
    case "click": {
      await page.locator(rest).first().click();
      log(`click ${rest} -> ok`);
      break;
    }
    case "fill": {
      const [sel, text] = parseArgs(rest, 2);
      await page.locator(sel).first().fill(text);
      log(`fill ${sel} -> "${text}"`);
      break;
    }
    case "press": {
      await page.keyboard.press(rest);
      log(`press ${rest} -> ok`);
      break;
    }
    case "scroll": {
      await page.evaluate((px) => window.scrollBy(0, px), Number(rest));
      log(`scroll ${rest} -> ok`);
      break;
    }
    case "scroll-to": {
      await page.locator(rest).first().scrollIntoViewIfNeeded();
      log(`scroll-to ${rest} -> ok`);
      break;
    }
    case "eval": {
      const result = await page.evaluate(rest);
      log(JSON.stringify(result));
      break;
    }
    case "console": {
      const errorsOnly = rest.trim() === "--errors";
      const filtered = errorsOnly
        ? consoleLog.filter((m) => m.type === "error" || m.type === "pageerror")
        : consoleLog;
      if (filtered.length === 0) log(errorsOnly ? "(no console errors)" : "(no console output)");
      else filtered.forEach((m) => log(`[${m.type}] ${m.text}`));
      break;
    }
    case "quit": {
      if (browser) await browser.close();
      if (server) await new Promise((r) => server.close(r));
      return false;
    }
    default:
      log(`unknown command: ${cmd}`);
  }
  return true;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  for await (const line of rl) {
    try {
      const keepGoing = await handle(line);
      if (keepGoing === false) break;
    } catch (err) {
      log(`error: ${err.message}`);
    }
  }
  if (browser) await browser.close();
  if (server) await new Promise((r) => server.close(r));
  process.exit(0);
}

main();
