const pages = [...document.querySelectorAll('.page')];
const navigation = [...document.querySelectorAll('[data-page]')];
const titles = { home: 'Ruslan Shevchuk | Software Developer', work: 'Work | Ruslan Shevchuk', about: 'About | Ruslan Shevchuk' };

function showPage(moveFocus = false) {
  const requested = location.hash.slice(1) || 'home';
  if (requested === 'main') { document.getElementById('main').focus(); return; }
  const current = Object.hasOwn(titles, requested) ? requested : 'home';
  pages.forEach(page => { page.hidden = page.id !== current; });
  navigation.forEach(link => {
    if (link.dataset.page === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = titles[current];
  if (moveFocus) {
    document.getElementById(`${current}-title`).focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
showPage();
window.addEventListener('hashchange', () => showPage(true));

const themeButton = document.getElementById('theme-toggle');
const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme;
try { savedTheme = localStorage.getItem('ruslan-theme'); } catch { /* Storage is optional. */ }
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.textContent = dark ? 'day mode' : 'night mode';
  themeButton.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#191725' : '#faf9f6';
}
setTheme(savedTheme ? savedTheme === 'dark' : themePreference.matches);
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  setTheme(dark);
  savedTheme = dark ? 'dark' : 'light';
  try { localStorage.setItem('ruslan-theme', savedTheme); } catch { /* Keep the session preference. */ }
});
themePreference.addEventListener('change', event => { if (!savedTheme) setTheme(event.matches); });

const motionButton = document.getElementById('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
function setMotion() {
  document.body.classList.toggle('motion-paused', paused);
  motionButton.textContent = reducedMotion.matches ? 'reduced motion' : paused ? 'resume motion' : 'pause motion';
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = reducedMotion.matches;
}
setMotion();
motionButton.addEventListener('click', () => { paused = !paused; setMotion(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; setMotion(); });

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('rshevchuk2007@gmail.com');
    status.textContent = 'Email copied. Thanks for reaching out!';
  } catch {
    status.textContent = 'rshevchuk2007@gmail.com';
  }
});
