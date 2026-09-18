import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile('dist/projects/index.html', 'utf8');
const detail = await readFile('dist/projects/risk-watch/index.html', 'utf8');
const cavok = await readFile('dist/projects/cav-ok/index.html', 'utf8');

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

assert.match(index, /href="\/projects\/cav-ok"/);
assert.match(cavok, /Shepard inverse-distance weighting/);
assert.match(cavok, /Temperature-dew-point spread/);
assert.match(cavok, /Great-circle cross-track distance/);
assert.match(cavok, /alt="CAV-OK regional flight-category heatmap on iPad"/);
assert.match(cavok, /alt="CAV-OK wind overlay on iPhone"/);
assert.doesNotMatch(cavok, /Visit CAV-OK/);

console.log('Project page contracts passed.');
