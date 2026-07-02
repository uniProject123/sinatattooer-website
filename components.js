/**
 * Shared Components — Sina Tattooer
 * Renders nav, footer and breadcrumbs from a single source of truth.
 * Each page includes a lightweight placeholder that this script replaces.
 */
(function () {
  'use strict';

  var TALLY = 'https://tally.so/r/LZJBLj';

  /* ── Navigation ── */
  function buildNav(page) {
    var isHome = (page === 'home');
    var p = isHome ? '#' : '/#';
    var home = isHome ? '#top' : '/';

    function lnk(href, label, id) {
      var cur = (id === page) ? ' aria-current="page"' : '';
      return '<li><a href="' + href + '" class="nav-link"' + cur + '>' + label + '</a></li>';
    }

    return '' +
      '<nav class="site-nav" id="site-nav" aria-label="Main navigation">' +
        '<div class="nav-inner">' +
          '<a href="' + home + '" class="nav-logo" aria-label="Sina Tattooer — back to ' + (isHome ? 'top' : 'home') + '">Sina Tattooer</a>' +
          '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<ul class="nav-links" id="navMenu" role="list">' +
            lnk(home, 'Home', 'home') +
            lnk(p + 'about', 'About', 'about') +
            lnk('/portfolio', 'Portfolio', 'portfolio') +
            lnk(p + 'booking', 'Booking', 'booking') +
            lnk(p + 'faq', 'FAQ', 'faq') +
            lnk(p + 'contact', 'Find Us', 'contact') +
            '<li class="nav-mobile-cta"><a href="' + TALLY + '" target="_blank" rel="noopener noreferrer" class="nav-cta nav-cta--mobile">Book a Tattoo</a></li>' +
          '</ul>' +
          '<a href="' + TALLY + '" target="_blank" rel="noopener noreferrer" class="nav-cta">Book a Tattoo</a>' +
        '</div>' +
      '</nav>';
  }

  /* ── Rich Footer ── */
  function buildFooter() {
    var y = new Date().getFullYear();
    return '' +
    '<footer class="site-footer">' +
      '<div class="footer-inner">' +
        '<div class="footer-brand">' +
          '<a href="/" class="footer-logo">Sina Tattooer</a>' +
          '<p class="footer-tagline">Custom tattoos in York.<br>By appointment only.</p>' +
          '<nav class="footer-social" aria-label="Social media">' +
            '<a href="https://instagram.com/sinatattooer" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>' +
            '<a href="https://facebook.com/sinatattooer" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>' +
            '<a href="https://g.page/r/CVRKmF0wOcODEAE/review" target="_blank" rel="noopener noreferrer" aria-label="Google Reviews">Google</a>' +
          '</nav>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h3>Navigate</h3>' +
          '<ul>' +
            '<li><a href="/">Home</a></li>' +
            '<li><a href="/portfolio">Portfolio</a></li>' +
            '<li><a href="/#booking">Booking</a></li>' +
            '<li><a href="/#faq">FAQ</a></li>' +
            '<li><a href="/#contact">Find Us</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h3>Styles</h3>' +
          '<ul>' +
            '<li><a href="/blackwork-tattoos-york">Blackwork</a></li>' +
            '<li><a href="/fineline-tattoos-york">Fine Line</a></li>' +
            '<li><a href="/watercolour-tattoos-york">Watercolour</a></li>' +
            '<li><a href="/oldschool-tattoos-york">Old School</a></li>' +
            '<li><a href="/geometric-tattoos-york">Geometric</a></li>' +
            '<li><a href="/cover-up-tattoos-york">Cover-ups</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h3>Resources</h3>' +
          '<ul>' +
            '<li><a href="/tattoo-preparation">Preparation Guide</a></li>' +
            '<li><a href="/tattoo-aftercare">Aftercare Guide</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col footer-contact">' +
          '<h3>Studio</h3>' +
          '<address>' +
            '<strong>Mr Snips Barbers</strong><br>' +
            '23 Yarburgh Way<br>' +
            'York, YO10 5HD<br><br>' +
            '<a href="tel:+447724333370">07724 333370</a><br>' +
            '<a href="mailto:contact@sinatattooer.co.uk">contact@sinatattooer.co.uk</a>' +
          '</address>' +
          '<p class="footer-hours">Open daily, 11 am – 6 pm</p>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<p>&copy; ' + y + ' Sina Tattooer &mdash; York, UK</p>' +
      '</div>' +
    '</footer>';
  }

  /* ── Breadcrumbs ── */
  function buildBreadcrumbs(items) {
    var html = '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isLast = (i === items.length - 1);
      html += '<li>';
      if (isLast) {
        html += '<span aria-current="page">' + item.label + '</span>';
      } else {
        html += '<a href="' + item.href + '">' + item.label + '</a>';
      }
      html += '</li>';
    }
    html += '</ol></nav>';
    return html;
  }

  /* ── Lightbox ── */
  function initLightbox() {
    var images = document.querySelectorAll('.gallery-item img, .flash-card-img img');
    if (!images.length) return;

    var srcs = [];
    var alts = [];
    images.forEach(function (img) {
      if (img.src && img.naturalWidth > 0) {
        srcs.push(img.src);
        alts.push(img.alt || '');
      }
    });

    // Also handle images that haven't loaded yet
    images.forEach(function (img, idx) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        // Rebuild srcs from visible images
        var visibleSrcs = [];
        var visibleAlts = [];
        var clickedIndex = 0;
        images.forEach(function (im, j) {
          if (im.style.display !== 'none' && im.src) {
            if (im === img) clickedIndex = visibleSrcs.length;
            visibleSrcs.push(im.src);
            visibleAlts.push(im.alt || '');
          }
        });
        if (visibleSrcs.length) openLightbox(visibleSrcs, visibleAlts, clickedIndex);
      });
    });
  }

  var currentLB = null;

  function openLightbox(srcs, alts, index) {
    if (currentLB) currentLB.remove();

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>' +
      '<button class="lightbox-next" aria-label="Next">&rsaquo;</button>' +
      '<img class="lightbox-img" src="" alt="" />' +
      '<div class="lightbox-counter"></div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    currentLB = overlay;

    var img = overlay.querySelector('.lightbox-img');
    var counter = overlay.querySelector('.lightbox-counter');
    var cur = index;

    function show(i) {
      cur = i;
      img.src = srcs[cur];
      img.alt = alts[cur];
      counter.textContent = (cur + 1) + ' / ' + srcs.length;
    }

    function close() {
      overlay.classList.add('lightbox--closing');
      setTimeout(function () {
        overlay.remove();
        document.body.style.overflow = '';
        currentLB = null;
      }, 200);
    }

    function prev() { show(cur > 0 ? cur - 1 : srcs.length - 1); }
    function next() { show(cur < srcs.length - 1 ? cur + 1 : 0); }

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
    overlay.querySelector('.lightbox-next').addEventListener('click', next);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function handler(e) {
      if (!currentLB) { document.removeEventListener('keydown', handler); return; }
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    requestAnimationFrame(function () {
      overlay.classList.add('lightbox--open');
      show(cur);
    });
  }

  /* ── Skeleton Loader Cleanup ── */
  function initSkeletons() {
    // Hide skeleton once widget content appears
    var skeletonWrappers = document.querySelectorAll('.skeleton-wrap');
    if (!skeletonWrappers.length) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        var wrap = m.target.closest('.skeleton-wrap');
        if (wrap && wrap.querySelector('iframe, .behold-grid, .embedsocial-hashtag > div')) {
          wrap.classList.add('skeleton-loaded');
        }
      });
    });

    skeletonWrappers.forEach(function (wrap) {
      observer.observe(wrap, { childList: true, subtree: true });
      // Fallback: hide after 8s
      setTimeout(function () { wrap.classList.add('skeleton-loaded'); }, 8000);
    });
  }

  /* ── Init ── */
  // Nav
  var navEl = document.querySelector('[data-component="nav"]');
  if (navEl) {
    navEl.outerHTML = buildNav(navEl.dataset.page || '');
  }

  // Footer
  var footerEls = document.querySelectorAll('[data-component="footer"]');
  footerEls.forEach(function (el) {
    el.outerHTML = buildFooter();
  });

  // Breadcrumbs
  var bcEls = document.querySelectorAll('[data-component="breadcrumbs"]');
  bcEls.forEach(function (el) {
    try {
      var items = JSON.parse(el.dataset.items);
      el.outerHTML = buildBreadcrumbs(items);
    } catch (e) { /* silent */ }
  });

  // Lightbox (wait for images)
  if (document.querySelector('.gallery-item, .flash-card-img')) {
    window.addEventListener('load', initLightbox);
  }

  // Skeletons
  initSkeletons();

}());
