/* ============================================================
   E-Portfolio — Thalluru Lakshmi Prasanna
   script.js
   ============================================================ */

/* ── 1. Navbar scroll effect ────────────────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load

/* ── 2. Hamburger menu toggle ───────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // prevent body scroll when menu is open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// close menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── 3. Smooth scroll + close mobile menu on link click ─────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // close mobile menu
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ── 4. Scroll animations (IntersectionObserver) ────────────── */
const aosObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // respect data-aos-delay if present
        const delay = entry.target.dataset.aosDelay
          ? parseInt(entry.target.dataset.aosDelay, 10)
          : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        aosObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-aos]').forEach((el) => {
  aosObserver.observe(el);
});

/* ── 5. Active nav link highlighting ────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 60;

  let current = '';
  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach((a) => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ── 6. Contact form submit handler ─────────────────────────── */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;

  // simple visual feedback before alert
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    alert("Message sent! I'll get back to you soon.");
    form.reset();
  }, 800);
}

// expose globally so the inline onsubmit attribute works
window.handleFormSubmit = handleFormSubmit;

/* ── 7. Typing animation for hero subtitle ──────────────────── */
(function initTyping() {
  const greetingEl = document.querySelector('.hero-greeting');
  if (!greetingEl) return;

  const phrases = [
    "Hello, I'm",
    'ML Enthusiast',
    'Deep Learning Explorer',
    'Problem Solver',
    "Hello, I'm", // loop back
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let loopCount   = 0;
  const maxLoops  = phrases.length - 1; // stop cycling after one full round

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      greetingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      greetingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      // pause at end of word
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex++;
      loopCount++;
      delay = 300;

      if (loopCount >= maxLoops) {
        // settle on "Hello, I'm" permanently
        greetingEl.textContent = "Hello, I'm";
        return;
      }
    }

    setTimeout(type, delay);
  }

  // small initial delay so the page loads first
  setTimeout(type, 1200);
})();
