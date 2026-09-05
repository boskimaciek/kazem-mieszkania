#!/usr/bin/env node
/**
 * build-seo.mjs — generator statycznej warstwy SEO/GEO dla kazemmieszkania.pl
 * ---------------------------------------------------------------------------
 * Problem, który rozwiązuje:
 *   oferty.html pobiera oferty z Supabase JavaScriptem. Roboty AI (GPTBot,
 *   ClaudeBot, PerplexityBot) nie uruchamiają JS — widzą pustą stronę.
 *   Googlebot renderuje JS, ale z opóźnieniem i zawodnie.
 *
 * Co robi:
 *   1. pobiera aktualne oferty z Supabase,
 *   2. wstrzykuje statyczne karty ofert w oferty.html (JS je nadpisuje —
 *      użytkownik widzi dokładnie to samo co dotąd),
 *   3. generuje podstronę dla każdej oferty w /oferta/<slug>.html,
 *   4. generuje JSON-LD (ItemList + Accommodation/Offer + BreadcrumbList),
 *   5. przelicza sitemap.xml,
 *   6. odświeża sekcję ofert w llms.txt (dla botów AI),
 *   7. pilnuje stałości adresów przez seo-slugs.json.
 *
 * Uruchomienie:  node build-seo.mjs        (z katalogu repo)
 * Zmienne środowiskowe (opcjonalne): SB_URL, SB_KEY
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://kazemmieszkania.pl';
const OFFER_DIR = join(ROOT, 'oferta');
const SLUGS_FILE = join(ROOT, 'seo-slugs.json');

const SB_URL = process.env.SB_URL || 'https://ubwtihenkxobchdzafls.supabase.co';
const SB_KEY = process.env.SB_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVid3RpaGVua3hvYmNoZHphZmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDk4MDEsImV4cCI6MjA5MzkyNTgwMX0.evLJqhSvN_bAtp7IhGlpg7LTwBLQjiDuBIlv6_9VKr8';

const PHONE_RAW = '+48723168200';
const PHONE_TXT = '+48 723 168 200';
const EMAIL = 'kasia@kazemmieszkania.pl';
const TODAY = new Date().toISOString().slice(0, 10);

/* ═══════════════════════════════════════════════════════════════ POMOCNICZE */

const PL_MAP = { ą:'a', ć:'c', ę:'e', ł:'l', ń:'n', ó:'o', ś:'s', ź:'z', ż:'z',
                 Ą:'a', Ć:'c', Ę:'e', Ł:'l', Ń:'n', Ó:'o', Ś:'s', Ź:'z', Ż:'z' };

function slugify(str) {
  return String(str || '')
    .replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, ch => PL_MAP[ch] || ch)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Tekst do wnętrza elementu — zachowuje polskie znaki, wycina HTML. */
function txt(str) {
  return esc(String(str ?? '').replace(/\s+/g, ' ').trim());
}

