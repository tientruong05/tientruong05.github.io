document.addEventListener("DOMContentLoaded", () => {
  // Tự động cập nhật năm hiện tại ở footer
  const currentYear = new Date().getFullYear();
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = currentYear;
  }

  // --- Theme Toggle ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const moonIcon = '<i class="fas fa-moon"></i>';
  const sunIcon = '<i class="fas fa-sun"></i>';

  // Check for saved theme preference or use system preference
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (currentTheme === "light") {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    if (themeToggle) themeToggle.innerHTML = moonIcon;
  } else {
    body.classList.add("dark-mode"); // Default is dark
    body.classList.remove("light-mode");
    if (themeToggle) themeToggle.innerHTML = sunIcon;
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      body.classList.toggle("light-mode");

      if (body.classList.contains("light-mode")) {
        themeToggle.innerHTML = moonIcon;
        localStorage.setItem("theme", "light");
      } else {
        themeToggle.innerHTML = sunIcon;
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // --- Active Navigation Link Highlighting on Scroll ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#navbar ul li a");

  function changeLinkState() {
    let index = sections.length;

    while (--index && window.scrollY + 100 < sections[index].offsetTop) {} // 100 is offset

    navLinks.forEach((link) => link.classList.remove("active"));
    // Check if the corresponding link exists before adding 'active' class
    if (navLinks[index]) {
      navLinks[index].classList.add("active");
    }
  }
  // Initial call in case page loads on a scrolled position
  changeLinkState();
  window.addEventListener("scroll", changeLinkState);

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // Ignore empty hash links

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop =
          targetElement.offsetTop -
          (document.getElementById("navbar")?.offsetHeight || 70); // Adjust for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // --- Fade-in Animation for Sections on Scroll ---
  const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of the item is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const fadeElements = document.querySelectorAll(".section-padding"); // Apply to all main sections
  fadeElements.forEach((el) => {
    el.classList.add("fade-in-section"); // Add initial class for styling
    observer.observe(el);
  });

  // --- Contact Form Handling (Basic - for client-side validation or prep) ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      // e.preventDefault(); // Uncomment this if you want to handle submission with AJAX
      // You'd typically add AJAX submission logic here if not using a service like Formspree/Netlify Forms directly
      // For now, it will submit via the 'action' attribute.
      // Add custom validation if needed.
      console.log(
        "Form submitted (or would be, if AJAX was fully implemented)"
      );
      // alert('Cảm ơn! Tin nhắn của bạn đã được gửi.'); // Basic feedback
    });
  }
});
