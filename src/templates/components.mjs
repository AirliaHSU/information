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
    <p class="hero-tagline">${escape(variant.tagline)}</p></div>
  </div></section>`;
}

export function intro(profile) {
  const heading = text => `<div class="card-title"><span class="card-title-dot"></span><h2 class="card-title-text">${text}</h2></div>`;
  return `<section class="intro-section" id="about" aria-label="個人簡介與技能">
    <article class="card hover-raise">${heading('ABOUT')}<p>${escape(profile.about)}</p><div class="tag-row">${profile.tags.map(tag => `<span class="tag hover-raise">${escape(tag)}</span>`).join('')}</div></article>
    <article class="card hover-raise">${heading('SKILLS')}<ul class="skills-list">${list(profile.skills, 'li')}</ul><div class="tools-row">${profile.tools.map(tool => `<span class="tool-chip hover-raise">${escape(tool)}</span>`).join('')}</div></article>
  </section>`;
}

function workCard(work) {
  return `<article class="work-card hover-raise${work.category === 'logo' ? ' logo-card' : ''}" data-work-id="${escape(work.id)}">
    <div class="work-header"><h3 class="work-title"><span class="bracket">【</span>${escape(work.title)}<span class="bracket">】</span></h3><div class="work-tags">${list(work.tags)}</div></div>
    ${work.description ? `<p class="work-desc">${escape(work.description)}</p><div class="divider-line"></div>` : ''}
    <a class="video-cover" href="https://www.youtube.com/watch?v=${escape(work.videoId)}" data-video="${escape(work.videoId)}" data-title="${escape(work.videoTitle)}" aria-label="播放：${escape(work.videoTitle)}"><img src="https://i.ytimg.com/vi/${escape(work.videoId)}/hqdefault.jpg" alt="${escape(work.videoTitle)}" loading="lazy"><span class="play-label">▶ 播放作品</span></a>
    ${work.roles.length || work.tools.length ? `<div class="work-footer"><div class="chips">${work.roles.map(role => `<span class="chip">${escape(role)}</span>`).join('')}</div><span>工具：${escape(work.tools.join(' / '))}</span></div>` : ''}
  </article>`;
}

export function worksSection(works, asset, portfolio = false) {
  const groups = [['animation', '動畫作品'], ['logo', 'Logo Motion'], ['storyboard', '分鏡設計']];
  return `<section id="works" aria-label="作品展示">${portfolio ? sectionTitle(groups[0][1]) : ''}<div class="work-tabs" aria-label="作品分類">${groups.map(([id, title]) => `<a id="tab-${id}" href="#${id}">${title}${portfolio ? '' : `<span>${works.filter(work => work.category === id).length}</span>`}</a>`).join(portfolio ? '<span class="tab-separator" aria-hidden="true">｜</span>' : '')}</div>${groups.map(([id, title]) => `<section id="${id}" class="work-panel" aria-label="${title}">${portfolio ? '' : sectionTitle(title)}<div class="work-grid">${works.filter(work => work.category === id).map(work => id === 'storyboard' ? `<article class="storyboard-block" data-work-id="${escape(work.id)}"><h3 class="storyboard-title">${escape(work.title)}</h3><p class="storyboard-desc">${escape(work.description)}</p><div class="storyboard-grid">${work.images.map(image => `<a class="storyboard-preview" href="${asset(image.src)}" aria-label="放大：${escape(image.alt)}"><img src="${asset(image.src)}" alt="${escape(image.alt)}" loading="lazy"><span>查看完整分鏡 ↗</span></a>`).join('')}</div></article>` : workCard(work)).join('')}</div></section>`).join('')}</section>`;
}

export function servicePlans(services, profile, variant) {
  if (!variant.showServices) return '';
  return `${sectionTitle('服務方案')}<p class="plan-note">${escape(services.note)}</p><section class="plans-grid" aria-label="接案服務方案">${services.plans.map(plan => `<article class="work-card hover-raise plan-card"><div class="plan-head"><div class="plan-label">${escape(plan.label)}</div><h3 class="plan-title">${escape(plan.title)}</h3><div class="plan-sub">${escape(plan.subtitle)}</div></div><p class="plan-desc">${escape(plan.description)}</p><ul class="plan-list">${list(plan.items, 'li')}</ul><p class="plan-exclude">${escape(plan.note)}</p>${button('選擇此方案詢問', mailLink(profile, variant, services, plan.id))}</article>`).join('')}</section>`;
}

export function contact(profile, variant, services, href) {
  return `<section class="contact-card hover-raise" id="contact"><h2>CONTACT</h2>${paragraphs(variant.contactIntro)}${variant.showServices ? `<ul class="contact-list">${list(services.contactItems, 'li')}</ul><p>${escape(services.response)}</p>` : ''}<div class="contact-center">${button(variant.cta, href)}<div class="hint">或直接來信：<a href="mailto:${escape(profile.email)}">${escape(profile.email)}</a></div></div></section>`;
}

export const footer = profile => `<footer>© <span id="year">${new Date().getFullYear()}</span> ${escape(profile.footer)}</footer>`;
