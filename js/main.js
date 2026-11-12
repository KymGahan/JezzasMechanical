// show the top of the page only once fonts + emblem are ready, so it all animates in together
Promise.all([document.fonts.ready, new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r))]).then(() => document.documentElement.classList.add('ready'));

// nav: scrolled state, mobile menu, progress bar
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  bar.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight)})`;
}, { passive: true });

// scroll reveal + counters
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1800, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  io.unobserve(e.target);
}), { threshold: .2 });
document.querySelectorAll('.reveal, .steps').forEach(el => io.observe(el));

// card spotlight follows cursor
document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', e.clientX - r.left + 'px');
  c.style.setProperty('--y', e.clientY - r.top + 'px');
}));

const tabs = [...document.querySelectorAll('.tabbar a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) tabs.forEach(t => t.classList.toggle('active', t.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['top', 'services', 'reviews', 'contact'].forEach(id => spy.observe(document.getElementById(id)));
document.getElementById('yr').textContent = new Date().getFullYear();
