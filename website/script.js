// =========================================
//  Geluk Dienstverlening – JavaScript
// =========================================

// Sticky header shadow
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  toggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Contact form – simple validation & feedback
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showNotification('Vul alle verplichte velden in.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Voer een geldig e-mailadres in.', 'error');
      return;
    }

    // Simulate send
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Versturen...';
    btn.disabled = true;

    setTimeout(() => {
      showNotification('Bedankt! Uw bericht is ontvangen. Wij nemen snel contact met u op.', 'success');
      form.reset();
      btn.textContent = 'Verstuur aanvraag';
      btn.disabled = false;
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(msg, type) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `notification notification--${type}`;
  el.textContent = msg;
  el.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 10px;
    font-family: Inter, sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    max-width: 360px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
    color: white;
    animation: slideIn 0.3s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(style);

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

// Intersection observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .step, .cert, .about__text, .about__visual').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

document.addEventListener('animationend', () => {});

// Add visible class handling
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);
