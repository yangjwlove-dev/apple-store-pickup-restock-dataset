#!/usr/bin/env node
/**
 * Reproducible public snapshot fetcher for the Apple Store In-Store Pickup Restock Dataset.
 * Calls strictly public, anonymous CC BY 4.0 endpoints on restockcheck.com.
 *
 * Usage: node scripts/fetch_snapshot.mjs [outputDir]
 */
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://restockcheck.com/api/stock/public";
const outDir = path.resolve(process.argv[2] || "./fresh-snapshot");
const headers = { "User-Agent": "RestockCheckOpenDatasetFetcher/1.0" };

async function fetchJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

await fs.mkdir(path.join(outDir, "stores"), { recursive: true });
const [summary, stores, serviceReport] = await Promise.all([
  fetchJson(`${BASE_URL}/summary`),
  fetchJson(`${BASE_URL}/stores`),
  fetchJson(`${BASE_URL}/service-report`),
]);

await fs.writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
await fs.writeFile(path.join(outDir, "stores.json"), JSON.stringify(stores, null, 2));
await fs.writeFile(path.join(outDir, "service-report.json"), JSON.stringify(serviceReport, null, 2));

let ok = 0;
for (const s of stores.data.stores) {
  const detail = await fetchJson(`${BASE_URL}/store/${s.country}/${s.slug}`);
  await fs.writeFile(
    path.join(outDir, "stores", `${s.country}_${s.slug}.json`),
    JSON.stringify(detail, null, 2)
  );
  ok++;
}

console.log(`Fetched public CC BY 4.0 snapshot (${ok} hub stores) into ${outDir}`);
