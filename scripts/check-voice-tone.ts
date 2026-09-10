#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const TELL_PHRASES = [
  "take care of yourself",
  "but seriously",
  "in all seriousness",
  "we hope you",
  "remember to",
];

export function findSincerityBreaks(html: string): string[] {
  const lower = html.toLowerCase();
  return TELL_PHRASES.filter((phrase) => lower.includes(phrase));
}

interface RenderedPage {
  path: string;
  id: string;
}

/** Every rendered page except the slide decks and the 404 page — same walk as spec/voice.test.ts's helper. */
function renderedContentPages(): RenderedPage[] {
  const pages: RenderedPage[] = [];
  const root = resolve("dist");
  function walk(dir: string): void {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (path === resolve("dist/decks")) continue;
        walk(path);
      } else if (name === "index.html") {
        pages.push({ path, id: relative(root, path) });
      }
    }
  }
  walk(root);
  return pages;
}

function main(): void {
  let flagged = 0;
  for (const { path, id } of renderedContentPages()) {
    if (id.startsWith("policies/")) continue;
    for (const phrase of findSincerityBreaks(readFileSync(path, "utf8"))) {
      console.warn(`! ${id}: possible sincerity break — "${phrase}"`);
      flagged++;
    }
  }
  console.log(
    flagged === 0
      ? "✓ no sincerity-break tell-phrases found"
      : `! ${flagged} possible sincerity break(s) — review, not a build failure`,
  );
  // Always exits 0: F6/F12 require this to never fail pnpm check.
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
