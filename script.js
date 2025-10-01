// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

// Mark that JS is running so CSS can apply JS-only reveal styles safely
document.documentElement.classList.add('js');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    
    // Update active class
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// Form Validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    // Simple validation
    if (name.value.trim() === '') {
      alert('Name is required');
      isValid = false;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      alert('Please enter a valid email');
      isValid = false;
    }
    
    if (message.value.trim() === '') {
      alert('Message is required');
      isValid = false;
    }
    
    if (isValid) {
      alert('Message sent successfully!');
      this.reset();
    }
  });
}

// Project Details Modal
const detailBtns = document.querySelectorAll('.details-btn');
detailBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const projectTitle = btn.parentElement.querySelector('h3').textContent;
    alert(`Details for ${projectTitle} will be shown here`);
  });
});

// Scroll Animation
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(30, 41, 59, 0.9)';
    navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  } else {
    navbar.style.background = 'var(--dark)';
    navbar.style.boxShadow = 'none';
  }
});

// Service images entrance animation using IntersectionObserver
(() => {
  const imgs = document.querySelectorAll('.service-row__media img');
  if (!('IntersectionObserver' in window) || imgs.length === 0) return;

  // track pending timeouts so we can cancel when an element leaves quickly
  const pending = new WeakMap();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const idx = Array.from(imgs).indexOf(el);
      const delay = (idx % 6) * 160; // slower stagger (160ms per index)

      if (entry.isIntersecting) {
        // schedule reveal
        if (pending.has(el)) return; // already scheduled
        const t = setTimeout(() => {
          el.classList.add('is-visible');
          pending.delete(el);
        }, delay);
        pending.set(el, t);
      } else {
        // element left viewport: cancel any pending reveal and remove class so it can replay
        if (pending.has(el)) {
          clearTimeout(pending.get(el));
          pending.delete(el);
        }
        el.classList.remove('is-visible');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  });

  imgs.forEach(img => observer.observe(img));
})();

/* Projects carousel: center cards when clicking points and allow keyboard navigation */
(function(){
  const track = document.getElementById('projectsTrack');
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const points = Array.from(document.querySelectorAll('.project-point'));
  if (!track || cards.length === 0 || points.length === 0) return;

  let active = 0;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateClasses() {
    cards.forEach((c, i) => {
      c.classList.remove('is-left','is-center','is-right');
      if (i === active) c.classList.add('is-center');
      else if (i < active) c.classList.add('is-left');
      else c.classList.add('is-right');
    });

    points.forEach((p,i) => p.setAttribute('aria-selected', i === active ? 'true' : 'false'));
  }

  function centerActive(instant=false) {
    const containerWidth = track.parentElement.clientWidth;
    const centerX = containerWidth / 2;
    const activeCard = cards[active];
    const cardRect = activeCard.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();

    // If measurements are zero (images not loaded), retry shortly
    if (cardRect.width === 0 || trackRect.width === 0) {
      setTimeout(() => centerActive(true), 80);
      return;
    }

    // Calculate desired translate so active card center aligns with container center
    const cardCenter = (cardRect.left - trackRect.left) + (cardRect.width / 2);
    const translateX = centerX - cardCenter;

    if (prefersReduced || instant) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }
    // Safety clamp: prevent absurd translate values that push the track fully out of view
    // (this can happen if measurements are off or images haven't loaded yet)
    const maxShift = Math.max(trackRect.width, containerWidth) * 1.2;
    const clamped = Math.max(Math.min(translateX, maxShift), -maxShift);
    // Use clamped value
    track.style.transform = `translateX(${isFinite(clamped) ? clamped : 0}px)`;
    // small timeout to clear inline transition if we turned it off
    if (prefersReduced || instant) {
      requestAnimationFrame(() => { track.style.transition = ''; });
    }
    updateClasses();
  }

  // Attach click handlers
  points.forEach(p => {
    p.addEventListener('click', (e) => {
      const idx = Number(p.dataset.index);
      if (isNaN(idx)) return;
      active = idx;
      centerActive();
    });
  });

  // allow arrow navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      active = Math.min(cards.length - 1, active + 1);
      centerActive();
    } else if (e.key === 'ArrowLeft') {
      active = Math.max(0, active - 1);
      centerActive();
    }
  });

  // initialize after images/layout settle
  window.addEventListener('load', () => centerActive(true));
  // also recenter on resize
  window.addEventListener('resize', () => centerActive(true));

  // Initial class setup
  updateClasses();
})();

// Projects section reveal observer
(function(){
  const carousel = document.querySelector('.projects-carousel');
  if (!carousel || !('IntersectionObserver' in window)) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (prefersReduced) {
          carousel.classList.add('is-open');
        } else {
          carousel.classList.add('is-open');
        }
        // wait a tick for CSS to paint, then trigger a resize so centering recalculates
        setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
      } else {
        // allow replay when user scrolls away and back
        // Do not remove .is-open here to avoid hiding content unexpectedly.
        // We only want to animate once by default; stop observing after open below.
      }
    });
  }, { root: null, threshold: 0.18 });

  // Observe and also perform an immediate check in case the section is already visible
  obs.observe(carousel);

  function openIfVisible() {
    const rect = carousel.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      carousel.classList.add('is-open');
      // trigger recalc of centering
      setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
      // we only need to open once
      obs.unobserve(carousel);
    }
  }

  // initial check now and also on load
  openIfVisible();
  window.addEventListener('load', openIfVisible);
})();