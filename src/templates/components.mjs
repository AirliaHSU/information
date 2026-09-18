export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = (items, tag = 'span') => items.map(item => `<${tag}>${escape(item)}</${tag}>`).join('');
const paragraphs = items => items.map(item => `<p>${escape(item)}</p>`).join('');
export const sectionTitle = title => `<div class="section-title"><span class="section-title-line"></span><h2 class="label">${escape(title)}</h2><span class="section-title-line"></span></div>`;
const button = (label, href) => `<div class="cta-wrap"><a class="cta-btn" href="${escape(href)}">${escape(label)}</a></div>`;

export function mailLink(profile, variant, services, plan) {
  const subject = variant.showServices ? services.mailSubject : variant.mailSubject;
  const lines = variant.showServices ? services.mailBody.map(line => line.replace('{plan}', plan || 'A / B / C / 不確定（想先討論）')) : variant.mailBody;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

export function hero(profile, variant, href, asset) {
  return `<section class="hero"><div class="hero-header">
    <img src="${asset(profile.avatar)}" alt="${escape(profile.avatarAlt)}" class="hero-avatar" width="96" height="96">
    <div class="hero-text"><h1 class="hero-name">${escape(profile.name)}</h1>
    <div class="hero-role"><strong>${escape(variant.role)}</strong>${escape(variant.roleSuffix)}</div>
    <p class="hero-tagline">${escape(variant.tagline)}</p>${button(variant.cta, href)}</div>
  </div></section>`;
}

export function intro(profile) {
  const heading = text => `<div class="card-title"><span class="card-title-dot"></span><h2 class="card-title-text">${text}</h2></div>`;
  return `<section class="intro-section" aria-label="個人簡介與技能">
    <article class="card hover-raise">${heading('ABOUT')}<p>${escape(profile.about)}</p><div class="tag-row">${profile.tags.map(tag => `<span class="tag hover-raise">${escape(tag)}</span>`).join('')}</div></article>
    <article class="card hover-raise">${heading('SKILLS')}<ul class="skills-list">${list(profile.skills, 'li')}</ul><div class="tools-row">${profile.tools.map(tool => `<span class="tool-chip hover-raise">${escape(tool)}</span>`).join('')}</div></article>
  </section>`;
}

function workCard(work) {
  return `<article class="work-card hover-raise${work.category === 'logo' ? ' logo-card' : ''}" data-work-id="${escape(work.id)}">
    <div class="work-header"><h3 class="work-title"><span class="bracket">【</span>${escape(work.title)}<span class="bracket">】</span></h3><div class="work-tags">${list(work.tags)}</div></div>
    ${work.description ? `<p class="work-desc">${escape(work.description)}</p><div class="divider-line"></div>` : ''}
    <div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${escape(work.videoId)}" title="${escape(work.videoTitle)}" loading="lazy" allowfullscreen></iframe></div>
    ${work.roles.length || work.tools.length ? `<div class="work-footer"><div class="chips">${work.roles.map(role => `<span class="chip">${escape(role)}</span>`).join('')}</div><span>工具：${escape(work.tools.join(' / '))}</span></div>` : ''}
  </article>`;
}

export function worksSection(works, asset) {
  const animations = works.filter(work => work.category === 'animation');
  const logos = works.filter(work => work.category === 'logo');
  const storyboards = works.filter(work => work.category === 'storyboard');
  return `${animations.length ? `${sectionTitle('動畫作品')}<section class="works-slider" aria-label="動畫作品輪播"><div class="slider-window"><div class="slider-track">${animations.map(workCard).join('')}</div></div>
    <div class="slider-controls" hidden><div class="slider-dots">${animations.map((work, i) => `<button type="button" class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="第 ${i + 1} 支動畫：${escape(work.title)}" aria-pressed="${i === 0}"></button>`).join('')}</div><button type="button" class="slider-toggle">暫停自動輪播</button></div></section>` : ''}
    ${logos.length ? `${sectionTitle('LOGO 動畫')}<section class="logo-grid" aria-label="Logo Motion 作品">${logos.map(workCard).join('')}</section>` : ''}
    ${storyboards.length ? `${sectionTitle('分鏡設計作品')}<section class="storyboard-section" aria-label="分鏡作品">${storyboards.map(work => `<article class="storyboard-block hover-raise" data-work-id="${escape(work.id)}"><h3 class="storyboard-title">${escape(work.title)}</h3><p class="storyboard-desc">${escape(work.description)}</p><div class="divider-line"></div><div class="storyboard-grid">${work.images.map(image => `<img src="${asset(image.src)}" alt="${escape(image.alt)}" loading="lazy">`).join('')}</div></article>`).join('')}</section>` : ''}`;
}

export function servicePlans(services, profile, variant) {
  if (!variant.showServices) return '';
  return `${sectionTitle('服務方案')}<p class="plan-note">${escape(services.note)}</p><section class="plans-grid" aria-label="接案服務方案">${services.plans.map(plan => `<article class="work-card hover-raise plan-card"><div class="plan-head"><div class="plan-label">${escape(plan.label)}</div><h3 class="plan-title">${escape(plan.title)}</h3><div class="plan-sub">${escape(plan.subtitle)}</div></div><p class="plan-desc">${escape(plan.description)}</p><ul class="plan-list">${list(plan.items, 'li')}</ul><p class="plan-exclude">${escape(plan.note)}</p>${button('選擇此方案詢問', mailLink(profile, variant, services, plan.id))}</article>`).join('')}</section>`;
}

export function contact(profile, variant, services, href) {
  return `<section class="contact-card hover-raise" id="contact"><h2>CONTACT</h2>${paragraphs(variant.contactIntro)}${variant.showServices ? `<ul class="contact-list">${list(services.contactItems, 'li')}</ul><p>${escape(services.response)}</p>` : ''}<div class="contact-center">${button(variant.cta, href)}<div class="hint">或直接來信：<a href="mailto:${escape(profile.email)}">${escape(profile.email)}</a></div></div></section>`;
}

export const footer = profile => `<footer>© <span id="year">${new Date().getFullYear()}</span> ${escape(profile.footer)}</footer>`;
