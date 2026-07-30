// =====================================================================
// OTIS FARM VENTURE — shared behaviour across all pages
// =====================================================================
const WA_NUMBER = '2348029920521';

/* ---- navbar scroll state ---- */
const nav = document.getElementById('mainNav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- mobile menu ---- */
function toggleMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  const opening = !menu.classList.contains('open');
  btn.classList.toggle('open');
  menu.classList.toggle('open');
  document.body.style.overflow = opening ? 'hidden' : '';
}

/* ---- hero background zoom-in once loaded ---- */
window.addEventListener('load', () => {
  const bg = document.getElementById('heroBg');
  if (bg) bg.classList.add('loaded');
});

/* ---- scroll reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---- animated stat numbers ---- */
function animateCount(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^(\d+)(.*)$/); // leading integer + any suffix (+, K, etc)
  if (!match) return; // non-numeric labels (e.g. "FCT") are left as-is
  const target = parseInt(match[1], 10);
  const suffix = match[2];
  const duration = 1300;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.js-count').forEach((el) => countObserver.observe(el));

/* ---- WhatsApp order helper (product cards) ---- */
function order(product) {
  const msg = encodeURIComponent(`Hello Otis Farm Venture, I'm interested in ${product}. Please send details and pricing.`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

/* ---- contact form -> WhatsApp ---- */
function sendContact() {
  const name = document.getElementById('cfName')?.value.trim();
  const phone = document.getElementById('cfPhone')?.value.trim();
  const need = document.getElementById('cfNeed')?.value;
  const msg = document.getElementById('cfMsg')?.value.trim();
  if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
  let txt = `Hi Otis Farm Venture, my name is ${name}.`;
  if (need) txt += ` I'm interested in: ${need}.`;
  if (msg) txt += ` Details: ${msg}`;
  txt += ` My contact: ${phone}.`;
  const success = document.getElementById('cfSuccess');
  const submitBtn = document.querySelector('.cf-submit');
  if (success) success.style.display = 'block';
  if (submitBtn) submitBtn.style.display = 'none';
  setTimeout(() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`, '_blank'), 500);
}

/* ---- about page read more ---- */
function toggleAbout() {
  const exp = document.getElementById('aboutExp');
  const btn = document.getElementById('aboutBtn');
  if (!exp || !btn) return;
  const isOpen = exp.classList.contains('open');
  exp.classList.toggle('open');
  btn.classList.toggle('open');
  btn.innerHTML = isOpen ? 'Read More <span class="arr">&darr;</span>' : 'Show Less <span class="arr">&uarr;</span>';
}

/* =====================================================================
   PAGE TRANSITION CURTAIN — the logo travels between pages
===================================================================== */
(function pageTransitions() {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;

  // reveal the current page once everything is ready
  const revealPage = () => {
    requestAnimationFrame(() => {
      setTimeout(() => curtain.classList.add('hidden'), 220);
    });
  };
  if (document.readyState === 'complete') revealPage();
  else window.addEventListener('load', revealPage);

  // intercept internal navigation and play the curtain first
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!href.endsWith('.html') && href !== '/' && !href.match(/^[a-zA-Z0-9_-]+\.html/)) return;

    e.preventDefault();
    document.body.classList.add('transitioning');
    curtain.classList.remove('hidden');
    setTimeout(() => { window.location.href = href; }, 520);
  });
})();
