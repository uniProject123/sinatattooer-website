/* Cookie consent banner + Google Consent Mode v2 updates.
 *
 * The consent DEFAULT (everything denied unless the visitor accepted before)
 * is set by the inline snippet in each page's <head>, BEFORE Google Tag
 * Manager loads. This file only shows the banner and sends the visitor's
 * choice as a consent UPDATE.
 *
 * Only analytics is ever asked for. Advertising storage stays denied
 * permanently (the site runs no ads), so the Google Ads cookie (_gcl_au)
 * is never set.
 *
 * The choice is remembered in localStorage ("sina_consent") for 12 months.
 * Any element with [data-cookie-settings] reopens the banner.
 */
(function () {
  'use strict';

  var KEY = 'sina_consent';
  var VERSION = 1;
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readChoice() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === VERSION && typeof c.analytics === 'boolean' && Date.now() - c.ts < MAX_AGE_MS) return c;
    } catch (e) { /* storage blocked or bad JSON */ }
    return null;
  }

  function saveChoice(analytics) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, analytics: analytics, ts: Date.now() })); } catch (e) { /* ignore */ }
  }

  // Remove Google Analytics cookies after a visitor withdraws consent.
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (!/^(_ga|_ga_.+|_gid|_gat.*|_gcl_.+)$/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function apply(analytics, previous) {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.dataLayer.push({ event: 'consent_update', consent_analytics: analytics ? 'granted' : 'denied' });
    if (!analytics && previous && previous.analytics) clearAnalyticsCookies();
  }

  var banner = null;
  var lastFocus = null;

  function build() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie choices');
    banner.hidden = true;
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text" id="cookie-banner-text">' +
          'Can I use analytics cookies? They show me which pages help people find the studio. ' +
          'Nothing is shared for advertising, and the site works the same either way. ' +
          '<a href="/privacy#cookies">Privacy &amp; cookies</a>' +
        '</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="cookie-banner__btn" data-consent="reject">Reject</button>' +
          '<button type="button" class="cookie-banner__btn" data-consent="accept">Accept</button>' +
        '</div>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var analytics = btn.getAttribute('data-consent') === 'accept';
      var previous = readChoice();
      saveChoice(analytics);
      apply(analytics, previous);
      hide();
    });
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && readChoice()) hide();
    });
    document.body.appendChild(banner);
  }

  function show(focus) {
    if (!banner) build();
    lastFocus = document.activeElement;
    banner.hidden = false;
    document.documentElement.classList.add('has-cookie-banner');
    if (focus) banner.querySelector('[data-consent="accept"]').focus();
  }

  function hide() {
    banner.hidden = true;
    document.documentElement.classList.remove('has-cookie-banner');
    if (lastFocus && lastFocus.focus && lastFocus !== document.body) lastFocus.focus();
  }

  function init() {
    if (!readChoice()) show(false);
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookie-settings]');
      if (!t) return;
      e.preventDefault();
      show(true);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
