/**
 * KaZem Mieszkania — Cookie Consent
 * Współdzielony skrypt dla index.html i oferty.html
 *
 * Logika:
 *  - Zgoda zapisana w localStorage['kazem_cookie_consent'] = 'yes' | 'no'
 *  - Baner pojawia się tylko jeśli brak zapisanej decyzji (null)
 *  - GA4 uruchamiane warunkowo — tylko po zgodzie i tylko na stronach które mają gtag
 *  - Przycisk "Ustawienia" — możliwość zmiany decyzji w dowolnym momencie
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'kazem_cookie_consent';
  var GA_ID       = 'G-ES5YM8V4SF';

  /* ── 1. CSS banera ─────────────────────────────────────────── */
  var css = `
    #kz-cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: #1A1A18;
      border-top: 1px solid rgba(196,151,90,.35);
      padding: 1.1rem 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      transform: translateY(100%);
      transition: transform .38s cubic-bezier(.22,1,.36,1);
      font-family: 'DM Sans', sans-serif;
    }
    #kz-cookie-banner.kz-visible {
      transform: translateY(0);
    }
    #kz-cookie-banner.kz-hide {
      transform: translateY(100%);
    }
    .kz-cookie-text {
      flex: 1;
      min-width: 200px;
      font-size: .82rem;
      line-height: 1.6;
      color: rgba(255,255,255,.65);
    }
    .kz-cookie-text strong {
      color: #C4975A;
      font-weight: 600;
    }
    .kz-cookie-text a {
      color: rgba(255,255,255,.5);
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color .2s;
    }
    .kz-cookie-text a:hover {
      color: #C4975A;
    }
    .kz-cookie-btns {
      display: flex;
      gap: .6rem;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    .kz-btn-accept, .kz-btn-reject {
      padding: .52rem 1.2rem;
      border-radius: 100px;
      font-size: .82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all .2s;
      border: none;
      white-space: nowrap;
    }
    .kz-btn-accept {
      background: #C4975A;
      color: #fff;
    }
    .kz-btn-accept:hover {
      background: #b5874a;
    }
    .kz-btn-reject {
      background: transparent;
      color: rgba(255,255,255,.6);
      border: 1px solid rgba(255,255,255,.2);
    }
    .kz-btn-reject:hover {
      border-color: rgba(255,255,255,.5);
      color: rgba(255,255,255,.9);
    }

    /* Przycisk "Zmień ustawienia" w stopce — pojawia się zawsze */
    #kz-cookie-settings-btn {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      background: none;
      border: none;
      color: rgba(255,255,255,.35);
      font-size: .72rem;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      padding: 0;
      transition: color .2s;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    #kz-cookie-settings-btn:hover {
      color: #C4975A;
    }

    /* Wersja jasna (dla stopki w jasnym tle) */
    #kz-cookie-settings-btn.kz-light {
      color: rgba(107,100,89,.6);
    }
    #kz-cookie-settings-btn.kz-light:hover {
      color: #C4975A;
    }

    @media (max-width: 600px) {
      #kz-cookie-banner {
        padding: 1rem 1.2rem;
        gap: 1rem;
      }
      .kz-cookie-btns {
        width: 100%;
      }
      .kz-btn-accept, .kz-btn-reject {
        flex: 1;
        text-align: center;
      }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 2. Funkcje GA ─────────────────────────────────────────── */
  function enableGA() {
    // Ustaw consent dla Google
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    // Jeśli gtag nie istnieje (np. jesteśmy na oferty.html bez GA), pomijamy
  }

  function disableGA() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    // Blokuj ciasteczka GA przez własność window
    window['ga-disable-' + GA_ID] = true;
  }

  /* ── 3. Zapisz i zastosuj decyzję ──────────────────────────── */
  function applyConsent(decision) {
    localStorage.setItem(STORAGE_KEY, decision);
    if (decision === 'yes') {
      enableGA();
    } else {
      disableGA();
      // Usuń istniejące ciasteczka GA jeśli były już ustawione
      var cookies = ['_ga', '_ga_' + GA_ID.replace('G-', '').replace(/-/g, '_')];
      cookies.forEach(function(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname.replace('www.','');
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    }
  }

  /* ── 4. Buduj i pokazuj baner ──────────────────────────────── */
  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'kz-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Informacja o plikach cookie');
    banner.innerHTML =
      '<div class="kz-cookie-text">' +
        '<strong>🍪 Pliki cookie</strong> — używamy Google Analytics, ' +
        'aby analizować ruch na stronie. Dane są anonimowe i pomagają ' +
        'nam ulepszać serwis. ' +
        '<a href="#polityka-prywatnosci" onclick="document.getElementById(\'kz-cookie-banner\').classList.add(\'kz-hide\')">Polityka prywatności</a>' +
      '</div>' +
      '<div class="kz-cookie-btns">' +
        '<button class="kz-btn-reject" id="kz-reject">Tylko niezbędne</button>' +
        '<button class="kz-btn-accept" id="kz-accept">Akceptuję</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Animacja wejścia — po małym opóźnieniu żeby CSS transition zadziałało
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        banner.classList.add('kz-visible');
      });
    });

    document.getElementById('kz-accept').addEventListener('click', function() {
      applyConsent('yes');
      hideBanner(banner);
    });

    document.getElementById('kz-reject').addEventListener('click', function() {
      applyConsent('no');
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('kz-visible');
    banner.classList.add('kz-hide');
    setTimeout(function() {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 400);
  }

  /* ── 5. Przycisk "Zmień ustawienia cookie" ─────────────────── */
  // Wstrzykiwany do stopki — wywołaj ręcznie lub przez data-kz-settings
  window.KZCookie = {
    showSettings: function() {
      // Usuń poprzednią decyzję i pokaż baner od nowa
      localStorage.removeItem(STORAGE_KEY);
      var existing = document.getElementById('kz-cookie-banner');
      if (existing) existing.parentNode.removeChild(existing);
      showBanner();
    },
    getConsent: function() {
      return localStorage.getItem(STORAGE_KEY); // 'yes' | 'no' | null
    }
  };

  /* ── 6. Init — sprawdź istniejącą decyzję ──────────────────── */
  function init() {
    var consent = localStorage.getItem(STORAGE_KEY);

    if (consent === 'yes') {
      // Użytkownik już zgodził się — uruchom GA
      enableGA();
    } else if (consent === 'no') {
      // Użytkownik odmówił — zablokuj GA
      disableGA();
    } else {
      // Brak decyzji — pokaż baner
      // Małe opóźnienie żeby strona zdążyła się załadować wizualnie
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(showBanner, 800);
        });
      } else {
        setTimeout(showBanner, 800);
      }
    }
  }

  init();

})();
