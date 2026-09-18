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
    ${hero(profile, variant, href, asset)}
    ${intro(profile)}
    ${worksSection(works, asset)}
    ${servicePlans(services, profile, variant)}
    ${contact(profile, variant, services, href)}
    ${footer(profile)}
  </main>
</body>
</html>
`;
}
