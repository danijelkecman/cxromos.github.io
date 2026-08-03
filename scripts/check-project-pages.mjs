import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile('dist/projects/index.html', 'utf8');
const detail = await readFile('dist/projects/risk-watch/index.html', 'utf8');

assert.match(
  index,
  /href="\/work"[^>]*>Work<\/a>[\s\S]*href="\/projects"[^>]*>Projects<\/a>[\s\S]*href="\/insights"[^>]*>Insights<\/a>/
);
assert.match(index, /href="\/projects\/risk-watch"/);
assert.match(index, /Risk Watch/);
assert.match(detail, /href="https:\/\/riskwatchgroup\.com\/"/);
assert.match(detail, /target="_blank"/);
assert.match(detail, /rel="noopener noreferrer"/);
assert.match(
  detail,
  /alt="Risk Watch dashboard showing early-warning and confirmation signals for private-credit stress"/
);

console.log('Project page contracts passed.');
