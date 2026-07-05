/**
 * KaZem Mieszkania — Cookie Consent + GA4 Loader
 * cookie-consent.js · v2026-07-01
 *
 * Wspólny skrypt dla index.html i oferty.html
 *
 * Architektura (naprawiona):
 *  1. Ten plik musi być PIERWSZYM skryptem w <head>, PRZED jakimkolwiek gtag.js
 *  2. Inicjalizuje dataLayer i ustawia consent 'default' natychmiast (synchronicznie)
 *  3. Jeśli użytkownik już wyraził zgodę → ustawia granted PRZED załadowaniem gtag.js
 *  4. Dopiero potem dynamicznie wstrzykuje <script async src="gtag.js">
 *  5. Baner pojawia się tylko jeśli brak zapisanej decyzji
 *
 * Wynik: GA4 zawsze widzi poprawny stan consent od pierwszego hitu.
 *
 * Zgoda: localStorage['kazem_cookie_consent'] = 'yes' | 'no'
 */

(function () {
  'use strict';

  var GA_ID       = 'G-ES5YM8V4SF';
  var STORAGE_KEY = 'kazem_cookie_consent';
  var consent     = localStorage.getItem(STORAGE_KEY); // 'yes' | 'no' | null

  /* ── 1. Inicjalizuj dataLayer i gtag natychmiast (synchronicznie) ── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag; // eksportuj globalnie — wymagane przez gtag.js

  /* ── 2. Ustaw consent DEFAULT — przed załadowaniem gtag.js ─────── */
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage:        'denied',
    wait_for_update:   2000  // dłuższy timeout — dajemy czas na synchroniczną aktualizację poniżej
  });

  /* ── 3. Jeśli zgoda już istnieje — UPDATE przed załadowaniem GA ── */
  if (consent === 'yes') {
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage:        'denied'   // reklamy zawsze denied
    });
  }
  // (dla 'no' i null — pozostaje 'denied', nic nie robimy)

  /* ── 4. Wstrzyknij gtag.js dopiero teraz ──────────────────────── */
  var gtagScript    = document.createElement('script');
  gtagScript.async  = true;
  gtagScript.src    = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(gtagScript);

  /* ── 5. Konfiguruj GA po załadowaniu skryptu ──────────────────── */
  gtagScript.onload = function () {
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip:        true,
      send_page_view:      true,
      cookie_flags:        'SameSite=None;Secure'
    });
  };

  /* ── 6. CSS banera ─────────────────────────────────────────────── */
  var css = [
    '#kz-cookie-banner{',
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;',
      'background:#1A1A18;border-top:1px solid rgba(196,151,90,.35);',
      'padding:1.1rem 2rem;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;',
      'transform:translateY(100%);transition:transform .38s cubic-bezier(.22,1,.36,1);',
      'font-family:"DM Sans",system-ui,sans-serif;',
    '}',
    '#kz-cookie-banner.kz-visible{transform:translateY(0)}',
    '#kz-cookie-banner.kz-hide{transform:translateY(100%)}',
    '.kz-cookie-text{flex:1;min-width:200px;font-size:.82rem;line-height:1.6;color:rgba(255,255,255,.65)}',
    '.kz-cookie-text strong{color:#C4975A;font-weight:600}',
    '.kz-cookie-text a{color:rgba(255,255,255,.5);text-decoration:underline;text-underline-offset:3px;transition:color .2s}',
    '.kz-cookie-text a:hover{color:#C4975A}',
    '.kz-cookie-btns{display:flex;gap:.6rem;flex-shrink:0;flex-wrap:wrap}',
    '.kz-btn-accept,.kz-btn-reject{',
      'padding:.52rem 1.2rem;border-radius:100px;font-size:.82rem;font-weight:600;',
      'font-family:"DM Sans",system-ui,sans-serif;cursor:pointer;transition:all .2s;border:none;white-space:nowrap;',
    '}',
    '.kz-btn-accept{background:#C4975A;color:#fff}',
    '.kz-btn-accept:hover{background:#b5874a}',
    '.kz-btn-reject{background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.2)}',
    '.kz-btn-reject:hover{border-color:rgba(255,255,255,.5);color:rgba(255,255,255,.9)}',
    '#kz-cookie-settings-btn{',
      'display:inline-flex;align-items:center;gap:.35rem;background:none;border:none;',
      'color:rgba(255,255,255,.35);font-size:.72rem;font-family:"DM Sans",system-ui,sans-serif;',
      'cursor:pointer;padding:0;transition:color .2s;text-decoration:underline;text-underline-offset:3px;',
    '}',
    '#kz-cookie-settings-btn:hover{color:#C4975A}',
    '#kz-cookie-settings-btn.kz-light{color:rgba(107,100,89,.6)}',
    '#kz-cookie-settings-btn.kz-light:hover{color:#C4975A}',
    '@media(max-width:600px){',
      '#kz-cookie-banner{padding:1rem 1.2rem;gap:1rem}',
      '.kz-cookie-btns{width:100%}',
      '.kz-btn-accept,.kz-btn-reject{flex:1;text-align:center}',
    '}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 7. Zastosuj lub cofnij zgodę (po wyborze użytkownika) ─────── */
  function applyConsent(decision) {
    localStorage.setItem(STORAGE_KEY, decision);
    if (decision === 'yes') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
      // Wyślij page_view ręcznie — poprzedni mógł trafić jako 'denied'
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', { send_to: GA_ID });
      }
    } else {
      gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
      window['ga-disable-' + GA_ID] = true;
      // Usuń ciasteczka GA
      ['_ga', '_gid', '_ga_' + GA_ID.replace('G-','').replace(/-/g,'_')].forEach(function (name) {
        var d = location.hostname.replace('www.','');
        document.cookie = name + '=;expires=Thu,01 Jan 1970 00:00:00 UTC;path=/;domain=.' + d;
        document.cookie = name + '=;expires=Thu,01 Jan 1970 00:00:00 UTC;path=/;';
      });
    }
  }

  /* ── 8. Baner ──────────────────────────────────────────────────── */
  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'kz-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Informacja o plikach cookie');
    banner.innerHTML =
      '<div class="kz-cookie-text">' +
        '<strong>🍪 Pliki cookie</strong> — używamy Google Analytics, ' +
        'aby anonimowo analizować ruch na stronie i ulepszać serwis. ' +
        '<a href="#polityka-prywatnosci" onclick="document.getElementById(\'kz-cookie-banner\').classList.add(\'kz-hide\')">Polityka prywatności</a>' +
      '</div>' +
      '<div class="kz-cookie-btns">' +
        '<button class="kz-btn-reject" id="kz-reject">Tylko niezbędne</button>' +
        '<button class="kz-btn-accept" id="kz-accept">Akceptuję</button>' +
      '</div>';

    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('kz-visible'); });
    });

    document.getElementById('kz-accept').addEventListener('click', function () {
      applyConsent('yes');
      hideBanner(banner);
    });
    document.getElementById('kz-reject').addEventListener('click', function () {
      applyConsent('no');
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('kz-visible');
    banner.classList.add('kz-hide');
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 420);
  }

  /* ── 9. Publiczne API ──────────────────────────────────────────── */
  window.KZCookie = {
    showSettings: function () {
      localStorage.removeItem(STORAGE_KEY);
      var existing = document.getElementById('kz-cookie-banner');
      if (existing) existing.parentNode.removeChild(existing);
      showBanner();
    },
    getConsent: function () { return localStorage.getItem(STORAGE_KEY); }
  };

  /* ── 10. Init — pokaż baner jeśli brak decyzji ─────────────────── */
  if (consent === null) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(showBanner, 900);
      });
    } else {
      setTimeout(showBanner, 900);
    }
  }
  // Jeśli consent === 'yes' lub 'no' — baner nie pojawia się, GA obsłużone w kroku 3

})();
