// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
  /* =========================
     MENU TOGGLE (mobile)
     ========================= */
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    function openMenu() {
      navLinks.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu(e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu on clicking outside
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Close menu when screen resized to larger than mobile
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

    // Close menu when a nav link is clicked (good for single-page smooth scrolling)
    navLinks.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function () {
        // allow smooth scroll handler to run, then close menu
        closeMenu();
      });
    });
  }

  /* =========================
     SMOOTH SCROLL FOR INTERNAL LINKS
     ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // if href is just "#" or empty, ignore
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      // prevent default only for internal targets existing on page
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* =========================
     TYPING ANIMATION FOR ROLE TEXT
     ========================= */
  const roles = ['Electrical Engineer', 'O Level Student', 'Graphics Designer'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const roleText = document.getElementById('roleText');
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;
  let typingTimeoutId = null;

  function typeRole() {
    // safety: if roleText doesn't exist, stop
    if (!roleText) return;

    const currentRole = roles[roleIndex] || '';
    if (isDeleting) {
      // when deleting, avoid negative substring
      charIndex = Math.max(0, charIndex - 1);
      roleText.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex = Math.min(currentRole.length, charIndex + 1);
      roleText.textContent = currentRole.substring(0, charIndex);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // full word typed, pause then delete
      typingTimeoutId = setTimeout(() => {
        isDeleting = true;
        typeRole();
      }, pauseTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      // finished deleting, move to next word
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    typingTimeoutId = setTimeout(typeRole, speed);
  }

  // start typing only if element present
  if (roleText) typeRole();

  /* =========================
     COMMENT FORM HANDLER (localStorage)
     ========================= */
  const commentForm = document.getElementById('commentForm');
  const commentsListEl = document.getElementById('commentsList');

  function displayComments() {
    if (!commentsListEl) return;
    const comments = JSON.parse(localStorage.getItem('portfolioComments')) || [];

    if (comments.length === 0) {
      commentsListEl.innerHTML = '<div class="no-comments">No messages yet. Be the first to say hello!</div>';
      return;
    }

    commentsListEl.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(comment.name)}</span>
                <span class="comment-time">${escapeHtml(comment.timestamp)}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.message)}</div>
        </div>
    `).join('');
  }

  // small helper to avoid injection from stored values
  function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (commentForm) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('userName') ? document.getElementById('userName').value.trim() : '';
      const email = document.getElementById('userEmail') ? document.getElementById('userEmail').value.trim() : '';
      const message = document.getElementById('userMessage') ? document.getElementById('userMessage').value.trim() : '';

      if (!name || !email || !message) {
        alert('Please fill all fields before submitting.');
        return;
      }

      const comment = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString()
      };

      let comments = JSON.parse(localStorage.getItem('portfolioComments')) || [];
      comments.unshift(comment);
      localStorage.setItem('portfolioComments', JSON.stringify(comments));

      displayComments();
      commentForm.reset();
      alert('Message sent successfully! Thank you for reaching out!');
    });
  }

  // Load comments on page load
  displayComments();

  /* Cleanup on unload (cancel typing timer if any) */
  window.addEventListener('beforeunload', function () {
    if (typingTimeoutId) clearTimeout(typingTimeoutId);
  });
});
// ===== FORCE HERO OVERLAY + FORCE IMAGE FILTER (put at end of script.js) =====
(function forceHeroLook(){
  try {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // 1) add overlay element if not present
    if (!hero.querySelector('.__forced-overlay')) {
      const ov = document.createElement('div');
      ov.className = '__forced-overlay';
      hero.appendChild(ov);
    }

    // 2) find image vs background-image
    const img = hero.querySelector('.hero-image img');
    if (img) {
      // remove any drop-shadow or inline filter and set our desired brightness
      img.style.boxShadow = 'none';
      img.style.filter = 'brightness(0.75) saturate(1) contrast(1)';
      img.style.webkitFilter = 'brightness(0.75) saturate(1) contrast(1)';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center 40%';
      img.style.pointerEvents = 'none';
    } else {
      // if hero uses background-image on .hero or .hero-image
      const target = hero.matches('[style*="background-image"]') ? hero : (hero.querySelector('.hero-image') || hero);
      if (target) {
        // apply a semi-transparent black overlay via inline style just in case
        target.style.backgroundBlendMode = 'multiply';
        target.style.backgroundColor = 'rgba(0,0,0,0.45)';
        // if background-image had its own brightness from CSS, this overlay will darken it
      }
    }

    // Re-apply after a short delay (covers cases where image loads later)
    setTimeout(forceHeroLook, 600);
  } catch(e) {
    // don't break page if something goes wrong
    console.warn('forceHeroLook error', e);
  }
})();

