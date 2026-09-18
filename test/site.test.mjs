import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build, readData, root } from '../scripts/build.mjs';
import { renderPage } from '../src/templates/page.mjs';

await build();
const data = await readData();
const freelance = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const portfolio = await readFile(resolve(root, 'dist/portfolio/index.html'), 'utf8');
const workIds = html => [...html.matchAll(/data-work-id="([^"]+)"/g)].map(match => match[1]);
const mailLinks = html => [...html.matchAll(/href="(mailto:[^"]+)"/g)].map(match => new URL(match[1].replaceAll('&amp;', '&')));

test('both pages contain every shared work in static HTML', () => {
  assert.deepEqual(workIds(freelance), data.works.map(work => work.id));
  assert.deepEqual(workIds(portfolio), workIds(freelance));
  assert.equal((portfolio.match(/class="slider-dot(?: active)?"/g) || []).length, data.works.filter(work => work.category === 'animation').length);
});

test('portfolio excludes freelance sections, CTAs and quote mail templates', () => {
  for (const word of ['服務方案', '開始討論專案', '選擇此方案詢問', '自由接案方式合作', '報價區間', '方案選擇']) {
    assert.ok(!decodeURIComponent(portfolio).includes(word), word);
  }
  assert.ok(portfolio.includes('聯繫職缺與面談'));
  for (const url of mailLinks(portfolio).filter(url => url.search)) {
    assert.equal(url.searchParams.get('subject'), '【職缺與面談】聯繫 Airlia');
    assert.ok(url.searchParams.get('body').includes('職缺名稱：'));
  }
});

test('freelance retains each service and preselects the clicked plan', () => {
  const links = mailLinks(freelance);
  for (const plan of data.services.plans) {
    assert.ok(freelance.includes(plan.title));
    assert.ok(links.some(url => url.searchParams.get('body')?.includes(`方案選擇（必填）：${plan.id}\n`)));
  }
  assert.ok(freelance.includes(data.services.response));
});

test('metadata is version-specific and all local resources exist under the Pages base path', async () => {
  for (const [html, variant] of [[freelance, data.config.pages[0]], [portfolio, data.config.pages[1]]]) {
    const url = `${data.config.siteUrl}${data.config.basePath}${variant.path}`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`));
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      if (/^(?:https:|mailto:)/.test(match[1])) continue;
      assert.ok(match[1].startsWith(data.config.basePath), match[1]);
      await access(resolve(root, 'dist', match[1].slice(data.config.basePath.length)));
    }
  }
});

test('one data edit propagates to both variants and HTML text is escaped', () => {
  const changed = structuredClone(data);
  changed.works[0].title = 'Updated <work> & "title"';
  changed.works.push({ ...changed.works[0], id: 'additional-animation' });
  for (const variant of changed.config.pages) {
    const html = renderPage({ ...changed, variant });
    assert.ok(html.includes('Updated &lt;work&gt; &amp; &quot;title&quot;'));
    assert.ok(workIds(html).includes('additional-animation'));
    assert.equal((html.match(/class="slider-dot(?: active)?"/g) || []).length, 4);
  }
});
