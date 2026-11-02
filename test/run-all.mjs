#!/usr/bin/env node
/**
 * dsh-memory-graph 的测试入口。
 *
 * 本包独立成库后，测试也跟着搬过来 —— 断言的就是这里的 client.js。
 * 核心插件那边的测试只覆盖 RPC 通道与快照投影（跨包契约），不碰渲染逻辑。
 *
 * 用法：node test/run-all.mjs
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const SUITES = [
  ["graph-panel", "面板：数据规整 / 布局分簇 / 空态 / 源码卫生（浏览器半纯逻辑）"],
];

const results = [];

for (const [name, desc] of SUITES) {
  console.log("\n" + "─".repeat(60));
  console.log(`▶ ${desc}`);
  console.log("─".repeat(60));

  const r = spawnSync(process.execPath, [join(here, `${name}.test.mjs`)], {
    stdio: "inherit",
    cwd: join(here, ".."),
  });
  results.push({ name, desc, code: r.status ?? 1 });
}

console.log("\n" + "=".repeat(60));
console.log("汇总");
console.log("=".repeat(60));
let failed = 0;
for (const r of results) {
  const mark = r.code === 0 ? "✓" : "✗";
  if (r.code !== 0) failed += 1;
  console.log(`  ${mark} ${r.name.padEnd(18)} ${r.desc}`);
}
console.log("");
if (failed > 0) {
  console.log(`${failed} / ${results.length} 个套件失败\n`);
  process.exit(1);
}
console.log(`${results.length} / ${results.length} 个套件全部通过\n`);
