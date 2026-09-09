export interface TopicSegment {
  text: string;
  code: boolean;
}

/** Bullets under a lecture's `## Content` heading, backticks intact,
 *  continuation lines (indented two spaces) rejoined onto their bullet. */
export function extractContentTopics(body: string): string[] {
  const heading = body.match(/^## Content\n/m);
  if (!heading) return [];
  const afterHeading = body.slice((heading.index ?? 0) + heading[0].length);
  const nextHeading = afterHeading.match(/\n## /);
  const section = nextHeading ? afterHeading.slice(0, nextHeading.index) : afterHeading;
  const bullets: string[] = [];
  for (const line of section.split("\n")) {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2).trim());
    } else if (line.trim() && bullets.length > 0) {
      bullets[bullets.length - 1] += ` ${line.trim()}`;
    }
  }
  return bullets;
}

/** First `maxWords` words of `raw`, extending the cutoff to the end of
 *  any backtick-delimited span the naive boundary would otherwise split. */
export function truncateTopic(raw: string, maxWords = 4): TopicSegment[] {
  const words = raw.split(/\s+/);
  let end = raw.length;
  if (words.length > maxWords) {
    let charCount = 0;
    for (let i = 0; i < maxWords; i++) {
      charCount += words[i].length + 1;
    }
    end = charCount - 1;
    const upTo = raw.slice(0, end);
    const openCount = (upTo.match(/`/g) ?? []).length;
    if (openCount % 2 === 1) {
      const close = raw.indexOf("`", end);
      end = close === -1 ? raw.length : close + 1;
    }
  }
  const truncated = raw.slice(0, end);
  const segments: TopicSegment[] = [];
  let lastIndex = 0;
  for (const codeMatch of truncated.matchAll(/`([^`]+)`/g)) {
    if (codeMatch.index! > lastIndex) {
      segments.push({ text: truncated.slice(lastIndex, codeMatch.index), code: false });
    }
    segments.push({ text: codeMatch[1], code: true });
    lastIndex = codeMatch.index! + codeMatch[0].length;
  }
  if (lastIndex < truncated.length) {
    segments.push({ text: truncated.slice(lastIndex), code: false });
  }
  return segments;
}