function fmtDatePL(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Odwzorowanie effectiveStatus() z oferty.html — spójność z wersją interaktywną. */
function effectiveStatus(p) {
  if (p.status === 'taken' && p.dateTo) {
    const daysLeft = (new Date(p.dateTo) - new Date()) / 86400000;
    if (daysLeft >= 0 && daysLeft <= 14) return 'soon';
  }
  return p.status || 'taken';
}

function getImgs(p, o) {
  const imgs = Array.isArray(p.imgs) ? p.imgs.filter(Boolean) : [];
  const mi = p.mainImg || 0;
  const ordered = imgs.length ? [imgs[mi] || imgs[0], ...imgs.filter((_, i) => i !== (imgs[mi] ? mi : 0))] : [];
  const uniq = [...new Set(ordered.filter(Boolean))];
  if (!uniq.length && o.img) uniq.push(o.img);
  return uniq;
}

/** Bezpieczne osadzenie JSON-LD w <script> — neutralizuje ewentualne "</script>" w danych. */
function jsonLd(obj) {
  return JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');
}

const STATUS_PL = { available: 'Dostępne', soon: 'Wkrótce wolne', taken: 'Zajęte' };
const STATUS_CLASS = { available: 's-av', soon: 's-so', taken: 's-tk' };

/* ═══════════════════════════════════════════════════════════ POBRANIE DANYCH */

async function fetchOffers() {
  // Tryb testowy: SB_FIXTURE=plik.json — pozwala uruchomić generator bez sieci.
  if (process.env.SB_FIXTURE) {
    const rows = JSON.parse(readFileSync(process.env.SB_FIXTURE, 'utf8'));
    return rows.map(r => ({ ...(r.data || r), id: (r.data?.id ?? r.id) }));
  }
  const url = `${SB_URL}/rest/v1/offers?select=id,data&order=id`;
  const res = await fetch(url, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return rows.map(r => ({ ...r.data, id: r.data?.id ?? r.id }));
}

/* ══════════════════════════════════════════════════ ROZWINIĘCIE DO „JEDNOSTEK" */
/* Jedna jednostka = jeden wynajmowany pokój (lub całe mieszkanie). Tak samo
   liczy renderGrid() w oferty.html, więc liczniki się zgadzają. */

function expandUnits(offers, slugMap) {
  const units = [];
  for (const o of offers) {
    const pokoje = Array.isArray(o.pokoje) ? o.pokoje : [];
    const multi = pokoje.length > 1;
    for (const p of pokoje) {
      const status = effectiveStatus(p);
      const isRoom = o.type === 'pokoj';
      const title = multi ? `${o.title} — ${p.nazwa || 'Pokój'}` : o.title;
      const key = `${o.id}:${p.id}`;

      // Adres URL raz przypisany nigdy się nie zmienia (seo-slugs.json),
      // żeby zaindeksowane strony nie ginęły po edycji tytułu w panelu.
      let slug = slugMap[key];
      if (!slug) {
        const base = slugify([
          isRoom ? 'pokoj' : 'mieszkanie',
          o.district,
          o.street,
          multi ? (p.nazwa || '') : '',
        ].filter(Boolean).join(' ')) || `oferta-${o.id}-${p.id}`;
        slug = base;
        const taken = new Set(Object.values(slugMap));
        let n = 2;
        while (taken.has(slug)) slug = `${base}-${n++}`;
        slugMap[key] = slug;
      }

      units.push({
        o, p, key, slug, status, multi, isRoom, title,
        url: `${SITE}/oferta/${slug}.html`,
        rel: `oferta/${slug}.html`,
        price: Number(p.price) || 0,
        deposit: Number(p.deposit) || 0,
        area: Number(p.area) || 0,
        district: o.district || 'Warszawa',
        street: o.street || '',
        floor: o.floor || '',
        desc: (p.desc || o.desc || '').trim(),
        features: Array.isArray(o.features) ? o.features.filter(Boolean) : [],
        imgs: getImgs(p, o),
        dateFrom: p.dateFrom || '',
        dateTo: p.dateTo || '',
        indexable: status !== 'taken',
      });
    }
  }
  const ord = { available: 0, soon: 1, taken: 2 };
  units.sort((a, b) => (ord[a.status] ?? 2) - (ord[b.status] ?? 2) || a.slug.localeCompare(b.slug, 'pl'));
  return units;
}

/* ══════════════════════════════════════════════════ STATYCZNE KARTY DO #grid */
/* Markup celowo bliski temu, co produkuje renderGrid(), ale karta jest linkiem
   <a href>. Dzięki temu roboty odkrywają podstrony ofert, a strona działa
   nawet z wyłączonym JS. Po starcie JS grid.innerHTML jest nadpisywany. */

function buildGridHTML(units) {
  return units.map(u => {
    const st = STATUS_PL[u.status];
    const sc = STATUS_CLASS[u.status];
    const typeLabel = u.isRoom ? 'Pokój' : 'Mieszkanie';
    const img = u.imgs[0]
      ? `<img src="${esc(u.imgs[0])}" alt="${txt(u.title)} — ${txt(u.district)}, Warszawa" loading="lazy" width="360" height="190">`
      : '<div class="cimg-ph">🏠</div>';

    let overlay;
    if (u.status === 'available') overlay = u.price ? `${u.price} zł<span style="font-size:10px;opacity:.8">/mies.</span>` : 'Wolne';
    else if (u.status === 'soon') overlay = `Dostępne od: ${fmtDatePL(u.dateFrom)}`;
    else overlay = `Zajęte do ${fmtDatePL(u.dateTo)}`;

    const details = [
      u.area ? `${u.area} m²` : '',
      (u.o.totalRooms && u.multi) ? `${u.o.totalRooms}-pok.` : '',
      (u.floor && !u.multi) ? `p. ${u.floor}` : '',
      ...u.features.slice(0, 2),
    ].filter(Boolean).map(d => `<div class="cdet">${txt(d)}</div>`).join('');

    const priceBlock = u.status === 'available'
      ? `<div class="cprice">${u.price} zł<small>/mies.</small></div>`
      : u.status === 'soon'
        ? '<div style="font-size:.78rem;color:#b45309;font-weight:600">Wkrótce wolne</div>'
        : '<div style="font-size:.78rem;color:var(--muted)">Zajęte</div>';

    return `<a class="card${u.status === 'taken' ? ' taken' : ''}" href="${esc(u.rel)}" data-oid="${esc(u.o.id)}" data-pid="${esc(u.p.id)}">` +
      `<div class="cimg">${img}` +
      `<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.82) 55%,rgba(0,0,0,.95));padding:12px 10px 8px;text-align:center">` +
      `<span style="color:#fff;font-weight:700;font-size:12px">${overlay}</span></div>` +
      `<div class="cstatus ${sc}">${st}</div><div class="ctype">${typeLabel}</div></div>` +
      `<div class="cbody">` +
      (u.multi && u.street ? `<div class="cbadge">${txt(u.street)}${u.floor ? ` · p. ${txt(u.floor)}` : ''}</div>` : '') +
      `<div class="cdistrict">${txt(u.district)}${(u.street && !u.multi) ? ` · ${txt(u.street)}` : ''}</div>` +
      `<div class="ctitle">${txt(u.title)}</div>` +
      `<div class="cdesc">${txt(u.desc)}</div>` +
      `<div class="cdetails">${details}</div>` +
      `<div class="cfooter">${priceBlock}<span class="ccta">${u.status === 'taken' ? 'Zajęte' : 'Szczegóły'}</span></div>` +
      `</div></a>`;
  }).join('\n');
}

/* ═════════════════════════════════════════════════ SEKCJA TEKSTOWA (długi ogon) */

function buildTextSection(units) {
  const byDistrict = {};
  for (const u of units) {
    if (u.status === 'taken') continue;
    (byDistrict[u.district] ||= []).push(u);
  }
  const districts = Object.keys(byDistrict).sort((a, b) => a.localeCompare(b, 'pl'));
  const avail = units.filter(u => u.status === 'available');
  const prices = avail.map(u => u.price).filter(Boolean).sort((a, b) => a - b);
  const priceLine = prices.length
    ? `Ceny aktualnie dostępnych pokoi i mieszkań mieszczą się w przedziale od ${prices[0]} zł do ${prices[prices.length - 1]} zł miesięcznie.`
    : '';

  const districtList = districts.length
    ? `<ul class="dzielnice">${districts.map(d =>
        `<li><a href="#dz-${slugify(d)}">${txt(d)} (${byDistrict[d].length})</a></li>`).join('')}</ul>`
    : '';

  const districtSections = districts.map(d => {
    const list = byDistrict[d];
    const p = list.map(u => u.price).filter(Boolean);
    const range = p.length ? (Math.min(...p) === Math.max(...p) ? `${p[0]} zł` : `${Math.min(...p)}–${Math.max(...p)} zł`) : 'do uzgodnienia';
    return `<h3 id="dz-${slugify(d)}">Pokoje do wynajęcia — ${txt(d)}, Warszawa</h3>
<p>Aktualnie mamy tu ${list.length} ${list.length === 1 ? 'wolną ofertę' : 'wolnych ofert'} w cenie ${range} miesięcznie. ` +
`${list.slice(0, 6).map(u => `<a href="${esc(u.rel)}">${txt(u.title)}</a>`).join(', ')}.</p>`;
  }).join('\n');

  return `<section class="seotext">
<h2>Pokoje i mieszkania do wynajęcia w Warszawie — aktualna oferta</h2>
<p>KaZem Mieszkania wynajmuje pokoje studenckie i mieszkania w Warszawie. Wszystkie lokale
z tej listy są zarządzane bezpośrednio przez nas — nie jesteśmy portalem ogłoszeniowym,
tylko zarządcą, który odpowiada za umowę, rozliczenia i bieżącą obsługę najmu.
${priceLine} Stan na ${fmtDatePL(TODAY)}.</p>

<h2>Najem studencki w Warszawie — jak to u nas wygląda</h2>
<p>Wynajmujemy pokoje przede wszystkim studentom warszawskich uczelni. Umowę podpisujemy
na czas określony, zwykle na rok akademicki, z możliwością przedłużenia. Kaucja to
najczęściej równowartość jednego czynszu. W czynszu zawarte są opłaty administracyjne;
media rozliczamy według zużycia.</p>
<h3>Co zawiera oferta</h3>
<ul>
<li>Umowa najmu podpisywana przez zarządcę w imieniu właściciela — bez czekania na jego dyspozycyjność.</li>
<li>Umeblowany pokój gotowy do wprowadzenia się, z internetem i dostępem do części wspólnych.</li>
<li>Zgłaszanie usterek do jednej osoby i reakcja w ciągu 24 godzin.</li>
<li>Rozliczenia i potwierdzenia płatności prowadzone na bieżąco.</li>
</ul>

<h2>Dzielnice, w których mamy wolne pokoje</h2>
${districtList}
${districtSections}

<h2>Najczęstsze pytania o wynajem pokoju w Warszawie</h2>
<h3>Ile kosztuje wynajem pokoju dla studenta w Warszawie?</h3>
<p>${prices.length
    ? `W naszych aktualnych ofertach czynsz za pokój zaczyna się od ${prices[0]} zł miesięcznie, a najdroższe lokale kosztują ${prices[prices.length - 1]} zł.`
    : 'Ceny zależą od dzielnicy, metrażu i standardu — aktualne stawki podajemy przy każdej ofercie.'}
Do czynszu dochodzą media rozliczane według zużycia.</p>
<h3>Czy wynajmujecie pokoje na rok akademicki?</h3>
<p>Tak. Standardowa umowa obejmuje rok akademicki od października do końca czerwca lub
pełne dwanaście miesięcy. Krótsze okresy ustalamy indywidualnie.</p>
<h3>Jaka jest kaucja?</h3>
<p>Zwykle równowartość jednego miesięcznego czynszu. Zwracamy ją po zakończeniu najmu
i rozliczeniu mediów.</p>
<h3>Czy trzeba płacić prowizję pośrednika?</h3>
<p>Nie. Zarządzamy tymi mieszkaniami bezpośrednio, więc najemca nie płaci prowizji za znalezienie pokoju.</p>
<h3>Jak szybko dostanę odpowiedź na zapytanie?</h3>
<p>Odpowiadamy w ciągu 24 godzin. Najszybciej pod numerem <a href="tel:${PHONE_RAW}">${PHONE_TXT}</a>
lub mailem <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>

<h2>Kontakt</h2>
<p>KaZem Mieszkania — Katarzyna Zemlik, zarządzanie najmem w Warszawie.
Telefon <a href="tel:${PHONE_RAW}">${PHONE_TXT}</a>, e-mail <a href="mailto:${EMAIL}">${EMAIL}</a>.
Więcej o obsłudze najmu dla właścicieli mieszkań znajdziesz na <a href="index.html">stronie głównej</a>.</p>
</section>`;
}

/* ═══════════════════════════════════════════════════════════════════ JSON-LD */

function offerSchema(u) {
  const availability = u.status === 'available'
    ? 'https://schema.org/InStock'
    : u.status === 'soon' ? 'https://schema.org/PreOrder' : 'https://schema.org/SoldOut';

  const accommodation = {
    '@type': u.isRoom ? 'Room' : 'Apartment',
    name: u.title,
    description: u.desc || `${u.isRoom ? 'Pokój' : 'Mieszkanie'} do wynajęcia — ${u.district}, Warszawa.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: u.street || undefined,
      addressLocality: 'Warszawa',
      addressRegion: 'Mazowieckie',
      addressCountry: 'PL',
    },
  };
  if (u.area) accommodation.floorSize = { '@type': 'QuantitativeValue', value: u.area, unitCode: 'MTK' };
  if (u.o.totalRooms) accommodation.numberOfRooms = u.o.totalRooms;
  if (u.imgs.length) accommodation.photo = u.imgs;
  if (u.o.lat && u.o.lng) accommodation.geo = { '@type': 'GeoCoordinates', latitude: u.o.lat, longitude: u.o.lng };
  if (u.features.length) accommodation.amenityFeature = u.features.map(f => ({
    '@type': 'LocationFeatureSpecification', name: f, value: true,
  }));

  const offer = {
    '@type': 'Offer',
    name: u.title,
    url: u.url,
    availability,
    priceCurrency: 'PLN',
    price: u.price || undefined,
    priceSpecification: u.price ? {
      '@type': 'UnitPriceSpecification',
      price: u.price,
      priceCurrency: 'PLN',
      unitCode: 'MON',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
    } : undefined,
    availabilityStarts: u.dateFrom || undefined,
    itemOffered: accommodation,
    seller: { '@type': 'RealEstateAgent', name: 'KaZem Mieszkania', url: SITE, telephone: PHONE_RAW },
    areaServed: { '@type': 'City', name: 'Warszawa' },
  };
  return JSON.parse(JSON.stringify(offer)); // usuwa undefined
}

function buildJsonLd(units) {
  const listed = units.filter(u => u.indexable);
  const graph = [
    {
      '@type': 'RealEstateAgent',
      '@id': `${SITE}/#organizacja`,
      name: 'KaZem Mieszkania',
      description: 'Aktualne oferty pokoi studenckich i mieszkań na wynajem w Warszawie. Obsługa najmu bez stresu dla właściciela i najemcy.',
      url: `${SITE}/oferty.html`,
      telephone: PHONE_RAW,
      email: EMAIL,
      address: { '@type': 'PostalAddress', addressLocality: 'Warszawa', addressRegion: 'Mazowieckie', addressCountry: 'PL' },
      areaServed: { '@type': 'City', name: 'Warszawa' },
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE}/oferty.html#strona`,
      url: `${SITE}/oferty.html`,
      name: 'Pokoje studenckie i mieszkania do wynajęcia Warszawa',
      description: 'Aktualne oferty pokoi studenckich i mieszkań na wynajem w Warszawie.',
      inLanguage: 'pl-PL',
      dateModified: TODAY,
      isPartOf: { '@id': `${SITE}/#organizacja` },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/oferty.html#lista-ofert`,
      name: 'Aktualne oferty pokoi i mieszkań do wynajęcia w Warszawie',
      numberOfItems: listed.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: listed.map((u, i) => ({
        '@type': 'ListItem', position: i + 1, url: u.url, name: u.title, item: offerSchema(u),
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Strona główna', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Oferty', item: `${SITE}/oferty.html` },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/oferty.html#faq`,
      mainEntity: faqData(units).map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];
  return jsonLd({ '@context': 'https://schema.org', '@graph': graph });
}

function faqData(units) {
  const prices = units.filter(u => u.status === 'available').map(u => u.price).filter(Boolean).sort((a, b) => a - b);
  return [
    ['Ile kosztuje wynajem pokoju dla studenta w Warszawie?',
      prices.length
        ? `W aktualnych ofertach KaZem Mieszkania czynsz za pokój zaczyna się od ${prices[0]} zł miesięcznie, a najdroższe lokale kosztują ${prices[prices.length - 1]} zł. Do czynszu dochodzą media rozliczane według zużycia.`
        : 'Ceny zależą od dzielnicy, metrażu i standardu. Aktualne stawki podajemy przy każdej ofercie.'],
    ['Czy wynajmujecie pokoje na rok akademicki?',
      'Tak. Standardowa umowa obejmuje rok akademicki od października do końca czerwca lub pełne dwanaście miesięcy. Krótsze okresy ustalamy indywidualnie.'],
    ['Jaka jest kaucja przy wynajmie pokoju?',
      'Zwykle równowartość jednego miesięcznego czynszu. Zwracamy ją po zakończeniu najmu i rozliczeniu mediów.'],
    ['Czy najemca płaci prowizję?',
      'Nie. KaZem Mieszkania zarządza tymi mieszkaniami bezpośrednio, więc najemca nie płaci prowizji za znalezienie pokoju.'],
    ['W jakich dzielnicach Warszawy macie pokoje do wynajęcia?',
      `Najczęściej ${[...new Set(units.map(u => u.district))].join(', ')}. Obsługujemy całą Warszawę.`],
    ['Jak szybko dostanę odpowiedź na zapytanie?',
      `Odpowiadamy w ciągu 24 godzin. Kontakt: ${PHONE_TXT}, ${EMAIL}.`],
  ];
}

/* ══════════════════════════════════════════════════════ PODSTRONA POJEDYNCZEJ OFERTY */

function offerPage(u, allUnits) {
  const typeLabel = u.isRoom ? 'Pokój' : 'Mieszkanie';
  // Tytuł prowadzony frazą, nie nazwą własną oferty: użytkownik szuka
  // "pokój do wynajęcia Mokotów", nie "Mieszkanie studenckie — Puławska".
  // Google ucina ok. 60-65 znaków, więc markę doklejamy tylko gdy się mieści.
  const streetShort = u.street.replace(/^(ul\.|al\.|pl\.)\s*/i, '').trim();
  const roomSuffix = (u.multi && u.p.nazwa) ? `, ${u.p.nazwa.replace(/\s*\(.*\)\s*/, '')}` : '';
  const core = [
    `${typeLabel} do wynajęcia ${u.district}`,
    streetShort ? ` — ${streetShort}${roomSuffix}` : roomSuffix,
    u.price ? ` · ${u.price} zł/mies.` : '',
  ].join('');
  const title = core.length <= 45 ? `${core} | KaZem Mieszkania` : core;
  const metaDesc = [
    `${typeLabel} do wynajęcia w Warszawie, dzielnica ${u.district}${u.street ? `, ${u.street}` : ''}.`,
    u.area ? `${u.area} m².` : '',
    u.price ? `${u.price} zł miesięcznie.` : '',
    u.status === 'available' ? 'Dostępny od zaraz.' : u.status === 'soon' ? `Dostępny od ${fmtDatePL(u.dateFrom)}.` : 'Aktualnie zajęty.',
    'Zarządzanie najmem KaZem Mieszkania — odpowiedź w 24h.',
  ].filter(Boolean).join(' ').slice(0, 300);

  const related = allUnits
    .filter(x => x.slug !== u.slug && x.indexable && x.district === u.district).slice(0, 3);
  const other = allUnits
    .filter(x => x.slug !== u.slug && x.indexable && x.district !== u.district).slice(0, 3);

  const graph = [
    offerSchema(u),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Strona główna', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Oferty', item: `${SITE}/oferty.html` },
        { '@type': 'ListItem', position: 3, name: `${u.district}`, item: `${SITE}/oferty.html#dz-${slugify(u.district)}` },
        { '@type': 'ListItem', position: 4, name: u.title, item: u.url },
      ],
    },
  ];

  const gallery = u.imgs.length
    ? `<div class="gal">${u.imgs.slice(0, 8).map((src, i) =>
        `<img src="${esc(src)}" alt="${txt(u.title)} — ${txt(u.district)}, Warszawa (zdjęcie ${i + 1})" loading="${i === 0 ? 'eager' : 'lazy'}">`).join('')}</div>`
    : '';

  const facts = [
    ['Typ', typeLabel],
    ['Dzielnica', u.district],
    u.street ? ['Adres', u.street] : null,
    u.floor ? ['Piętro', u.floor] : null,
    u.area ? ['Powierzchnia', `${u.area} m²`] : null,
    u.o.totalRooms ? ['Pokoi w mieszkaniu', u.o.totalRooms] : null,
    u.price ? ['Czynsz', `${u.price} zł / mies.`] : null,
    u.deposit ? ['Kaucja', `${u.deposit} zł`] : null,
    ['Status', STATUS_PL[u.status]],
    u.status === 'soon' && u.dateFrom ? ['Dostępne od', fmtDatePL(u.dateFrom)] : null,
    u.status === 'taken' && u.dateTo ? ['Zajęte do', fmtDatePL(u.dateTo)] : null,
  ].filter(Boolean);

  return `<!-- Strona generowana automatycznie przez build-seo.mjs · ${TODAY} · NIE EDYTUJ RĘCZNIE -->
<!DOCTYPE html>
<html lang="pl">
<head>
<script src="../cookie-consent.js"><\/script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${txt(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${u.url}">
<meta name="robots" content="${u.indexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow'}">
<meta property="og:type" content="article">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="KaZem Mieszkania">
<meta property="og:title" content="${txt(title)}">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:url" content="${u.url}">
${u.imgs[0] ? `<meta property="og:image" content="${esc(u.imgs[0])}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--cream:#FAF7F0;--dark:#171512;--accent:#A8432C;--muted:#5C564D;--white:#fff;--border:#DDD5C7}
body{font-family:'Instrument Sans',system-ui,sans-serif;background:var(--cream);color:var(--dark);line-height:1.6}
a{color:var(--accent)}
nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:var(--white);border-bottom:1px solid var(--border);flex-wrap:wrap;gap:.5rem}
.logo{font-family:'Bricolage Grotesque',sans-serif;font-size:1.25rem;font-weight:700;color:var(--dark);text-decoration:none}
.logo span{color:var(--accent)}
.nav-cta{background:var(--dark);color:#fff;padding:.5rem 1.2rem;border-radius:100px;font-size:.85rem;text-decoration:none}
.wrap{max-width:880px;margin:0 auto;padding:1.5rem 2rem 4rem}
.crumbs{font-size:.8rem;color:var(--muted);margin-bottom:1.2rem}
.crumbs a{color:var(--muted)}
h1{font-family:'Bricolage Grotesque',sans-serif;font-size:2.1rem;line-height:1.15;margin-bottom:.5rem}
.sub{color:var(--muted);font-size:1rem;margin-bottom:1.2rem}
.badge{display:inline-block;padding:.3rem .9rem;border-radius:100px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:1rem}
.b-av{background:#dcfce7;color:#15803d}.b-so{background:#fef3c7;color:#b45309}.b-tk{background:#f3f4f6;color:#6b7280}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.6rem;margin:1.5rem 0}
.gal img{width:100%;height:190px;object-fit:cover;border-radius:12px;border:1px solid var(--border);display:block}
.facts{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin:1.5rem 0}
.facts th,.facts td{text-align:left;padding:.7rem 1rem;border-bottom:1px solid var(--border);font-size:.92rem}
.facts tr:last-child th,.facts tr:last-child td{border-bottom:none}
.facts th{width:42%;font-weight:600;color:var(--muted)}
h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.35rem;margin:2rem 0 .6rem}
p{margin-bottom:.9rem;color:var(--muted)}
ul{margin:0 0 1rem 1.2rem;color:var(--muted)}
.cta{background:var(--dark);color:#fff;border-radius:16px;padding:1.5rem;margin:2rem 0}
.cta h2{color:#fff;margin-top:0}
.cta p{color:rgba(255,255,255,.7)}
.cta a{display:inline-block;background:var(--accent);color:#fff;padding:.7rem 1.5rem;border-radius:100px;text-decoration:none;font-weight:600;margin-right:.5rem;margin-top:.4rem}
.rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:.8rem;margin:1rem 0 2rem}
.rel a{display:block;background:var(--white);border:1px solid var(--border);border-radius:12px;padding:.9rem 1rem;text-decoration:none;color:var(--dark)}
.rel a:hover{border-color:var(--accent)}
.rel .rt{font-weight:600;font-size:.92rem;margin-bottom:.15rem}
.rel .rm{font-size:.8rem;color:var(--muted)}
footer{background:var(--dark);color:rgba(255,255,255,.6);padding:2rem;font-size:.85rem;text-align:center}
footer a{color:#fff}
@media(max-width:700px){.wrap{padding:1.2rem 1.2rem 3rem}h1{font-size:1.6rem}nav{padding:.9rem 1.2rem}}
</style>
<script type="application/ld+json">
${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}
<\/script>
</head>
<body>
<nav>
  <a href="../index.html" class="logo">Ka<span>Zem</span> Mieszkania</a>
  <a href="../index.html#kontakt" class="nav-cta">Kontakt</a>
</nav>
<div class="wrap">
  <div class="crumbs"><a href="../index.html">Strona główna</a> › <a href="../oferty.html">Oferty</a> › <a href="../oferty.html#dz-${slugify(u.district)}">${txt(u.district)}</a> › ${txt(u.title)}</div>
  <span class="badge b-${u.status === 'available' ? 'av' : u.status === 'soon' ? 'so' : 'tk'}">${STATUS_PL[u.status]}</span>
  <h1>${txt(u.title)} — ${txt(u.district)}, Warszawa</h1>
  <p class="sub">${typeLabel} do wynajęcia w Warszawie${u.street ? `, ${txt(u.street)}` : ''}${u.area ? ` · ${u.area} m²` : ''}${u.price ? ` · ${u.price} zł/mies.` : ''}</p>
  ${gallery}
  <h2>Szczegóły oferty</h2>
  <table class="facts"><tbody>
  ${facts.map(([k, v]) => `<tr><th>${txt(k)}</th><td>${txt(v)}</td></tr>`).join('\n  ')}
  </tbody></table>
  ${u.desc ? `<h2>Opis</h2><p>${txt(u.desc)}</p>` : ''}
  ${u.features.length ? `<h2>Wyposażenie</h2><ul>${u.features.map(f => `<li>${txt(f)}</li>`).join('')}</ul>` : ''}

  <h2>Warunki najmu</h2>
  <ul>
    <li>Umowa najmu na czas określony — rok akademicki lub dwanaście miesięcy.</li>
    ${u.deposit ? `<li>Kaucja: ${u.deposit} zł, zwracana po zakończeniu najmu i rozliczeniu mediów.</li>` : '<li>Kaucja: zwykle równowartość jednego czynszu.</li>'}
    <li>Media rozliczane według zużycia, poza czynszem.</li>
    <li>Bez prowizji dla najemcy — mieszkaniem zarządzamy bezpośrednio.</li>
    <li>Zgłoszenia usterek do jednej osoby, reakcja w ciągu 24 godzin.</li>
  </ul>

  <div class="cta">
    <h2>Zapytaj o tę ofertę</h2>
    <p>Odpowiadamy w ciągu 24 godzin. Oferta prowadzona przez Katarzynę Zemlik, KaZem Mieszkania.</p>
    <a href="tel:${PHONE_RAW}">📞 ${PHONE_TXT}</a>
    <a href="mailto:${EMAIL}?subject=${encodeURIComponent('Zapytanie o ofertę: ' + u.title)}">✉ ${EMAIL}</a>
  </div>

  ${related.length ? `<h2>Podobne oferty w dzielnicy ${txt(u.district)}</h2>
  <div class="rel">${related.map(r => `<a href="${esc(r.slug)}.html"><div class="rt">${txt(r.title)}</div><div class="rm">${txt(r.district)}${r.price ? ` · ${r.price} zł/mies.` : ''}</div></a>`).join('')}</div>` : ''}
  ${other.length ? `<h2>Inne wolne pokoje w Warszawie</h2>
  <div class="rel">${other.map(r => `<a href="${esc(r.slug)}.html"><div class="rt">${txt(r.title)}</div><div class="rm">${txt(r.district)}${r.price ? ` · ${r.price} zł/mies.` : ''}</div></a>`).join('')}</div>` : ''}

  <p><a href="../oferty.html">← Zobacz wszystkie oferty pokoi i mieszkań w Warszawie</a></p>
  <p style="font-size:.8rem">Stan oferty na ${fmtDatePL(TODAY)}.</p>
</div>
<footer>
  KaZem Mieszkania · Katarzyna Zemlik · Warszawa ·
  <a href="tel:${PHONE_RAW}">${PHONE_TXT}</a> ·
  <a href="mailto:${EMAIL}">${EMAIL}</a>
</footer>
</body>
</html>
`;
}

/* ═════════════════════════════════════════════════════════════ SITEMAP / LLMS */

function buildSitemap(units) {
  const staticPages = [
    { loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE}/oferty.html`, changefreq: 'daily', priority: '0.9' },
  ];
  const offerPages = units.filter(u => u.indexable).map(u => ({
    loc: u.url, changefreq: 'weekly', priority: u.status === 'available' ? '0.8' : '0.6',
  }));
  const all = [...staticPages, ...offerPages];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

function buildLlmsSection(units) {
  const listed = units.filter(u => u.indexable);
  const lines = listed.map(u => {
    const bits = [
      `- [${u.title} — ${u.district}, Warszawa](${u.url})`,
      u.price ? `${u.price} zł/mies.` : null,
      u.area ? `${u.area} m²` : null,
      u.street || null,
      u.status === 'available' ? 'dostępne od zaraz' : `dostępne od ${fmtDatePL(u.dateFrom)}`,
      u.deposit ? `kaucja ${u.deposit} zł` : null,
      u.features.length ? u.features.join(', ') : null,
    ].filter(Boolean);
    return `${bits[0]}: ${bits.slice(1).join('; ')}.`;
  });

  const byD = {};
  for (const u of listed) (byD[u.district] ||= []).push(u);

  return `## Aktualne oferty (stan na ${TODAY})

Liczba wolnych i wkrótce wolnych jednostek: ${listed.length}.
Dzielnice: ${Object.entries(byD).map(([d, l]) => `${d} (${l.length})`).join(', ')}.

${lines.join('\n')}

Pełna lista z filtrami i mapą: ${SITE}/oferty.html
Kontakt w sprawie wynajmu: ${PHONE_TXT}, ${EMAIL}. Odpowiedź w ciągu 24 godzin.
Najemca nie płaci prowizji — mieszkaniami zarządza bezpośrednio KaZem Mieszkania.
`;
}

/* ═══════════════════════════════════════════════════════ PODMIANA MIĘDZY ZNACZNIKAMI */

function replaceBetween(source, marker, replacement, file) {
  const start = `<!-- KZ-SEO:${marker}:START`;
  const end = `<!-- KZ-SEO:${marker}:END -->`;
  const si = source.indexOf(start);
  const ei = source.indexOf(end);
  if (si === -1 || ei === -1) {
    throw new Error(`Brak znacznika KZ-SEO:${marker} w ${file}. ` +
      `Przywróć znaczniki <!-- KZ-SEO:${marker}:START --> ... <!-- KZ-SEO:${marker}:END -->`);
  }
  const startLineEnd = source.indexOf('-->', si) + 3;
  return source.slice(0, startLineEnd) + '\n' + replacement + '\n' + source.slice(ei);
}

/* ═══════════════════════════════════════════════════════════════════════ MAIN */

async function main() {
  console.log('[KaZem SEO] Pobieram oferty z Supabase…');
  const offers = await fetchOffers();
  console.log(`[KaZem SEO] Ofert w bazie: ${offers.length}`);

  const slugMap = existsSync(SLUGS_FILE) ? JSON.parse(readFileSync(SLUGS_FILE, 'utf8')) : {};
  const units = expandUnits(offers, slugMap);
  writeFileSync(SLUGS_FILE, JSON.stringify(slugMap, null, 2) + '\n');

  const counts = {
    available: units.filter(u => u.status === 'available').length,
    soon: units.filter(u => u.status === 'soon').length,
    all: units.length,
  };
  console.log(`[KaZem SEO] Jednostek: ${counts.all} (dostępne ${counts.available}, wkrótce ${counts.soon})`);

  /* ── oferty.html ── */
  const ofertyPath = join(ROOT, 'oferty.html');
  let html = readFileSync(ofertyPath, 'utf8');

  html = replaceBetween(html, 'GRID', buildGridHTML(units), 'oferty.html');
  html = replaceBetween(html, 'TEXT', buildTextSection(units), 'oferty.html');
  html = replaceBetween(html, 'JSONLD',
    `<script type="application/ld+json">\n${buildJsonLd(units)}\n</script>`, 'oferty.html');

  // liczniki w hero — żeby robot widział prawdziwe liczby, nie zera
  html = html.replace(/(id="cntAv"[^>]*>)[^<]*(<)/, `$1${counts.available}$2`);
  html = html.replace(/(id="cntSo"[^>]*>)[^<]*(<)/, `$1${counts.soon}$2`);
  html = html.replace(/(id="cntAll"[^>]*>)[^<]*(<)/, `$1${counts.all}$2`);

  writeFileSync(ofertyPath, html);
  console.log('[KaZem SEO] oferty.html — zaktualizowane');

  /* ── podstrony ofert ── */
  if (!existsSync(OFFER_DIR)) mkdirSync(OFFER_DIR, { recursive: true });
  const wanted = new Set(units.map(u => `${u.slug}.html`));
  for (const u of units) writeFileSync(join(OFFER_DIR, `${u.slug}.html`), offerPage(u, units));
  // sprzątanie po ofertach usuniętych z bazy
  for (const f of readdirSync(OFFER_DIR)) {
    if (f.endsWith('.html') && !wanted.has(f)) { unlinkSync(join(OFFER_DIR, f)); console.log(`[KaZem SEO] usunięto nieaktualne: oferta/${f}`); }
  }
  console.log(`[KaZem SEO] Podstron ofert: ${units.length}`);

  /* ── sitemap ── */
  writeFileSync(join(ROOT, 'sitemap.xml'), buildSitemap(units));
  console.log('[KaZem SEO] sitemap.xml — przeliczona');

  /* ── llms.txt ── */
  const llmsPath = join(ROOT, 'llms.txt');
  let llms = readFileSync(llmsPath, 'utf8');
  const MARK = '<!-- KZ-SEO:OFFERS:START -->';
  const MARK_END = '<!-- KZ-SEO:OFFERS:END -->';
  const section = `${MARK}\n${buildLlmsSection(units)}${MARK_END}`;
  if (llms.includes(MARK) && llms.includes(MARK_END)) {
    llms = llms.slice(0, llms.indexOf(MARK)) + section + llms.slice(llms.indexOf(MARK_END) + MARK_END.length);
  } else {
    llms = llms.trimEnd() + '\n\n' + section + '\n';
  }
  writeFileSync(llmsPath, llms);
  console.log('[KaZem SEO] llms.txt — odświeżony');

  console.log('[KaZem SEO] Gotowe.');
}

main().catch(err => { console.error('[KaZem SEO] BŁĄD:', err.message); process.exit(1); });
