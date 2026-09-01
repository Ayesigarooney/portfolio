/* ================================================
   Portfolio — script.js
   ================================================ */

// Run everything once the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  setYear();
  navbar();
  heroCanvas();
  typing();
  projectFilter();
  scrollReveal();
  counters();
  contactForm();
  backToTop();
});

/* ------------------------------------------------
   1. Footer year
   ------------------------------------------------ */
function setYear() {
  var el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ------------------------------------------------
   2. Navbar
   ------------------------------------------------ */
function navbar() {
  var nav      = document.getElementById('navbar');
  var ham      = document.getElementById('ham');
  var navList  = document.getElementById('nav-list');
  var links    = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');
  var hint     = document.querySelector('.scroll-hint');

  // Mobile toggle
  ham.addEventListener('click', function () {
    ham.classList.toggle('open');
    navList.classList.toggle('open');
  });

  // Close on link click + smooth scroll
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      ham.classList.remove('open');
      navList.classList.remove('open');
      var id     = link.getAttribute('href');
      var target = document.querySelector(id);
      if (!target) return;
      var navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 68;
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
  });

  // Scroll events
  window.addEventListener('scroll', function () {
    var y = window.scrollY;

    // Navbar shadow
    nav.classList.toggle('scrolled', y > 40);

    // Hide scroll hint
    if (hint) hint.style.opacity = y > 100 ? '0' : '1';

    // Active link
    var current = '';
    sections.forEach(function (s) {
      if (y >= s.offsetTop - 160) current = s.id;
    });
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

/* ------------------------------------------------
   3. Hero canvas — connected particles
   ------------------------------------------------ */
function heroCanvas() {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, pts;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = [];
    for (var i = 0; i < 65; i++) {
      pts.push({
        x : Math.random() * W,
        y : Math.random() * H,
        r : Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        a : Math.random() * 0.45 + 0.08
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Lines
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx   = pts[i].x - pts[j].x;
        var dy   = pts[i].y - pts[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(153,246,228,' + (0.1 * (1 - dist / 115)) + ')';
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    // Dots
    for (var k = 0; k < pts.length; k++) {
      var p = pts[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(153,246,228,' + p.a + ')';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
}

/* ------------------------------------------------
   4. Typing effect
   ------------------------------------------------ */
function typing() {
  var el = document.getElementById('typed');
  if (!el) return;

  var words = [
    'Full‑Stack Developer',
    'Flutter & Dart Engineer',
    'Mobile App Builder',
    'ML Enthusiast',
    'IoT Systems Dev',
    'Problem Solver'
  ];

  var wi = 0, ci = 0, deleting = false;

  function tick() {
    var word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

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
  }

  setTimeout(tick, 1200);
}

/* ------------------------------------------------
   5. Project filter
   ------------------------------------------------ */
function projectFilter() {
  var btns  = document.querySelectorAll('.fbtn');
  var cards = document.querySelectorAll('.pcard');

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var f = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        c.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ------------------------------------------------
   6. Scroll reveal
   ------------------------------------------------ */
function scrollReveal() {
  var targets = document.querySelectorAll(
    '.pcard, .scard, .sk, .about-grid, .contact-grid, .astat, .check-list li, .sec-head'
  );

  targets.forEach(function (el) {
    el.classList.add('reveal');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  targets.forEach(function (el) { io.observe(el); });
}

/* ------------------------------------------------
   7. Animated counters
   ------------------------------------------------ */
function counters() {
  var els = document.querySelectorAll('.counter');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el     = entry.target;
      var target = parseInt(el.getAttribute('data-target'), 10);
      var step   = Math.max(1, Math.ceil(target / 50));
      var cur    = 0;

      var timer = setInterval(function () {
        cur = Math.min(cur + step, target);
        el.textContent = cur + '+';
        if (cur >= target) clearInterval(timer);
      }, 36);

      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  els.forEach(function (el) { io.observe(el); });
}

/* ------------------------------------------------
   8. Contact form
   ------------------------------------------------ */
function contactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = form.querySelector('#cf-name').value.trim();
    var email   = form.querySelector('#cf-email').value.trim();
    var subject = form.querySelector('#cf-subject').value.trim();
    var message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Enter a valid email address.', 'error');
      return;
    }

    var btn  = form.querySelector('button[type="submit"]');
    var orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Sending…';
    btn.disabled  = true;

    fetch(form.action, {
      method : 'POST',
      body   : new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        showToast("Message sent! I'll reply soon.", 'success');
        form.reset();
      } else {
        showToast('Something went wrong. Please try again.', 'error');
      }
    })
    .catch(function () {
      showToast('Network error. Please try again.', 'error');
    })
    .finally(function () {
      btn.innerHTML = orig;
      btn.disabled  = false;
    });
  });
}

/* ------------------------------------------------
   9. Toast notifications
   ------------------------------------------------ */
function showToast(msg, type) {
  document.querySelectorAll('.ar-toast').forEach(function (t) { t.remove(); });

  var colors = { success: '#059669', error: '#dc2626', info: '#0d9488' };
  var icons  = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };

  var el = document.createElement('div');
  el.className   = 'ar-toast';
  el.innerHTML   = '<i class="fas fa-' + icons[type] + '"></i>&nbsp;' + msg;

  var s = el.style;
  s.position      = 'fixed';
  s.top           = '80px';
  s.right         = '20px';
  s.background    = colors[type] || colors.info;
  s.color         = '#fff';
  s.padding       = '13px 22px';
  s.borderRadius  = '10px';
  s.boxShadow     = '0 6px 24px rgba(0,0,0,.18)';
  s.zIndex        = '9999';
  s.opacity       = '0';
  s.transform     = 'translateX(110%)';
  s.transition    = 'all .32s ease';
  s.display       = 'flex';
  s.alignItems    = 'center';
  s.gap           = '8px';
  s.fontSize      = '.92rem';
  s.fontWeight    = '500';
  s.maxWidth      = '340px';
  s.fontFamily    = 'inherit';

  document.body.appendChild(el);

  requestAnimationFrame(function () {
    el.style.opacity   = '1';
    el.style.transform = 'translateX(0)';
  });

  setTimeout(function () {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(110%)';
    setTimeout(function () { el.remove(); }, 340);
  }, 5000);
}

/* ------------------------------------------------
   10. Back to top
   ------------------------------------------------ */
function backToTop() {
  var btn = document.getElementById('to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
