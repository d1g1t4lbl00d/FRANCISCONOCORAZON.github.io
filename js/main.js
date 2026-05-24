'use strict';

/* ── Navbar ─────────────────────────── */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 10);
  backTop.classList.toggle('visible', y > 500);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Mobile menu ────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── Reveal on scroll ───────────────── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── KPI counters ───────────────────── */
function animateNum(el, target, isFloat) {
  const dur = 1400;
  const t0 = performance.now();
  const run = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = isFloat
      ? (e * target).toFixed(2)
      : Math.round(e * target);
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = isFloat ? target.toFixed(2) : target;
  };
  requestAnimationFrame(run);
}

const kpiObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-target]').forEach(el => {
      const v = parseFloat(el.dataset.target);
      animateNum(el, v, false);
    });
    kpiObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroKpis = document.querySelector('.hero-kpis');
if (heroKpis) kpiObs.observe(heroKpis);

/* ── Active nav on scroll ───────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a:not(.btn-presupuesto)');
const activeObs  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--t1)' : '';
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });
sections.forEach(s => activeObs.observe(s));

/* ── Form ───────────────────────────── */
const form   = document.getElementById('presupuestoForm');
const formOk = document.getElementById('formOk');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      f.classList.remove('error');
      const empty = f.type === 'checkbox' ? !f.checked : !f.value.trim();
      if (empty) { f.classList.add('error'); valid = false; }
    });
    if (!valid) { form.querySelector('.error')?.focus(); return; }

    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Enviando…';

    setTimeout(() => {
      form.style.display = 'none';
      formOk.classList.add('show');
    }, 1000);
  });

  form.querySelectorAll('input,textarea,select').forEach(f =>
    f.addEventListener('input', () => f.classList.remove('error'))
  );
}

/* ── Smooth scroll ──────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
    ) || 68;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ── Footer year ────────────────────── */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
