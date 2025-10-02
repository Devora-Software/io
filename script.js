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

// Form Validation with success micro-animation
// Contact form handling
(function() {
  const contactForm = document.getElementById('contact-form');
  const formMessages = document.getElementById('form-messages');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  if (!contactForm) return;

  function showMessage(message, type) {
    formMessages.innerHTML = `<div class="message ${type}">${message}</div>`;
    formMessages.style.display = 'block';
    
    // Scroll to message
    formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success messages after 8 seconds
    if (type === 'success') {
      setTimeout(() => {
        formMessages.style.display = 'none';
      }, 8000);
    }
  }

  function setLoading(state) {
    if (state) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
      submitBtn.disabled = true;
    } else {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  function validateForm(formData) {
    const errors = {};
    
    if (!formData.get('name')?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.get('email')?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.get('message')?.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  }

  async function submitForm(formData) {
    // ✅ REPLACE THIS WITH YOUR ACTUAL FORMSPREE URL
    const formspreeEndpoint = 'https://formspree.io/f/xvgwrbda';
    
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Failed to send message. Please try again later.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    }
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    // Clear previous errors and messages
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    formMessages.style.display = 'none';
    
    if (Object.keys(errors).length > 0) {
      // Show field errors
      Object.entries(errors).forEach(([field, error]) => {
        const errorEl = document.getElementById(`${field}-error`);
        if (errorEl) errorEl.textContent = error;
      });
      showMessage('Please fix the errors above', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await submitForm(formData);
      
      if (result.success) {
        showMessage('✅ Thank you! Your message has been sent successfully. We\'ll get back to you within 1-2 business days.', 'success');
        contactForm.reset();
      } else {
        showMessage(`❌ ${result.error}`, 'error');
      }
    } catch (error) {
      showMessage('❌ An unexpected error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Real-time validation - clear errors when user types
  contactForm.addEventListener('input', (e) => {
    const field = e.target.name;
    const errorEl = document.getElementById(`${field}-error`);
    if (errorEl) errorEl.textContent = '';
  });
})();

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

// Services section reveal (replay on scroll)
(function(){
  const services = document.querySelector('#services');
  if (!services || !('IntersectionObserver' in window)) return;

  const list = services.querySelector('.services-list');
  if (!list) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { list.classList.add('is-revealed'); return; }

  const sio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        list.classList.add('is-revealed');
      } else {
        list.classList.remove('is-revealed');
      }
    });
  }, { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  sio.observe(services);
})();

/* Projects carousel: center cards when clicking points and allow keyboard navigation */
(function(){
  const track = document.getElementById('projectsTrack');
  let cards = Array.from(document.querySelectorAll('.project-card'));
  const points = Array.from(document.querySelectorAll('.project-point'));
  if (!track || cards.length === 0 || points.length === 0) return;

  // Create a forward-only ring by cloning the original set and appending them
  const origCount = cards.length;
  if (origCount > 1) {
    const frag = document.createDocumentFragment();
    cards.forEach(c => frag.appendChild(c.cloneNode(true)));
    track.appendChild(frag);
    cards = Array.from(track.querySelectorAll('.project-card'));
  }

  let active = 0; // index into `cards` (can grow into the cloned range)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-rotate settings
  const AUTO_CENTER_PAUSE = 5000; // ms to keep a card centered before moving on
  let autoTimer = null;
  // Approximate transition duration used for fallback snapping when wrapping
  const TRANSITION_MS = 620;
  let snapFallbackTimer = null;

  function stopAuto() {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
  }

  function startAuto() {
    if (prefersReduced) return; // respect user's motion preference
    stopAuto();
    autoTimer = setTimeout(autoStep, AUTO_CENTER_PAUSE);
  }

  function resetAuto() {
    stopAuto();
    autoTimer = setTimeout(autoStep, AUTO_CENTER_PAUSE);
  }

  function autoStep() {
    if (cards.length === 0) return;
    // always advance forward (left -> right). We allow active to enter the cloned range.
    active = active + 1;
    centerActive();
    stopAuto();
    autoTimer = setTimeout(autoStep, AUTO_CENTER_PAUSE);

    // If we've advanced into the cloned region, ensure a fallback snap will restore
    // the logical index in case the transitionend event doesn't fire for any reason.
    if (origCount > 1 && active >= origCount) {
      if (snapFallbackTimer) clearTimeout(snapFallbackTimer);
      snapFallbackTimer = setTimeout(() => {
        if (active >= origCount) {
          const logical = active % origCount;
          active = logical;
          // snap without transition
          centerActive(true);
          updateClasses();
          startAuto();
        }
      }, TRANSITION_MS + 120);
    }
  }

  function updateClasses() {
  cards.forEach((card, index) => {
    card.classList.remove('is-left', 'is-center', 'is-right');
    
    if (index === active) {
      card.classList.add('is-center');
    } else if (index < active) {
      card.classList.add('is-left');
    } else {
      card.classList.add('is-right');
    }
  });
  
  // Update navigation points
  const logicalActive = active % origCount;
  points.forEach((point, i) => {
    point.setAttribute('aria-selected', i === logicalActive ? 'true' : 'false');
  });
}

  function centerActive(instant = false) {
  if (cards.length === 0) return;
  
  const container = track.parentElement;
  const containerWidth = container.clientWidth;
  const centerX = containerWidth / 2;
  
  // Clamp active to available cards indexes
  const idx = Math.max(0, Math.min(active, cards.length - 1));
  const activeCard = cards[idx];
  
  // Get positions relative to track
  const trackRect = track.getBoundingClientRect();
  const cardRect = activeCard.getBoundingClientRect();
  
  // Calculate the position needed to center the active card
  const cardCenterInTrack = (cardRect.left - trackRect.left) + (cardRect.width / 2);
  const translateX = centerX - cardCenterInTrack;
  
  // Apply transition
  if (prefersReduced || instant) {
    track.style.transition = 'none';
  } else {
    track.style.transition = '';
  }
  
  // Apply transform
  track.style.transform = `translateX(${translateX}px)`;
  
  // Reset transition if needed
  if (prefersReduced || instant) {
    requestAnimationFrame(() => {
      track.style.transition = '';
    });
  }
  
  updateClasses();
}

  // Attach click handlers (map to logical index)
  points.forEach(p => {
    p.addEventListener('click', (e) => {
      const idx = Number(p.dataset.index);
      if (isNaN(idx)) return;
      // set to the primary index (first set)
      active = idx;
      centerActive();
      resetAuto();
    });
  });

  // allow arrow navigation (operate on logical indices)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const logical = (active % origCount + 1) % origCount;
      active = logical;
      centerActive();
      resetAuto();
    } else if (e.key === 'ArrowLeft') {
      const logical = (active % origCount - 1 + origCount) % origCount;
      active = logical;
      centerActive();
      resetAuto();
    }
  });

  // initialize after images/layout settle
  window.addEventListener('load', () => { centerActive(true); startAuto(); });
  window.addEventListener('resize', () => centerActive(true));

  // Pause auto-rotate when the page/tab is not visible to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // Initial class setup
  updateClasses();

  // If we cloned originals, snap-back after transitioning into clones to maintain seamless ring
  if (origCount > 1) {
    track.addEventListener('transitionend', (ev) => {
      if (ev.propertyName !== 'transform') return;
      // clear any pending fallback snap since transition did fire
      if (snapFallbackTimer) { clearTimeout(snapFallbackTimer); snapFallbackTimer = null; }

      // if we've moved into the cloned region (active >= origCount), snap back to logical index
      if (active >= origCount) {
        const logical = active % origCount;
        active = logical;
        // snap without transition
        centerActive(true);
        updateClasses();
        // ensure auto continues
        startAuto();
      }
    });
  }
})();

