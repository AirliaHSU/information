import { readFile, mkdir, writeFile, cp, rm, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { renderPage } from '../src/templates/page.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export async function readData() {
  const read = name => readFile(resolve(root, `src/data/${name}.json`), 'utf8').then(JSON.parse);
  const [profile, works, services, config] = await Promise.all(['profile', 'works', 'services', 'variants'].map(read));
  return { profile, works, services, config };
}

export async function build() {
  const data = await readData();
  const { config, profile, works } = data;
  if (!/^\/(?:[\w-]+\/)*$/.test(config.basePath)) throw new Error('basePath 必須以 / 開頭與結尾');
  if (new Set(works.map(work => work.id)).size !== works.length) throw new Error('作品 id 不可重複');
  const paths = config.pages.map(page => page.path);
  if (new Set(paths).size !== paths.length) throw new Error('頁面路徑不可重複');
  for (const path of paths) if (!/^(?:[\w-]+\/)*$/.test(path)) throw new Error(`無效頁面路徑：${path}`);
  const assets = [profile.avatar, config.shareImage];
  for (const work of works) {
    if (!['animation', 'logo', 'storyboard'].includes(work.category)) throw new Error(`無效作品類別：${work.id}`);
    if (work.category === 'storyboard') assets.push(...work.images.map(image => image.src));
    else if (!/^[\w-]{11}$/.test(work.videoId)) throw new Error(`無效 YouTube ID：${work.id}`);
  }
  for (const asset of assets) {
    if (!/^(?:images\/[\w.-]+|airlia-avatar\.png)$/.test(asset)) throw new Error(`無效圖片路徑：${asset}`);
    await access(resolve(root, asset));
  }
  const output = resolve(root, 'dist');
  // Fixed, repository-local output directory; never delete a configurable path.
  if (dirname(output) !== resolve(root)) throw new Error('Output must stay inside the repository');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(resolve(root, 'src/assets'), resolve(output, 'assets'), { recursive: true });
  await cp(resolve(root, 'images'), resolve(output, 'images'), { recursive: true });
  await cp(resolve(root, profile.avatar), resolve(output, profile.avatar));
  await writeFile(resolve(output, '.nojekyll'), '');
  for (const variant of config.pages) {
    const target = resolve(output, variant.path, 'index.html');
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, renderPage({ ...data, variant }));
  }
  console.log(`Built ${config.pages.length} pages and ${works.length} shared works in dist/`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
