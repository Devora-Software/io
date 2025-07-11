// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

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