(function () {
  'use strict';

  /* ── Navigation ── */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var nav = document.getElementById('site-nav');

  function closeMenu(returnFocus) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    if (returnFocus) toggle.focus();
  }

  if (toggle && menu && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open');
      if (!open) {
        var firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu(true);
      }
    });

    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Scroll Reveal ── */
  var revealTargets = document.querySelectorAll('.about-portrait, .about-text, .reveal, .reveal-stagger');
  if (revealTargets.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ── FAQ Accordion ── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item, index) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    /* Wire aria-labelledby so screen readers name the region */
    var btnId = 'faq-q-' + (index + 1);
    btn.id = btnId;
    answer.setAttribute('aria-labelledby', btnId);

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          var otherBtn = other.querySelector('.faq-question');
          var otherAnswer = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Back to Top ── */
  var backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      backToTopBtn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Booking CTA tracking (pushes to GTM dataLayer) ── */
  function getCTALocation(el) {
    if (el.classList.contains('nav-cta--mobile')) return 'nav-mobile';
    if (el.classList.contains('nav-cta')) return 'nav-desktop';
    var section = el.closest('section, header.hero, .guide-cta-wrap, .styles-cta-wrap');
    if (!section) return 'unknown';
    return section.id || section.className.split(/\s+/)[0] || 'unknown';
  }

  document.querySelectorAll('a[href*="tally.so"]').forEach(function (a) {
    a.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cta_click',
        cta_label: a.textContent.trim().replace(/\s+/g, ' '),
        cta_location: getCTALocation(a),
        cta_destination: a.href
      });
    });
  });

  /* ── Footer year ── */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}());
