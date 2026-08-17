/* ── Particle System ── */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const COUNT = 50;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 15 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
})();

/* ── Typing Effect ── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = [
    'AI & ML Engineer',
    'Python Developer',
    'Web Developer',
    'Problem Solver',
    'Quick Learner',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 42);
    }
  }
  setTimeout(type, 800);
})();

/* ── Navbar Scroll Behaviour ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Active Nav Link on Scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActive() {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(s => {
      if (s.offsetTop <= scrollY) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ── Mobile Nav Toggle ── */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Scroll Reveal (Intersection Observer) ── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children within a parent group
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Add staggered delays to grouped elements
  function staggerGroup(selector, baseDelay = 80) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.delay = i * baseDelay;
    });
  }

  staggerGroup('.skill-group',   90);
  staggerGroup('.timeline-item', 100);
  staggerGroup('.cert-card',     70);
  staggerGroup('.project-card',  100);
  staggerGroup('.contact-card',  70);
  staggerGroup('.stat-card',     80);

  targets.forEach(t => observer.observe(t));
})();

/* ── Parallax Hero ── */
(function initParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function onScroll() {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.25}px)`;
    hero.style.opacity = 1 - y / 600;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Smooth Scroll Offset (fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Contact Form ── */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('contact-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      status.textContent = '⚠ Please fill in all fields.';
      status.className = 'form-status error';
      return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      status.textContent = '⚠ Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }

    // Simulate sending (opens mailto as fallback)
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';
    btn.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    await new Promise(r => setTimeout(r, 1000));

    const mailtoLink = `mailto:kamalsai765@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;

    status.textContent = '✓ Opening your mail client…';
    status.className = 'form-status';
    btnText.textContent = 'Send Message';
    btn.disabled = false;

    setTimeout(() => {
      form.reset();
      status.textContent = '';
    }, 3000);
  });
})();

/* ── Footer Year ── */
(function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Cursor Micro-Interaction (Desktop) ── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch
  const glassCards = document.querySelectorAll('.skill-group, .timeline-card, .project-card, .cert-card, .contact-form');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `
        radial-gradient(200px circle at ${x}px ${y}px, rgba(0, 212, 255, 0.06), transparent 80%),
        var(--bg-glass)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* -- Certificate Modal -- */
(function initModal() {
  const modal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeBtn = document.getElementById("modal-close");
  const backdrop = document.getElementById("modal-backdrop");
  const certCards = document.querySelectorAll(".js-cert-card");

  if (!modal) return;

  function openModal(imgSrc, title) {
    modalImg.src = imgSrc;
    modalCaption.textContent = title;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { modalImg.src = ""; }, 300);
  }

  certCards.forEach(card => {
    card.addEventListener("click", () => {
      const imgSrc = card.getAttribute("data-cert-img");
      const title = card.getAttribute("data-cert-title");
      openModal(imgSrc, title);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
})();

