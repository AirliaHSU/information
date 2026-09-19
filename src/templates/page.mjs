import { escape, mailLink, hero, intro, worksSection, servicePlans, contact, footer } from './components.mjs';

export function renderPage({ profile, works, services, config, variant }) {
  const asset = path => escape(config.basePath + path);
  const url = new URL(config.basePath + variant.path, config.siteUrl).href;
  const href = mailLink(profile, variant, services);
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(variant.title)}</title>
  <meta name="description" content="${escape(variant.description)}">
  <meta name="author" content="${escape(profile.name)}">
  <link rel="canonical" href="${escape(url)}">
  <meta property="og:title" content="${escape(variant.title)}">
  <meta property="og:description" content="${escape(variant.description)}">
  <meta property="og:image" content="${escape(new URL(config.basePath + config.shareImage, config.siteUrl).href)}">
  <meta property="og:url" content="${escape(url)}">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="${asset('assets/styles.css')}">
  <script src="${asset('assets/main.js')}" defer></script>
</head>
<body data-variant="${escape(variant.id)}">
  <main class="page">
    <nav class="site-nav" aria-label="主要導覽"><span class="edition">${variant.id === 'portfolio' ? 'PORTFOLIO · 作品集' : 'FREELANCE · 動畫與分鏡服務'}</span><div><a href="#works">作品</a><a href="#about">關於我</a><a href="#contact">聯絡</a></div></nav>
    ${hero(profile, variant, href, asset)}
    ${worksSection(works, asset, true)}
    ${intro(profile)}
    ${servicePlans(services, profile, variant)}
    ${contact(profile, variant, services, href)}
    ${footer(profile)}
    <dialog class="image-dialog" aria-label="分鏡大圖"><button type="button" class="dialog-close">關閉大圖</button><img alt=""></dialog>
  </main>
</body>
</html>
`;
}
