// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Scroll down button
  const scrollDownBtn = document.querySelector('.scroll-down');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }

  // Parallax effect on photo
  const photoContainer = document.querySelector('.photo-container');
  if (photoContainer) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xAxis = (window.innerWidth / 2 - clientX) / 50;
      const yAxis = (window.innerHeight / 2 - clientY) / 50;
      
      photoContainer.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(1.05)`;
    });

    document.addEventListener('mouseleave', () => {
      photoContainer.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    });
  }

  // Form submission handler
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias por tu mensaje! Te contactaré pronto.');
      e.target.reset();
    });
  }

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  if (navLinks.length) {
    navLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const navbar = document.querySelector('.navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(45, 52, 54, 0.98)';
        navbar.style.padding = '0.4rem 0';
      } else {
        navbar.style.background = 'rgba(45, 52, 54, 0.95)';
        navbar.style.padding = '0.5rem 0';
      }
    });
  }

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  if (skillBars.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-width');
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(skill => {
      skill.style.width = '0';
      skill.setAttribute('data-width', skill.dataset.width);
      observer.observe(skill);
    });
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinksContainer.classList.remove('active');
      }
    });

    // Close mobile menu when clicking a link
    const navLinksElements = document.querySelectorAll('.nav-links a');
    navLinksElements.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
      });
    });
  }
});