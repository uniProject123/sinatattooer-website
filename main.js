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
  /* Groups whose children animate in one after another (styled in style.css) */
  document.querySelectorAll('.process-steps, .pricing-highlight, .faq-list').forEach(function (el) {
    el.classList.add('stagger-group');
  });

  var revealTargets = document.querySelectorAll('.about-portrait, .about-text, .reveal, .reveal-stagger, .stagger-group');
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

  /* Other tracked CTAs (e.g. gift vouchers): <a data-cta="voucher-email"> */
  document.querySelectorAll('a[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cta_click',
        cta_label: a.textContent.trim().replace(/\s+/g, ' '),
        cta_location: a.getAttribute('data-cta'),
        cta_destination: a.href
      });
    });
  });

  /* ── Click-to-load embeds ──
     Google Maps and EmbedSocial set third-party cookies (EmbedSocial pulls in
     YouTube's), so they only load when the visitor asks for them. */
  var embedLoaders = {
    map: function (gate) {
      var box = gate.closest('[data-map-src]');
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-map-src');
      f.width = '600';
      f.height = '340';
      f.style.border = '0';
      f.allowFullscreen = true;
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.title = 'Sina Tattooer location on Google Maps';
      box.replaceChildren(f);
    },
    reviews: function (gate) {
      var wrap = gate.parentNode;
      wrap.classList.remove('reviews-widget-wrapper--gated');
      gate.remove();
      if (document.getElementById('EmbedSocialHashtagScript')) return;
      var js = document.createElement('script');
      js.id = 'EmbedSocialHashtagScript';
      js.src = 'https://embedsocial.com/cdn/ht.js';
      document.head.appendChild(js);
    }
  };

  document.querySelectorAll('[data-embed-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var kind = btn.getAttribute('data-embed-load');
      var load = embedLoaders[kind];
      if (!load) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'embed_load', embed_type: kind });
      load(btn.closest('.embed-gate'));
    });
  });

  /* ── Footer year ── */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}());
