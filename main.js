/* ============================
   ECON POLAND – MAIN JS
   Scroll Reveal · Navbar · Form
   ============================ */

// ── Scroll-Reveal (Intersection Observer) ──────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children in the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((s, idx) => { if (s === entry.target) delay = idx * 80; });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObs.observe(el));

// ── Navbar scroll effect ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger menu ──────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger-btn');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Active nav link highlight on scroll ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--lime)' : '';
  });
}, { passive: true });

// ── Parallax on hero image ──────────────────────────────────────────
const heroBgImg = document.getElementById('hero-bg-img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBgImg.style.transform = `scale(1.04) translateY(${y * 0.18}px)`;
  }, { passive: true });
}

// ── Contact form ────────────────────────────────────────────────────
const form        = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit-btn');
const btnText     = submitBtn.querySelector('.btn-text');
const btnLoading  = submitBtn.querySelector('.btn-loading');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.querySelectorAll('input[required], select[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });
    return;
  }
  // Simulate async send
  btnText.style.display = 'none';
  btnLoading.style.display = 'block';
  submitBtn.disabled = true;
  setTimeout(() => {
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    form.reset();
    formSuccess.style.display = 'block';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
  }, 1800);
});

// ── Smooth number counter animation ────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsEl = document.getElementById('hero-stats');
if (statsEl) {
  const statNums = statsEl.querySelectorAll('.stat-num');
  const targets = [500, 10, 98];
  const suffixes = ['+', '+', '%'];
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      statNums.forEach((el, i) => animateCounter(el, targets[i], suffixes[i]));
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsEl);
}

// ── Glow pulse on hover for package cards ──────────────────────────
document.querySelectorAll('.package-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.3s, box-shadow 0.3s, transform 0.3s';
  });
});

// ── Lazy-load images with fade-in ──────────────────────────────────
const imgs = document.querySelectorAll('img');
imgs.forEach(img => {
  img.style.transition = 'opacity 0.5s ease';
  if (!img.complete) {
    img.style.opacity = '0';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
  }
});

console.log('%c⚡ ECON Poland – Landing Page loaded', 'color:#84CC16;font-weight:bold;font-size:14px;');
