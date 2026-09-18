document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.works-slider').forEach(slider => {
  const track = slider.querySelector('.slider-track');
  const slides = [...track.children];
  const dots = [...slider.querySelectorAll('.slider-dot')];
  const toggle = slider.querySelector('.slider-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let paused = reducedMotion.matches;
  const show = index => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(${-current * 100}%)`;
    slides.forEach((slide, i) => {
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-pressed', String(i === current));
    });
  };
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    toggle.textContent = paused ? '播放自動輪播' : '暫停自動輪播';
    if (!paused && slides.length > 1 && !document.hidden && !slider.matches(':hover, :focus-within')) {
      timer = setInterval(() => show(current + 1), 10000);
    }
  };
  if (!slides.length) return;
  slider.classList.add('is-enhanced');
  slider.querySelector('.slider-controls').hidden = slides.length < 2;
  show(0);
  dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); start(); }));
  toggle.addEventListener('click', () => { paused = !paused; start(); });
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', () => setTimeout(start, 0));
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; start(); });
  start();
});
