/* ===== NAV: scroll effect ===== */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  handleScrollTop();
});

/* ===== NAV: mobile menu ===== */
const menu    = document.querySelector('.nav__menu');
const openBtn = document.querySelector('#open-menu-btn');
const closeBtn = document.querySelector('#close-menu-btn');

if (openBtn) {
  openBtn.addEventListener('click', () => {
    menu.classList.add('show');
    closeBtn.style.display = 'inline-flex';
    openBtn.style.display  = 'none';
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    menu.classList.remove('show');
    closeBtn.style.display = 'none';
    openBtn.style.display  = 'inline-flex';
  });
}

// Close mobile menu when a link is clicked
menu && menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('show');
    if (closeBtn) closeBtn.style.display = 'none';
    if (openBtn)  openBtn.style.display  = 'inline-flex';
  });
});

/* ===== TYPING ANIMATION (hero only) ===== */
const typedWordEl = document.getElementById('typed-word');
if (typedWordEl) {
  const words = ['code', 'Python', 'React', 'Flutter', 'innovation', 'you'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = words[wordIndex];
    const displayed = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    typedWordEl.textContent = displayed;

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    let speed = isDeleting ? 70 : 110;

    if (!isDeleting && charIndex === current.length + 1) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
}

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current + '+';
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ===== PROJECT FILTER (projects page) ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.project__card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        if (match) {
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 20);
          });
        } else {
          setTimeout(() => card.classList.add('hidden'), 300);
        }
      });
    });
  });
}

/* ===== CONTACT FORM (contact page) ===== */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

function validateField(group, isValid) {
  group.classList.remove('error', 'shake');
  if (!isValid) {
    group.classList.add('error');
    void group.offsetWidth; // reflow to restart animation
    group.classList.add('shake');
    group.addEventListener('animationend', () => group.classList.remove('shake'), { once: true });
  }
  return isValid;
}

if (contactForm) {
  const fields = {
    name:    { el: contactForm.querySelector('#name'),    valid: v => v.trim().length >= 2 },
    email:   { el: contactForm.querySelector('#email'),   valid: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    subject: { el: contactForm.querySelector('#subject'), valid: v => v !== '' },
    message: { el: contactForm.querySelector('#message'), valid: v => v.trim().length >= 10 },
  };

  // Live clearing of errors on input
  Object.values(fields).forEach(({ el }) => {
    el.addEventListener('input', () => el.closest('.form__group').classList.remove('error'));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.values(fields).forEach(({ el, valid }) => {
      const group = el.closest('.form__group');
      if (!validateField(group, valid(el.value))) allValid = false;
    });

    if (!allValid) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    }, 1200);
  });
}

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scroll-top');

function handleScrollTop() {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== NAV: trigger scroll class on load ===== */
if (window.scrollY > 50) nav.classList.add('scrolled');

/* ===== HERO FLOATING PARTICLES ===== */
(function spawnParticles() {
  const hero = document.querySelector('header');
  if (!hero) return;
  const symbols = ['{}', '//', '=>', '</', '[]', '&&', '!=', '()', '++', '**', '0x', '::'];
  let active = 0;
  const MAX = 18;

  function spawn() {
    if (active >= MAX) { setTimeout(spawn, 600); return; }
    const el = document.createElement('span');
    el.className = 'hero-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const left = Math.random() * 100;
    const dur  = 9 + Math.random() * 14;
    const delay = Math.random() * 4;
    el.style.cssText = `left:${left}%;bottom:-40px;animation-duration:${dur}s;animation-delay:${delay}s;opacity:0;font-size:${0.65 + Math.random() * 0.55}rem;`;
    hero.appendChild(el);
    active++;
    el.addEventListener('animationend', () => { el.remove(); active--; });
    setTimeout(spawn, 500 + Math.random() * 800);
  }
  spawn();
})();
