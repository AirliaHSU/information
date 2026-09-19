document.getElementById('year').textContent = new Date().getFullYear();
const tabs = [...document.querySelectorAll('.work-tabs a')];
const panels = [...document.querySelectorAll('.work-panel')];
const tablist = document.querySelector('.work-tabs');
tablist.setAttribute('role', 'tablist');
tabs.forEach(tab => { tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', tab.hash.slice(1)); });
panels.forEach(panel => { panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', `tab-${panel.id}`); panel.tabIndex = 0; });
function selectCategory(id) {
  const heading = document.querySelector('#works > .section-title .label');
  if (heading) heading.textContent = panels.find(panel => panel.id === id).getAttribute('aria-label');
  panels.forEach(panel => {
    panel.hidden = panel.id !== id;
    if (panel.hidden) panel.querySelectorAll('iframe').forEach(frame => frame.replaceWith(frame._cover));
  });
  tabs.forEach(tab => { const selected = tab.hash === `#${id}`; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
}
function fromHash() {
  const id = location.hash.slice(1);
  if (panels.some(panel => panel.id === id)) selectCategory(id);
  else if (!id) selectCategory('animation');
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', event => {
    event.preventDefault();
    if (location.hash !== tab.hash) history.pushState(null, '', tab.hash);
    selectCategory(tab.hash.slice(1));
  });
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); tabs[next].click(); }
    if (event.key === ' ') { event.preventDefault(); tab.click(); }
  });
});
selectCategory('animation');
fromHash();
window.addEventListener('hashchange', fromHash);
window.addEventListener('popstate', fromHash);
document.querySelectorAll('.video-cover').forEach(cover => cover.addEventListener('click', event => {
  event.preventDefault();
  const frame = document.createElement('iframe');
  frame.className = 'inline-player';
  frame.src = `https://www.youtube.com/embed/${cover.dataset.video}?autoplay=1`;
  frame.title = cover.dataset.title;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame._cover = cover;
  cover.replaceWith(frame);
  frame.focus();
}));
const dialog = document.querySelector('.image-dialog');
const fullImage = dialog.querySelector('img');
document.querySelectorAll('.storyboard-preview').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  fullImage.src = link.href;
  fullImage.alt = link.querySelector('img').alt;
  dialog.showModal();
}));
dialog.querySelector('button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.05 });
  document.querySelectorAll('.work-card, .storyboard-block, .intro-section, .contact-card').forEach((el, i) => {
    el.classList.add('reveal'); el.style.setProperty('--reveal-delay', `${i % 3 * 65}ms`); observer.observe(el);
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')); });
}