// Projects section reveal observer — toggle .is-revealed on enter/exit so cards replay
(function(){
  const carousel = document.querySelector('.projects-carousel');
  if (!carousel || !('IntersectionObserver' in window)) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    carousel.classList.add('is-open');
    carousel.classList.add('is-revealed');
    return;
  }

  const projObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        carousel.classList.add('is-open', 'is-revealed');
        // allow layout to settle then recenter
        setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
      } else {
        // remove reveal so animations can replay on next enter
        carousel.classList.remove('is-revealed');
      }
    });
  }, { root: null, threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  projObserver.observe(carousel);

  // also perform an immediate visibility check (in case it's already on-screen)
  (function immediate() {
    const rect = carousel.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      carousel.classList.add('is-open', 'is-revealed');
      setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
    }
  })();

  window.addEventListener('load', () => {
    const rect = carousel.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      carousel.classList.add('is-open', 'is-revealed');
      setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
    }
  });
})();

// About section reveal + stats (replay on every scroll into view)
(function(){
  const about = document.querySelector('.about-section');
  if (!about || !('IntersectionObserver' in window)) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Numeric animator (supports decimals and suffixes)
  function animateCounter(el, to, duration = 900, decimals = 0, suffix = '') {
    if (prefersReduced) { el.textContent = String(to) + suffix; return; }
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      const formatted = decimals > 0 ? current.toFixed(decimals) : String(Math.floor(current));
      el.textContent = formatted + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else { el.textContent = (decimals > 0 ? Number(to).toFixed(decimals) : String(Math.floor(to))) + suffix; }
    }
    requestAnimationFrame(tick);
  }

  // Start stat animations from 0; uses data-final to persist original value
  function startStats() {
    const statVals = about.querySelectorAll('.stat-value');
    if (!statVals || statVals.length === 0) return;

    statVals.forEach((sv, idx) => {
      const raw = sv.getAttribute('data-final') || sv.textContent.trim();
      const match = raw.match(/^([0-9][0-9,\.]*)?(.*)$/);
      if (!match) return;
      const numPart = match[1] || '0';
      const suffix = match[2] || '';
      const normalized = numPart.replace(/,/g, '');
      const num = parseFloat(normalized);
      if (Number.isNaN(num)) return;
      const decimals = (normalized.split('.')[1] || '').length;

      sv.textContent = '0' + suffix;
      setTimeout(() => animateCounter(sv, num, 900 + (idx * 120), decimals, suffix), idx * 120);
    });
  }

  // Persist final values so they can be re-read between runs
  about.querySelectorAll('.stat-value').forEach(sv => {
    if (!sv.getAttribute('data-final')) sv.setAttribute('data-final', sv.textContent.trim());
  });

  if (prefersReduced) {
    about.classList.add('is-revealed');
    startStats();
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        about.classList.add('is-revealed');
        startStats();
      } else {
        // remove reveal so animations can replay on next enter
        about.classList.remove('is-revealed');
        // restore final values so the section looks correct while off-screen
        about.querySelectorAll('.stat-value').forEach(sv => {
          const f = sv.getAttribute('data-final');
          if (f) sv.textContent = f;
        });
      }
    });
  }, { root: null, threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

  io.observe(about);
})();

  // Defensive visibility check (fallback) — ensures reveal classes are added when observers fail or timings are off
  (function(){
    const items = [
      { rootSel: '#projects', childSel: '.projects-carousel' },
      { rootSel: '#contact', childSel: '.contact-section' },
      { rootSel: '#services', childSel: '.services-list' },
      { rootSel: '#about', childSel: '.about-section' }
    ];

    function isVisible(rect){ return rect.top < window.innerHeight && rect.bottom > 0; }

    function clampProjectTrack(){
      const track = document.getElementById('projectsTrack');
      if (!track || !track.parentElement) return;
      const style = window.getComputedStyle(track);
      const matrix = style.transform;
      if (!matrix || matrix === 'none') return;
      // try to extract translateX from matrix(...) or matrix3d(...)
      const m = matrix.match(/matrix\(([-0-9eE\.\,\s]+)\)/);
      const m3 = matrix.match(/matrix3d\(([-0-9eE\.\,\s]+)\)/);
      let tx = 0;
      if (m3) {
        const parts = m3[1].split(',').map(s => parseFloat(s.trim()));
        tx = parts[12] || 0; // tx in matrix3d is 13th value (index 12)
      } else if (m) {
        const parts = m[1].split(',').map(s => parseFloat(s.trim()));
        tx = parts[4] || 0; // tx in 2d matrix is 5th value (index 4)
      }
      if (!isFinite(tx)) return;
      const trackRect = track.getBoundingClientRect();
      const parentRect = track.parentElement.getBoundingClientRect();
      const maxShift = Math.max(trackRect.width, parentRect.width) * 1.5;
      if (Math.abs(tx) > maxShift) {
        track.style.transform = 'translateX(0px)';
      }
    }

    function checkVisibility(){
      items.forEach(it => {
        const root = document.querySelector(it.rootSel);
        if (!root) return;
        const child = it.childSel ? root.querySelector(it.childSel) || root : root;
        const rect = root.getBoundingClientRect();
        if (isVisible(rect)) {
          child.classList.add('is-revealed');
          // also ensure projects get is-open
          if (it.rootSel === '#projects') child.classList.add('is-open');
        } else {
          child.classList.remove('is-revealed');
        }
      });
      clampProjectTrack();
    }

    let t = null;
    window.addEventListener('load', checkVisibility);
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(checkVisibility, 120); });
    window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(checkVisibility, 120); });
  })();