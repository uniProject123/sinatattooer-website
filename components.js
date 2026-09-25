/**
 * Shared Components — Sina Tattooer
 * Gallery lightbox and widget skeleton cleanup.
 * Nav, footer and breadcrumbs are static HTML in each page — edit them via
 * scripts/sync_partials.py, not here.
 */
(function () {
  'use strict';

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
  // Lightbox (wait for images)
  if (document.querySelector('.gallery-item, .flash-card-img')) {
    window.addEventListener('load', initLightbox);
  }

  // Skeletons
  initSkeletons();

}());
