// ========================================
// MODERN PORTFOLIO - ZANDER 2025
// Advanced JavaScript Functionality
// ========================================

class ModernPortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initThemeToggle();
    this.initSmoothScrolling();
    this.initActiveNavigation();
    this.initAnimations();
    this.initParticles();
    this.initMobileMenu();
    this.initContactForm();
    this.initAccessibility();
    this.initPerformanceMonitoring();
    this.updateCurrentYear();
  }

  // Theme Toggle Functionality
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
      const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  setTheme(theme) {
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    } else {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    }
  }

  // Smooth Scrolling for Navigation Links
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Active Navigation Highlighting
  initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all nav links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to corresponding nav link
          const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // Animation on Scroll
  initAnimations() {
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-tag');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      animationObserver.observe(element);
    });
  }

  // Particle System for Hero Section
  initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Reduce particles on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 30 : 100;
    const connectionDistance = isMobile ? 80 : 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      size: Math.random() * (isMobile ? 1.5 : 2) + 1,
      opacity: Math.random() * 0.5 + 0.2
    });

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections (fewer on mobile)
      if (!isMobile) {
        particles.forEach((particle, i) => {
          particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / connectionDistance)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });
      }
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    // Pause animation when page is hidden for performance
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(animationId);
    });
  }

  // Mobile Menu Toggle
  initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.getElementById('navbar');
    
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Contact Form Handling
  initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        this.showNotification('Please fix the errors before submitting', 'error');
        return;
      }
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        this.showNotification('Message sent successfully!', 'success');
        form.reset();
        this.clearAllFieldErrors();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Form validation helper methods
  validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';

    // Remove existing error states
    this.clearFieldError(field);

    // Validation rules
    if (!value) {
      isValid = false;
      errorMessage = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    } else if (field.name === 'message' && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters long';
    }

    // Apply error state
    if (!isValid) {
      fieldGroup.classList.add('error');
      let errorElement = fieldGroup.querySelector('.error-message');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        fieldGroup.appendChild(errorElement);
      }
      errorElement.textContent = errorMessage;
    } else {
      fieldGroup.classList.add('success');
    }

    return isValid;
  }

  clearFieldError(field) {
    const fieldGroup = field.closest('.form-group');
    fieldGroup.classList.remove('error', 'success');
    const errorElement = fieldGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  clearAllFieldErrors() {
    const fieldGroups = document.querySelectorAll('.form-group');
    fieldGroups.forEach(group => {
      group.classList.remove('error', 'success');
      const errorElement = group.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    });
  }

  // Notification System
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;

    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? 'var(--color-success)' : 'var(--color-accent)',
      color: 'white',
      padding: 'var(--space-md)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // Update current year in footer
  updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Setup Event Listeners
  setupEventListeners() {
    // Navbar scroll effect with throttling for better performance
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateNavbar = () => {
      const navbar = document.getElementById('navbar');
      if (!navbar) return;

      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScrollY = window.scrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });

    // Touch-friendly hover effects for mobile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Tech card interactions
    document.querySelectorAll('.tech-card').forEach(card => {
      if (isTouchDevice) {
        card.addEventListener('touchstart', () => {
          card.style.transform = 'translateY(-10px) scale(1.1)';
        });
        
        card.addEventListener('touchend', () => {
          setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
          }, 150);
        });
      } else {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-10px) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0) scale(1)';
        });
      }
    });

    // Project card interactions
    document.querySelectorAll('.project-card').forEach(card => {
      if (isTouchDevice) {
        card.addEventListener('touchstart', () => {
          card.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('touchend', () => {
          setTimeout(() => {
            card.style.transform = 'translateY(0)';
          }, 150);
        });
      }
    });

    // Typing effect for hero title
    this.initTypingEffect();

    // Optimized parallax effect
    let parallaxTicking = false;
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.tech-card');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform += ` translateY(${yPos}px)`;
      });
      parallaxTicking = false;
    };

    // Only enable parallax on desktop for performance
    if (!isTouchDevice && window.innerWidth > 768) {
      window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
          requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      });
    }

    // Add touch feedback for buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .contact-method').forEach(button => {
      if (isTouchDevice) {
        button.addEventListener('touchstart', () => {
          button.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', () => {
          setTimeout(() => {
            button.style.transform = '';
          }, 100);
        });
      }
    });

    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Add swipe gesture for mobile navigation
    if (isTouchDevice) {
      let startX = null;
      let startY = null;
      
      document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      });
      
      document.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        
        // Prevent horizontal scroll when menu is open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active') && Math.abs(deltaX) > Math.abs(deltaY)) {
          e.preventDefault();
        }
      });
      
      document.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = e.changedTouches[0].clientY - startY;
        
        // Swipe right to open menu, left to close
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0 && !navMenu.classList.contains('active') && startX < 50) {
            // Swipe right from left edge to open menu
            navMenu.classList.add('active');
            mobileToggle.classList.add('active');
            document.body.classList.add('menu-open');
          } else if (deltaX < 0 && navMenu.classList.contains('active')) {
            // Swipe left to close menu
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        }
        
        startX = null;
        startY = null;
      });
    }
  }

  // Typing Effect for Hero Title
  initTypingEffect() {
    const titleElement = document.querySelector('.title-line.highlight');
    if (!titleElement) return;

    const text = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.borderRight = '2px solid var(--color-accent)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        titleElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          titleElement.style.borderRight = 'none';
        }, 1000);
      }
    };

    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
  }

  // Performance monitoring
  initPerformanceMonitoring() {
    // Monitor FPS
    let fps = 0;
    let lastTime = performance.now();
    
    const updateFPS = (currentTime) => {
      fps = Math.round(1000 / (currentTime - lastTime));
      lastTime = currentTime;
      
      // Log performance warnings
      if (fps < 30) {
        console.warn('Low FPS detected:', fps);
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    requestAnimationFrame(updateFPS);
  }

  // Accessibility enhancements
  initAccessibility() {
    // Add focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Add aria-labels to interactive elements
    document.querySelectorAll('.project-link').forEach(link => {
      if (!link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', 'View project');
      }
    });
  }
}

// Utility Functions
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  static preloadImages(imageUrls) {
    return Promise.all(
      imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      })
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernPortfolio();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    document.body.classList.add('page-hidden');
  } else {
    // Resume animations when tab becomes visible
    document.body.classList.remove('page-hidden');
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModernPortfolio, Utils };
}