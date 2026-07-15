/* ===================================================================
   OVX — Shared Site Logic (Header, Footer, Nav, Animations, Newsletter)
   =================================================================== */

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'services.html', label: 'Services' },
  { href: 'destinations.html', label: 'Salaries' },
  { href: 'jobs.html', label: 'Jobs' },
  { href: 'about.html', label: 'About' },
  { href: 'contact.html', label: 'Contact' }
];

function currentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path;
}

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const page = currentPage();
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${page === l.href ? 'active' : ''}">${l.label}</a>`
  ).join('');

  header.innerHTML = `
    <div class="container nav-wrap">
      <a href="index.html" class="brand">
        <img src="images/ovx-logo.png" alt="OVX Logo">
      </a>
      <nav id="main-nav">${links}</nav>
      <div class="nav-cta">
        <a href="contact.html" class="btn btn-primary btn-sm">Get Consultation</a>
        <button id="nav-toggle" aria-label="Toggle menu"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
  `;

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

async function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <a href="index.html" class="brand"><img src="images/ovx-logo.png" alt="OVX Logo"></a>
          <p>Where Global Access Becomes Local Opportunity. Shipping, property, design, affiliate trade, and study/work abroad — all simplified from Kigali, Rwanda.</p>
          <div class="social-icons" id="footer-social"></div>
        </div>
        <div class="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li><a href="service-detail.html?slug=shipping-logistics">Global Shipping & Logistics</a></li>
            <li><a href="service-detail.html?slug=real-estate">Real Estate Negotiation</a></li>
            <li><a href="service-detail.html?slug=design-marketing">Fashion & Interior Design</a></li>
            <li><a href="service-detail.html?slug=affiliate-network">Affiliate Marketing</a></li>
            <li><a href="service-detail.html?slug=study-work-abroad">Study & Work Abroad</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="study-abroad.html">Country Guide</a></li>
            <li><a href="affiliate.html">Affiliate Program</a></li>
            <li><a href="portal.html">Client Portal</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Stay Updated</h4>
          <p>Get news on new destinations, deals & opportunities.</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" id="newsletter-email" placeholder="Your email" required>
            <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i></button>
          </form>
          <div class="form-msg" id="newsletter-msg"></div>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; ${new Date().getFullYear()} Omni Venture Express (OVX) — Kigali, Rwanda. All rights reserved.
      </div>
    </div>
  `;

  // Social icons from settings
  try {
    const settings = await OVX.getSettingsMap();
    const socialMap = [
      { key: 'facebook', icon: 'fa-facebook-f' },
      { key: 'instagram', icon: 'fa-instagram' },
      { key: 'linkedin', icon: 'fa-linkedin-in' },
      { key: 'twitter', icon: 'fa-x-twitter' }
    ];
    const el = document.getElementById('footer-social');
    if (el) {
      el.innerHTML = socialMap
        .filter(s => settings[s.key])
        .map(s => `<a href="${settings[s.key]}" target="_blank" rel="noopener"><i class="fa-brands ${s.icon}"></i></a>`)
        .join('');
    }
  } catch (e) { /* silent */ }

  // Newsletter form
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value.trim();
      const msg = document.getElementById('newsletter-msg');
      try {
        await OVX.create('subscribers', { email });
        msg.textContent = 'Subscribed! Thank you for joining OVX updates.';
        msg.className = 'form-msg show success';
        form.reset();
      } catch (err) {
        msg.textContent = 'Something went wrong. Please try again.';
        msg.className = 'form-msg show error';
      }
    });
  }
}

function renderWhatsApp() {
  const container = document.getElementById('whatsapp-float-container');
  if (!container) return;
  OVX.getSetting('whatsapp', '+250788000000').then(number => {
    const clean = number.replace(/[^0-9]/g, '');
    container.innerHTML = `<a class="whatsapp-float" href="https://wa.me/${clean}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
  });
}

function initFadeIns() {
  const els = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

function animateCounter(el, target, suffix = '', duration = 1400) {
  const start = 0;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (target - start) * (1 - Math.pow(1 - progress, 3)));
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderWhatsApp();
});
