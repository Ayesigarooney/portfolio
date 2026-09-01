/* ===========================
   Portfolio — script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    setFooterYear();
    initNavigation();
    initScrollEffects();
    initTypingEffect();
    initProjectFilter();
    initScrollReveal();
    initContactForm();
    initStatCounters();
    initParticles();
    initThemeToggle();
});

/* ───────────────────────────
   Footer year — auto-updates
   ─────────────────────────── */
function setFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ───────────────────────────
   Navigation
   ─────────────────────────── */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    const navLinks  = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');

            const id = link.getAttribute('href');
            const target = document.querySelector(id);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
            }
        });
    });

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const about = document.querySelector('#about');
            if (about) window.scrollTo({ top: about.offsetTop - 70, behavior: 'smooth' });
        });
    }
}

/* ───────────────────────────
   Scroll effects & active nav
   ─────────────────────────── */
function initScrollEffects() {
    const navbar   = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // Navbar opacity
        if (y > 80) {
            navbar.style.background = 'rgba(255,255,255,0.98)';
            navbar.style.boxShadow  = '0 2px 24px rgba(0,0,0,0.12)';
        } else {
            navbar.style.background = 'rgba(255,255,255,0.95)';
            navbar.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.08)';
        }

        // Scroll indicator fade
        if (scrollIndicator) {
            scrollIndicator.style.opacity = y > 120 ? '0' : '1';
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            if (y >= section.offsetTop - 200) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }, { passive: true });
}

/* ───────────────────────────
   Typing effect
   ─────────────────────────── */
function initTypingEffect() {
    const el = document.getElementById('typing-title');
    if (!el) return;

    const titles = [
        'Full-Stack Developer',
        'Flutter & Dart Dev',
        'Mobile App Builder',
        'ML Enthusiast',
        'IoT Engineer',
        'Problem Solver'
    ];

    let ti = 0, ci = 0, deleting = false;

    function type() {
        const word = titles[ti];
        el.textContent = deleting
            ? word.substring(0, ci--)
            : word.substring(0, ci++);

        if (!deleting && ci === word.length + 1) {
            setTimeout(() => { deleting = true; }, 2200);
        } else if (deleting && ci < 0) {
            deleting = false;
            ci = 0;
            ti = (ti + 1) % titles.length;
        }

        setTimeout(type, deleting ? 45 : 100);
    }

    setTimeout(type, 1800);
}

/* ───────────────────────────
   Project filter
   ─────────────────────────── */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                if (match) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease both';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ───────────────────────────
   Scroll reveal
   ─────────────────────────── */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.project-card, .skill-item, .skills-category, .about-content, .contact-content, .stat, .highlight-item'
    );

    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
}

/* ───────────────────────────
   Stat counters
   ─────────────────────────── */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            let current  = 0;
            const step   = Math.ceil(target / 50);

            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current + '+';
                if (current >= target) clearInterval(timer);
            }, 40);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ───────────────────────────
   Contact form
   ─────────────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name    = form.name.value.trim();
        const email   = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        btn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        })
        .then(res => {
            if (res.ok) {
                showNotification("Message sent! I'll get back to you soon.", 'success');
                form.reset();
            } else {
                showNotification('Something went wrong. Please try again.', 'error');
            }
        })
        .catch(() => showNotification('Network error. Please try again.', 'error'))
        .finally(() => {
            btn.innerHTML = origHTML;
            btn.disabled = false;
        });
    });
}

/* ───────────────────────────
   Notification toast
   ─────────────────────────── */
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const colors = { success: '#10b981', error: '#ef4444', info: '#667eea' };
    const icons  = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };

    const toast = document.createElement('div');
    toast.className = 'notification';
    toast.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${message}`;
    Object.assign(toast.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        background: colors[type],
        color: 'white',
        padding: '14px 22px',
        borderRadius: '10px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
        zIndex: '10001',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.35s ease',
        fontSize: '0.95rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '360px'
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 350);
    }, 5000);
}

/* ───────────────────────────
   Canvas particle background
   ─────────────────────────── */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    container.appendChild(canvas);

    let W, H, particles = [];

    function resize() {
        W = canvas.width  = container.offsetWidth;
        H = canvas.height = container.offsetHeight;
    }

    function Particle() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.o  = Math.random() * 0.5 + 0.1;
    }

    function init() {
        particles = Array.from({ length: 80 }, () => new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167,139,250,${p.o})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
}

/* ───────────────────────────
   Theme toggle (dark / light)
   ─────────────────────────── */
function initThemeToggle() {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.innerHTML = '<i class="fas fa-moon"></i>';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
        zIndex: '999',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem'
    });

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = btn.querySelector('i');
        icon.className = document.body.classList.contains('dark-theme')
            ? 'fas fa-sun'
            : 'fas fa-moon';
    });

    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.1)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });

    // Dark theme CSS
    const style = document.createElement('style');
    style.textContent = `
        body.dark-theme { background: #0f0c29; color: #e2e8f0; }
        body.dark-theme .navbar { background: rgba(15,12,41,0.95) !important; }
        body.dark-theme .nav-link { color: #c7d2fe; }
        body.dark-theme .about,
        body.dark-theme .projects,
        body.dark-theme .contact { background: #16133a; }
        body.dark-theme .skills,
        body.dark-theme #about { background: #1a1740; }
        body.dark-theme .project-card,
        body.dark-theme .skills-category,
        body.dark-theme .contact-form { background: #1e1b4b; border-color: #312e81; color: #e2e8f0; }
        body.dark-theme .project-content h3,
        body.dark-theme .skills-category h3,
        body.dark-theme .contact-info h3 { color: #e2e8f0; }
        body.dark-theme .project-content p,
        body.dark-theme .skill-item span,
        body.dark-theme .contact-info > p,
        body.dark-theme .contact-item { color: #a5b4fc; }
        body.dark-theme .about-text p { color: #a5b4fc; }
        body.dark-theme .section-title { color: #e2e8f0; }
        body.dark-theme .form-group input,
        body.dark-theme .form-group textarea { background: #2e2b6e; border-color: #4338ca; color: #e2e8f0; }
        body.dark-theme .form-group label { color: #c7d2fe; }
        body.dark-theme .tech-tag { background: #312e81; color: #a5b4fc; border-color: #4338ca; }
        body.dark-theme .filter-btn { border-color: #4338ca; color: #a5b4fc; }
        body.dark-theme .highlight-item { color: #c7d2fe; }
        body.dark-theme .section-subtitle { color: #a5b4fc; }
        body.dark-theme .skill-item { border-color: #312e81; }
    `;
    document.head.appendChild(style);
}

/* ───────────────────────────
   Smooth page load
   ─────────────────────────── */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
