/* ============================================================
   script.js — Ayesiga Rooney Portfolio
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initNavbar();
  initHeroCanvas();
  initTyping();
  initScrollReveal();
  initProjectFilter();
  initCounters();
  initContactForm();
  initBackToTop();
});

/* ------------------------------------------------------------
   1. Footer year — always current
   ------------------------------------------------------------ */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------
   2. Navbar — scroll state + mobile menu + active link
   ------------------------------------------------------------ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  /* Mobile toggle */
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  /* Close on link click */
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY
                       - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* Scroll: navbar shadow + active link */
  const scrollDown = document.querySelector('.scroll-down');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    if (scrollDown) scrollDown.style.opacity = y > 120 ? '0' : '1';

    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 160) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ------------------------------------------------------------
   3. Hero canvas — animated particles
   ------------------------------------------------------------ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: 70 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a:  Math.random() * 0.45 + 0.08
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Draw lines between close particles */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(153,246,228,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    /* Draw particles */
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(153,246,228,${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
}

/* ------------------------------------------------------------
   4. Typing effect
   ------------------------------------------------------------ */
function initTyping() {
  const el = document.getElementById('typed');
  if (!el) return;

  const words = [
    'Full-Stack Developer',
    'Flutter & Dart Engineer',
    'Mobile App Builder',
    'ML Enthusiast',
    'IoT Systems Dev',
    'Problem Solver'
  ];

  let wi = 0, ci = 0, deleting = false;

  (function tick() {
    const word = words[wi];
    el.textContent = deleting
      ? word.slice(0, ci--)
      : word.slice(0, ci++);

    if (!deleting && ci > word.length) {
      deleting = true;
      setTimeout(tick, 2400);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      wi = (wi + 1) % words.length;
    }
    setTimeout(tick, deleting ? 42 : 96);
  })();
}

/* ------------------------------------------------------------
   5. Scroll reveal
   ------------------------------------------------------------ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.pcard, .scard, .skill, .about-grid, .contact-grid, .as-item, .about-list li, .section-head'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => io.observe(el));
}

/* ------------------------------------------------------------
   6. Project filter
   ------------------------------------------------------------ */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.pcard');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('hidden', !show);
        if (show) c.style.animation = 'none';
      });
    });
  });
}

/* ------------------------------------------------------------
   7. Animated stat counters
   ------------------------------------------------------------ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      let current  = 0;
      const step   = Math.max(1, Math.ceil(target / 55));

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 36);

      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
}

/* ------------------------------------------------------------
   8. Contact form
   ------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fields = ['name', 'email', 'subject', 'message'];
    for (const f of fields) {
      if (!form[f].value.trim()) {
        toast('Please fill in all fields.', 'error');
        form[f].focus();
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
      toast('Enter a valid email address.', 'error');
      return;
    }

    const btn   = form.querySelector('button[type="submit"]');
    const orig  = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        toast("Message sent! I'll reply soon.", 'success');
        form.reset();
      } else {
        toast('Something went wrong. Please try again.', 'error');
      }
    } catch {
      toast('Network error. Please try again.', 'error');
    } finally {
      btn.innerHTML = orig;
      btn.disabled  = false;
    }
  });
}

/* ------------------------------------------------------------
   9. Toast notification
   ------------------------------------------------------------ */
function toast(msg, type = 'info') {
  document.querySelectorAll('.ar-toast').forEach(t => t.remove());

  const map = {
    success: { bg: '#059669', icon: 'check-circle' },
    error:   { bg: '#dc2626', icon: 'exclamation-circle' },
    info:    { bg: '#0d9488', icon: 'info-circle' }
  };
  const { bg, icon } = map[type];

  const el = document.createElement('div');
  el.className = 'ar-toast';
  el.innerHTML = `<i class="fas fa-${icon}"></i> ${msg}`;
  Object.assign(el.style, {
    position: 'fixed', top: '82px', right: '20px',
    background: bg, color: '#fff',
    padding: '13px 22px', borderRadius: '10px',
    boxShadow: '0 6px 24px rgba(0,0,0,.18)',
    zIndex: '9999', opacity: '0',
    transform: 'translateX(110%)',
    transition: 'all .32s ease',
    display: 'flex', alignItems: 'center', gap: '10px',
    fontSize: '.92rem', fontWeight: '500',
    maxWidth: '340px', fontFamily: 'inherit'
  });

  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity   = '1';
    el.style.transform = 'translateX(0)';
  });
  setTimeout(() => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(110%)';
    setTimeout(() => el.remove(), 340);
  }, 5000);
}

/* ------------------------------------------------------------
   10. Back-to-top button
   ------------------------------------------------------------ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ------------------------------------------------------------
   11. Smooth page-load fade-in
   ------------------------------------------------------------ */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
