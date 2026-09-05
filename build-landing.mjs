#!/usr/bin/env node
/**
 * build-landing.mjs — strony dla WŁAŚCICIELI mieszkań (nie dla najemców)
 * ---------------------------------------------------------------------------
 * Generuje:
 *   - zarzadzanie-najmem-<dzielnica>.html   (6 stron dzielnicowych)
 *   - ile-kosztuje-zarzadzanie-najmem-warszawa.html
 *
 * ZASADA, KTÓREJ NIE WOLNO ZŁAMAĆ:
 *   Te strony celują wyłącznie we frazy właścicielskie — „zarządzanie najmem
 *   <dzielnica>", „obsługa najmu", „zarządca mieszkania". NIGDY w „pokój do
 *   wynajęcia" ani „mieszkanie do wynajęcia <dzielnica>", bo tamte frazy
 *   obsługuje oferty.html i podstrony ofert. Dwie własne strony walczące
 *   o to samo hasło osłabiają się nawzajem (kanibalizacja).
 *
 * Uruchomienie: node build-landing.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://kazemmieszkania.pl';
const PHONE_RAW = '+48723168200';
const PHONE_TXT = '+48 723 168 200';
const EMAIL = 'kasia@kazemmieszkania.pl';
const PROWIZJA = 'od 7,5% do 12,5% miesięcznego czynszu';
const KOSZTY_URL = 'ile-kosztuje-zarzadzanie-najmem-warszawa.html';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function jsonLd(o) { return JSON.stringify(o, null, 2).replace(/<\//g, '<\\/'); }

/* ════════════════════════════════════════════════════ TREŚĆ — DZIELNICE ════ */
/* Każda dzielnica ma własny, prawdziwy kontekst rynkowy. Sześć niemal
   identycznych stron Google traktuje jak strony przemiałowe i przestaje je
   pokazywać — dlatego różnią się treścią, a nie tylko nazwą w nagłówku. */

const DZIELNICE = [
  {
    slug: 'mokotow',
    nazwa: 'Mokotów',
    w: 'na Mokotowie',
    dokad: 'na Mokotów',
    lead: 'Mokotów to największa mieszkaniowa dzielnica Warszawy i miejsce, w którym KaZem Mieszkania zarządza dziś największą liczbą lokali — między innymi przy Blacharskiej, Madalińskiego, Rzymowskiego i Puławskiej.',
    rynek: [
      'Najem na Mokotowie ma dwa oblicza. Od strony Pola Mokotowskiego i alei Niepodległości pracuje popyt studencki — Szkoła Główna Handlowa jest tu na miejscu, a dojazd na Politechnikę czy Uniwersytet zajmuje kwadrans metrem. Od strony Domaniewskiej i Wołoskiej mieszkania wynajmują pracownicy biurowców Służewca.',
      'Dla właściciela oznacza to komfortową sytuację: mieszkanie da się wynająć albo na pokoje studentom, albo w całości osobie pracującej, zależnie od tego, co bardziej opłaca się w danym roku. Ta elastyczność jest realną przewagą Mokotowa nad dzielnicami z jednym typem najemcy.',
      'Metro linii M1 przechodzi przez dzielnicę na całej długości — Pole Mokotowskie, Racławicka, Wierzbno, Wilanowska. Mieszkania w zasięgu spaceru od stacji wynajmują się szybciej i drożej, i to jest pierwsza rzecz, którą sprawdzam, wyceniając czynsz.',
    ],
    faq: [
      ['Ile mieszkań na Mokotowie ma KaZem w zarządzaniu?',
        'Mokotów jest dziś dzielnicą, w której zarządzam największą liczbą lokali — mieszkania przy Blacharskiej, Madalińskiego, Rzymowskiego i Puławskiej. Aktualne oferty najmu z tych adresów widać na stronie z ofertami.'],
      ['Czy opłaca się wynajmować mieszkanie na Mokotowie na pokoje?',
        'Zwykle tak, jeśli mieszkanie ma trzy pokoje lub więcej i leży w zasięgu metra albo tramwaju w stronę uczelni. Najem na pokoje daje wyższy łączny czynsz, ale wymaga rotacji najemców i obsługi kilku umów zamiast jednej — to właśnie przejmuję.'],
      ['Jak długo trwa znalezienie najemcy na Mokotowie?',
        'W sezonie, czyli od czerwca do końca września, pokój studencki schodzi zwykle w kilka do kilkunastu dni. Poza sezonem trwa to dłużej i wtedy częściej opłaca się wynająć mieszkanie w całości.'],
    ],
  },
  {
    slug: 'ochota',
    nazwa: 'Ochota',
    w: 'na Ochocie',
    dokad: 'na Ochotę',
    lead: 'Ochota to dzielnica o najbardziej przewidywalnym popycie na najem w całej Warszawie — decyduje o tym kampus przy Banacha.',
    rynek: [
      'Przy Banacha mieści się kampus Ochota Uniwersytetu Warszawskiego oraz Warszawski Uniwersytet Medyczny. To oznacza kilka tysięcy studentów kierunków, na których nie da się studiować zaocznie i zdalnie — medycyny, farmacji, fizyki, chemii, informatyki. Ci najemcy szukają mieszkania na cały rok akademicki, nie na semestr, i rzadko zmieniają adres w trakcie studiów.',
      'Dla właściciela to najniższa rotacja spośród najmu studenckiego w Warszawie. Umowa podpisana we wrześniu zwykle dotrwa do czerwca bez przerw w płatnościach, a część najemców zostaje na kolejny rok.',
      'Ochota nie ma metra, ale ma gęstą siatkę tramwajów i Dworzec Zachodni, więc dojazd w inne rejony miasta nie jest problemem. Czynsze są tu niższe niż w Śródmieściu przy porównywalnym popycie — to dobra dzielnica dla właściciela, który liczy stopę zwrotu, a nie prestiż adresu.',
    ],
    faq: [
      ['Dlaczego najem na Ochocie jest stabilniejszy niż w innych dzielnicach?',
        'Bo popyt napędza kampus przy Banacha — Uniwersytet Warszawski i Warszawski Uniwersytet Medyczny. Studenci medycyny i kierunków ścisłych mają zajęcia stacjonarne przez cały rok akademicki i nie przeprowadzają się w trakcie studiów.'],
      ['Czy na Ochocie opłaca się najem studencki, czy dla pracujących?',
        'Blisko Banacha zdecydowanie studencki — popyt jest tam większy i pewniejszy. W dalszych rejonach Ochoty, bliżej Dworca Zachodniego, sensowniej wynajmuje się mieszkanie w całości.'],
      ['Czy prowadzicie mieszkania na Ochocie?',
        'Ochota jest jedną z dzielnic, w których działam. Jeśli masz tu mieszkanie i chcesz je oddać w zarządzanie, umówimy oględziny i wycenę czynszu.'],
    ],
  },
  {
    slug: 'zoliborz',
    nazwa: 'Żoliborz',
    w: 'na Żoliborzu',
    dokad: 'na Żoliborz',
    lead: 'Żoliborz wynajmuje się inaczej niż reszta Warszawy — wolniej, drożej i na dłużej. Dla właściciela, któremu zależy na spokoju, to zaleta.',
    rynek: [
      'To dzielnica kameralna i dobrze skomunikowana — metro M1 zatrzymuje się na Placu Wilsona, Marymoncie i Słodowcu, a do centrum jedzie się kilkanaście minut. Najemcy to tu częściej młode pary i osoby pracujące niż studenci.',
      'Konsekwencja jest prosta: mieszkania na Żoliborzu wynajmują się nieco dłużej, ale umowy są dłuższe, rotacja niższa, a mieszkanie oddawane w lepszym stanie. Właściciel rzadziej ma do czynienia z przeprowadzkami i odświeżaniem lokalu między najemcami.',
      'Znaczna część zasobu to przedwojenne kamienice i budynki spółdzielcze z lat pięćdziesiątych. Ładne, ale wymagające czujniejszej obsługi technicznej — stara instalacja potrafi dać o sobie znać w najgorszym momencie. To akurat obszar, w którym zarządca zarabia na siebie najszybciej.',
    ],
    faq: [
      ['Czy na Żoliborzu opłaca się najem studencki?',
        'Rzadziej niż w innych dzielnicach. Na Żoliborzu nie ma dużych uczelni, a najemcy to głównie osoby pracujące i pary. Zwykle korzystniej wynająć mieszkanie w całości na dłuższą umowę.'],
      ['Mieszkanie jest w starej kamienicy — czy to problem?',
        'Nie, ale wymaga uważniejszej obsługi technicznej. Stare instalacje awaryjne są najczęstszą przyczyną konfliktu z najemcą, gdy właściciel nie reaguje szybko. Usterki obsługuję w ciągu 24 godzin, korzystając ze sprawdzonych fachowców.'],
      ['Jak długo szuka się najemcy na Żoliborzu?',
        'Dłużej niż na Mokotowie czy Ochocie, bo popyt jest mniejszy i mniej sezonowy. W zamian umowy są dłuższe, a najemcy stabilniejsi.'],
    ],
  },
  {
    slug: 'ursynow',
    nazwa: 'Ursynów',
    w: 'na Ursynowie',
    dokad: 'na Ursynów',
    lead: 'Ursynów ma dwie rzeczy, których nie ma większość Warszawy: metro na całej długości dzielnicy i własny kampus uniwersytecki.',
    rynek: [
      'Szkoła Główna Gospodarstwa Wiejskiego przy Nowoursynowskiej to kilkanaście tysięcy studentów, z których duża część szuka pokoju w promieniu kilku przystanków od uczelni. Linia metra M1 — Stokłosy, Imielin, Natolin, Kabaty — sprawia, że praktycznie każdy adres na Ursynowie jest w rozsądnym zasięgu.',
      'Zasób mieszkaniowy to głównie duże osiedla z lat siedemdziesiątych i osiemdziesiątych: powtarzalne układy, sensowne metraże, przewidywalne koszty utrzymania. Dla właściciela to komfort — łatwo wycenić czynsz, bo w tym samym budynku wynajmuje się kilkanaście podobnych mieszkań.',
      'Ursynów jest też dzielnicą rodzinną, więc obok najmu studenckiego istnieje stały popyt na mieszkania dwu- i trzypokojowe wynajmowane w całości. To daje właścicielowi wyjście awaryjne, gdy najem na pokoje przestaje się spinać.',
    ],
    faq: [
      ['Czy warto wynajmować mieszkanie na Ursynowie studentom SGGW?',
        'Tak, zwłaszcza mieszkania trzy- i czteropokojowe w zasięgu metra M1 lub autobusu na Nowoursynowską. Popyt jest stały przez cały rok akademicki.'],
      ['Czy odległość od centrum obniża czynsz na Ursynowie?',
        'Mniej, niż mogłoby się wydawać. Metro M1 dojeżdża do Śródmieścia w około dwadzieścia minut, więc najemcy traktują Ursynów jak dobrze skomunikowaną dzielnicę, a nie peryferie.'],
      ['Zarządzacie mieszkaniami w wielkiej płycie?',
        'Tak. Powtarzalne układy z osiedli ursynowskich są w obsłudze prostsze niż kamienice — koszty utrzymania są przewidywalne, a wycena czynszu opiera się na realnych transakcjach z tego samego budynku.'],
    ],
  },
  {
    slug: 'wola',
    nazwa: 'Wola',
    w: 'na Woli',
    dokad: 'na Wolę',
    lead: 'Wola jest dziś biznesowym centrum Warszawy i najemcy odzwierciedlają tę zmianę — to głównie ludzie, którzy pracują kilkaset metrów od wynajmowanego mieszkania.',
    rynek: [
      'Wieżowce przy Rondzie Daszyńskiego i Towarowej ściągnęły na Wolę dziesiątki tysięcy miejsc pracy, a metro M2 — Rondo Daszyńskiego, Płocka, Młynów, Księcia Janusza — domknęło skomunikowanie dzielnicy. Najemca na Woli to najczęściej osoba pracująca, często obcokrajowiec, gotowa zapłacić więcej za adres blisko biura.',
      'Dla właściciela oznacza to wyższe czynsze niż w dzielnicach studenckich, ale też inny rytm najmu. Umowy bywają krótsze i związane z kontraktem w pracy, a najemcy zmieniają się częściej. Mieszkanie musi być gotowe do wejścia od zaraz, w pełni umeblowane i bez usterek — inaczej przegrywa z ofertą obok.',
      'KaZem Mieszkania prowadzi tu między innymi mieszkanie przy Jana Kazimierza. Wola dobrze znosi zarówno najem w całości, jak i wynajem na pokoje młodym pracującym, którzy dzielą mieszkanie z powodu wysokich stawek.',
    ],
    faq: [
      ['Czy na Woli lepiej wynająć mieszkanie w całości, czy na pokoje?',
        'Blisko Ronda Daszyńskiego zwykle w całości osobie pracującej — stawki są wysokie, a najemca korporacyjny bywa stabilniejszy. Dalej od centrum biznesowego najem na pokoje potrafi dać wyższy łączny czynsz.'],
      ['Czy obsługujecie najemców obcojęzycznych?',
        'Tak. Strona KaZem Mieszkania działa po polsku, angielsku i ukraińsku, a umowy i kontakt z najemcą prowadzę w języku, w którym się rozumiemy.'],
      ['Czynsze na Woli są wyższe — czy prowizja też?',
        `Prowizja to ${PROWIZJA}, więc procentowo jest taka sama niezależnie od dzielnicy. Widełki zależą od zakresu obsługi i liczby lokali, nie od adresu.`],
    ],
  },
  {
    slug: 'srodmiescie',
    nazwa: 'Śródmieście',
    w: 'w Śródmieściu',
    dokad: 'do Śródmieścia',
    lead: 'Śródmieście wynajmuje się najszybciej i najdrożej w Warszawie. Płaci się za to obsługą — to również dzielnica, w której najwięcej rzeczy może pójść nie tak.',
    rynek: [
      'Politechnika Warszawska i Uniwersytet Warszawski leżą w granicach dzielnicy, więc popyt studencki jest tu najsilniejszy w mieście, a do tego dochodzą osoby pracujące, które nie chcą dojeżdżać. Mieszkanie w rozsądnym stanie i cenie znajduje najemcę w kilka dni.',
      'Druga strona medalu to zasób. Duża część mieszkań w Śródmieściu to przedwojenne kamienice i budynki z lat pięćdziesiątych, gdzie awaria instalacji, wspólnota o własnym zdaniu i hałas z ulicy są częścią codzienności. Właściciel, który mieszka w innym mieście, dowiaduje się o problemie zwykle za późno.',
      'Dlatego w Śródmieściu zarządca ma najbardziej wymierną wartość. Nie chodzi o znalezienie najemcy, bo to akurat idzie samo, tylko o utrzymanie najmu bez przerw i o to, żeby drobna usterka nie zamieniła się w wypowiedzenie umowy.',
    ],
    faq: [
      ['Skoro w Śródmieściu mieszkanie wynajmuje się samo, po co zarządca?',
        'Bo trudność nie leży w znalezieniu najemcy, tylko w utrzymaniu najmu. Stare instalacje, wspólnoty i rotacja studencka generują sprawy, które trzeba obsłużyć na miejscu i szybko. Na usterki reaguję w ciągu 24 godzin.'],
      ['Czy mieszkanie w kamienicy nadaje się na najem studencki?',
        'Zwykle tak i często jest to najlepszy sposób wykorzystania dużego metrażu z wysokimi sufitami. Wymaga jednak sensownego podziału na pokoje i osobnych umów — to przejmuję razem z rotacją najemców.'],
      ['Jakie czynsze osiąga się w Śródmieściu?',
        'Najwyższe w Warszawie, ale rozstrzał jest duży i zależy od stanu mieszkania oraz konkretnego adresu. Wycenę robię na podstawie realnych transakcji z sąsiedztwa, a nie stawek ogłoszeniowych.'],
    ],
  },
];

/* ═══════════════════════════════════════════════════════ WSPÓLNY SZKIELET ══ */

const CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--cream:#FAF7F0;--dark:#171512;--accent:#A8432C;--muted:#5C564D;--white:#fff;--border:#DDD5C7}
body{font-family:'Instrument Sans',system-ui,sans-serif;background:var(--cream);color:var(--dark);line-height:1.6}
a{color:var(--accent)}
nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:var(--white);border-bottom:1px solid var(--border);flex-wrap:wrap;gap:.5rem}
.logo{font-family:'Bricolage Grotesque',sans-serif;font-size:1.25rem;font-weight:700;color:var(--dark);text-decoration:none}
.logo span{color:var(--accent)}
.nav-cta{background:var(--dark);color:#fff;padding:.5rem 1.2rem;border-radius:100px;font-size:.85rem;text-decoration:none}
.wrap{max-width:820px;margin:0 auto;padding:1.5rem 2rem 4rem}
.crumbs{font-size:.8rem;color:var(--muted);margin-bottom:1.2rem}
.crumbs a{color:var(--muted)}
h1{font-family:'Bricolage Grotesque',sans-serif;font-size:2.15rem;line-height:1.14;margin-bottom:.8rem}
.lead{font-size:1.08rem;color:var(--dark);margin-bottom:1.6rem}
h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.4rem;margin:2.2rem 0 .7rem}
h3{font-family:'Bricolage Grotesque',sans-serif;font-size:1.03rem;margin:1.4rem 0 .35rem}
p{margin-bottom:.95rem;color:var(--muted)}
ul,ol{margin:0 0 1rem 1.2rem;color:var(--muted)}
li{margin-bottom:.35rem}
.box{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:1.3rem 1.5rem;margin:1.6rem 0}
.box p:last-child,.box ul:last-child{margin-bottom:0}
.price{font-family:'Bricolage Grotesque',sans-serif;font-size:1.9rem;font-weight:700;color:var(--accent);line-height:1.2;margin-bottom:.3rem}
table{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin:1.4rem 0}
th,td{text-align:left;padding:.7rem 1rem;border-bottom:1px solid var(--border);font-size:.92rem}
tr:last-child th,tr:last-child td{border-bottom:none}
thead th{background:#F3EDE2;font-weight:600}
.cta{background:var(--dark);color:#fff;border-radius:16px;padding:1.6rem;margin:2.4rem 0}
.cta h2{color:#fff;margin-top:0}
.cta p{color:rgba(255,255,255,.7)}
.cta a{display:inline-block;background:var(--accent);color:#fff;padding:.7rem 1.5rem;border-radius:100px;text-decoration:none;font-weight:600;margin-right:.5rem;margin-top:.4rem}
.links{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0 2rem;list-style:none}
.links li{margin:0}
.links a{display:inline-block;padding:.4rem 1rem;border:1px solid var(--border);border-radius:100px;background:var(--white);font-size:.85rem;text-decoration:none;color:var(--dark)}
.links a:hover{border-color:var(--accent);color:var(--accent)}
footer{background:var(--dark);color:rgba(255,255,255,.6);padding:2rem;font-size:.85rem;text-align:center}
footer a{color:#fff}
@media(max-width:700px){.wrap{padding:1.2rem 1.2rem 3rem}h1{font-size:1.65rem}nav{padding:.9rem 1.2rem}}`;

function page({ file, title, desc, crumbTail, h1, body, graph }) {
  // Uwaga: wynik musi być deterministyczny (bez daty), żeby cykliczny przebieg
  // workflow nie generował commitu przy każdym uruchomieniu.
  return `<!-- Strona generowana przez build-landing.mjs — NIE EDYTUJ RĘCZNIE, zmieniaj treść w build-landing.mjs -->
<!DOCTYPE html>
<html lang="pl">
<head>
<script src="cookie-consent.js"><\/script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}/${file}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:type" content="article">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="KaZem Mieszkania">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}/${file}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
<script type="application/ld+json">
${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}
<\/script>
</head>
<body>
<nav>
  <a href="index.html" class="logo">Ka<span>Zem</span> Mieszkania</a>
  <a href="index.html#kontakt" class="nav-cta">Kontakt</a>
</nav>
<div class="wrap">
  <div class="crumbs"><a href="index.html">Strona główna</a> › ${esc(crumbTail)}</div>
  <h1>${h1}</h1>
${body}
  <div class="cta">
    <h2>Porozmawiajmy o Twoim mieszkaniu</h2>
    <p>Oględziny i wycena czynszu są bezpłatne i do niczego nie zobowiązują. Odpowiadam w ciągu 24 godzin.</p>
    <a href="tel:${PHONE_RAW}">📞 ${PHONE_TXT}</a>
    <a href="mailto:${EMAIL}">✉ ${EMAIL}</a>
  </div>
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

const ORG = {
  '@type': 'RealEstateAgent',
  '@id': `${SITE}/#organizacja`,
  name: 'KaZem Mieszkania',
  url: SITE,
  telephone: PHONE_RAW,
  email: EMAIL,
  founder: { '@type': 'Person', name: 'Katarzyna Zemlik' },
  address: { '@type': 'PostalAddress', addressLocality: 'Warszawa', addressRegion: 'Mazowieckie', addressCountry: 'PL' },
  areaServed: { '@type': 'City', name: 'Warszawa' },
};

function faqNode(id, pairs) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: pairs.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/* ═════════════════════════════════════════════════ STRONY DZIELNICOWE ══════ */

function districtPage(d, all) {
  const file = `zarzadzanie-najmem-${d.slug}.html`;
  const title = `Zarządzanie najmem ${d.nazwa} — obsługa mieszkań na wynajem | KaZem`;
  const desc = `Zarządzanie najmem mieszkań ${d.w}, Warszawa. Umowy podpisywane w imieniu właściciela, reakcja na usterki w 24 h, prowizja ${PROWIZJA}. Katarzyna Zemlik, KaZem Mieszkania.`;
  const inne = all.filter(x => x.slug !== d.slug);

  const body = `  <p class="lead">${esc(d.lead)}</p>

  <h2>Rynek najmu ${d.w} — co warto wiedzieć jako właściciel</h2>
${d.rynek.map(p => `  <p>${esc(p)}</p>`).join('\n')}

  <h2>Co obejmuje zarządzanie najmem ${d.w}</h2>
  <ul>
    <li><strong>Wycena czynszu</strong> na podstawie realnych transakcji z okolicy, nie stawek z ogłoszeń.</li>
    <li><strong>Przygotowanie i publikacja oferty</strong>, w razie potrzeby po homestagingu i sesji zdjęciowej.</li>
    <li><strong>Weryfikacja najemców</strong> — dokumenty, referencje, historia najmu przed podpisaniem umowy.</li>
    <li><strong>Podpisanie umowy w Twoim imieniu</strong> na podstawie pełnomocnictwa — nie musisz przyjeżdżać ${d.dokad}.</li>
    <li><strong>Obsługa usterek w ciągu 24 godzin</strong> przez sprawdzonych fachowców, z nadzorem nad jakością naprawy.</li>
    <li><strong>Rozliczenia i pilnowanie terminów</strong> — czynsz, media, aneksy, koniec umowy.</li>
    <li><strong>Rotacja najemców</strong> między latami akademickimi, jeśli mieszkanie jest wynajmowane na pokoje.</li>
  </ul>

  <div class="box">
    <div class="price">${PROWIZJA}</div>
    <p>Wynagrodzenie zależy od zakresu obsługi i liczby lokali, nie od dzielnicy. Bez ukrytych kosztów i bez opłat wstępnych — <a href="${KOSZTY_URL}">zobacz, co przesuwa stawkę w widełkach</a>.</p>
  </div>

  <h2>Nie musisz być w Warszawie</h2>
  <p>Działam na podstawie pełnomocnictwa właściciela. Podpisuję umowy najmu, aneksy i protokoły zdawczo-odbiorcze w Twoim imieniu, więc mieszkanie ${d.w} może pracować, gdy Ty mieszkasz w innym mieście albo za granicą. Dostajesz raporty ze stanu lokalu i czynsz na konto.</p>

  <h2>Najczęstsze pytania — najem ${d.w}</h2>
${d.faq.map(([q, a]) => `  <h3>${esc(q)}</h3>\n  <p>${esc(a)}</p>`).join('\n')}

  <h2>Zarządzanie najmem w innych dzielnicach</h2>
  <ul class="links">
${inne.map(x => `    <li><a href="zarzadzanie-najmem-${x.slug}.html">${esc(x.nazwa)}</a></li>`).join('\n')}
    <li><a href="${KOSZTY_URL}">Ile to kosztuje</a></li>
  </ul>

  <p style="font-size:.85rem">Szukasz mieszkania lub pokoju dla siebie, a nie zarządcy? <a href="oferty.html">Zobacz aktualne oferty najmu</a>.</p>`;

  const graph = [
    ORG,
    {
      '@type': 'Service',
      '@id': `${SITE}/${file}#usluga`,
      name: `Zarządzanie najmem ${d.nazwa}`,
      serviceType: 'Zarządzanie najmem nieruchomości',
      description: `Kompleksowa obsługa mieszkań na wynajem ${d.w} w Warszawie: wycena czynszu, weryfikacja najemców, umowy podpisywane w imieniu właściciela, obsługa usterek w 24 h, rozliczenia.`,
      provider: { '@id': `${SITE}/#organizacja` },
      areaServed: { '@type': 'Place', name: `${d.nazwa}, Warszawa` },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PLN',
        description: `Prowizja ${PROWIZJA}, ustalana indywidualnie w zależności od zakresu obsługi i liczby lokali.`,
      },
    },
    faqNode(`${SITE}/${file}#faq`, d.faq),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Strona główna', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: `Zarządzanie najmem ${d.nazwa}`, item: `${SITE}/${file}` },
      ],
    },
  ];

  return { file, html: page({
    file, title, desc,
    crumbTail: `Zarządzanie najmem ${d.nazwa}`,
    h1: `Zarządzanie najmem — ${esc(d.nazwa)}, Warszawa`,
    body, graph,
  }) };
}

/* ═══════════════════════════════════════════════════════ STRONA O KOSZTACH ══ */

function costPage(all) {
  const file = KOSZTY_URL;
  const title = 'Ile kosztuje zarządzanie najmem w Warszawie? Konkretne widełki | KaZem';
  const desc = `Prowizja za zarządzanie najmem mieszkania w Warszawie to ${PROWIZJA}. Co przesuwa stawkę w widełkach, co jest w cenie i kiedy zarządca się opłaca — bez ukrytych kosztów.`;

  const faq = [
    ['Ile kosztuje zarządzanie najmem mieszkania w Warszawie?',
      `W KaZem Mieszkania prowizja wynosi ${PROWIZJA}. Stawka zależy od zakresu obsługi, liczby lokali i tego, czy mieszkanie jest wynajmowane w całości, czy na pokoje. Nie ma opłat wstępnych ani ukrytych kosztów.`],
    ['Od czego zależy, czy zapłacę 7,5%, czy 12,5%?',
      'Głównie od pracochłonności. Jedno mieszkanie wynajęte w całości na dwuletnią umowę to dolna granica widełek. Mieszkanie podzielone na pięć pokoi z rotacją studentów co rok, osobnymi umowami i rozliczeniami to górna. Przy kilku lokalach oddanych w zarządzanie stawka spada.'],
    ['Czy prowizja jest liczona od czynszu z mediami, czy bez?',
      'Od czynszu najmu, bez mediów i opłat administracyjnych. Media są kosztem najemcy i nie stanowią podstawy wynagrodzenia zarządcy.'],
    ['Czy płacę prowizję, gdy mieszkanie stoi puste?',
      'Nie. Wynagrodzenie liczone jest od faktycznie otrzymanego czynszu, więc gdy mieszkanie nie jest wynajęte, nie ma podstawy do naliczenia prowizji. To ustawia moje interesy po tej samej stronie co Twoje.'],
    ['Czy są dodatkowe opłaty za znalezienie najemcy?',
      'Nie ma osobnej opłaty za znalezienie najemcy — to część obsługi. Osobno wyceniane są tylko usługi wykraczające poza zarządzanie, jak homestaging z sesją zdjęciową czy remont.'],
    ['Kiedy zarządca się nie opłaca?',
      'Gdy mieszkasz w Warszawie, masz jedno mieszkanie wynajęte na długą umowę spokojnemu najemcy i czas, żeby zająć się usterką w środku dnia. Wtedy prowizja jest kosztem bez pokrycia. Zarządca zaczyna się opłacać przy najmie na pokoje, przy kilku lokalach albo gdy mieszkasz poza Warszawą.'],
  ];

  const body = `  <p class="lead">Odpowiedź wprost, bez „zapytaj o wycenę": prowizja za zarządzanie najmem mieszkania w Warszawie wynosi w KaZem Mieszkania ${PROWIZJA}. Poniżej piszę, co przesuwa stawkę w tych widełkach i kiedy zarządca w ogóle ma sens.</p>

  <div class="box">
    <div class="price">7,5% – 12,5%</div>
    <p>miesięcznego czynszu najmu. Bez opłat wstępnych, bez opłaty za znalezienie najemcy, bez prowizji od pustostanu.</p>
  </div>

  <h2>Co przesuwa stawkę w widełkach</h2>
  <p>Różnica między dolną a górną granicą to niemal wyłącznie pracochłonność. Im więcej umów, rozliczeń i rotacji, tym wyżej w widełkach.</p>
  <table>
    <thead><tr><th>Sytuacja</th><th>Gdzie w widełkach</th></tr></thead>
    <tbody>
      <tr><td>Mieszkanie wynajęte w całości, długa umowa, stabilny najemca</td><td>bliżej 7,5%</td></tr>
      <tr><td>Kilka mieszkań oddanych w zarządzanie jednocześnie</td><td>bliżej 7,5%</td></tr>
      <tr><td>Mieszkanie w standardzie do wejścia, bez zaległych usterek</td><td>bliżej 7,5%</td></tr>
      <tr><td>Najem na pokoje, osobne umowy z każdym najemcą</td><td>bliżej 12,5%</td></tr>
      <tr><td>Coroczna rotacja studentów i rozliczenia mediów między najemcami</td><td>bliżej 12,5%</td></tr>
      <tr><td>Stara kamienica z awaryjną instalacją</td><td>bliżej 12,5%</td></tr>
    </tbody>
  </table>

  <h2>Ile to jest w złotówkach</h2>
  <p>Przy czynszu 3 000 zł miesięcznie prowizja wynosi od 225 zł do 375 zł. Przy 4 500 zł — od 337 zł do 562 zł. Przy mieszkaniu wynajętym na pięć pokoi po 1 500 zł, czyli 7 500 zł łącznie, prowizja mieści się między 562 zł a 937 zł miesięcznie.</p>
  <p>Warto zestawić to nie z zerem, tylko z realną alternatywą: miesiąc pustostanu kosztuje właściciela pełny czynsz, a nie jego dziesiątą część. Dwa zaoszczędzone tygodnie w roku zwykle pokrywają prowizję za kilka miesięcy.</p>

  <h2>Co jest w cenie</h2>
  <ul>
    <li>Wycena czynszu na podstawie realnych transakcji z okolicy.</li>
    <li>Przygotowanie oferty, publikacja i obsługa zapytań od najemców.</li>
    <li>Prezentacje mieszkania — bez Twojego udziału.</li>
    <li>Weryfikacja najemcy: dokumenty, referencje, historia najmu.</li>
    <li>Umowa i aneksy podpisywane w Twoim imieniu na podstawie pełnomocnictwa.</li>
    <li>Protokoły zdawczo-odbiorcze i spis liczników.</li>
    <li>Reakcja na usterki w ciągu 24 godzin i nadzór nad naprawą.</li>
    <li>Rozliczenia czynszu i mediów, pilnowanie terminów płatności.</li>
    <li>Raporty ze stanu mieszkania.</li>
  </ul>

  <h2>Co jest poza ceną</h2>
  <p>Osobno wyceniam tylko to, co nie jest zarządzaniem: homestaging z profesjonalną sesją zdjęciową oraz remonty i większe prace, które i tak wymagają Twojej decyzji o budżecie. Koszty napraw pokrywa właściciel — moim zadaniem jest znaleźć fachowca, dopilnować roboty i nie dopuścić do zawyżonej faktury.</p>

  <h2>Kiedy zarządca się opłaca, a kiedy nie</h2>
  <p>Nie każdemu. Jeśli mieszkasz w Warszawie, masz jedno mieszkanie wynajęte na trzy lata spokojnemu najemcy i możesz w środę o jedenastej wpuścić hydraulika — prowizja jest kosztem, za którym nie stoi realna praca. Powiem to wprost, zamiast namawiać.</p>
  <p>Zarządzanie zaczyna mieć sens, gdy pojawia się któryś z tych warunków: mieszkanie wynajmowane na pokoje, więcej niż jeden lokal, mieszkanie w starym budynku, albo właściciel poza Warszawą. Wtedy rachunek zwykle wychodzi na plus — nie dlatego, że prowizja jest niska, tylko dlatego, że pustostan i zaniedbana usterka kosztują znacznie więcej.</p>

  <h2>Najczęstsze pytania o koszty</h2>
${faq.map(([q, a]) => `  <h3>${esc(q)}</h3>\n  <p>${esc(a)}</p>`).join('\n')}

  <h2>Zarządzanie najmem według dzielnic</h2>
  <ul class="links">
${all.map(x => `    <li><a href="zarzadzanie-najmem-${x.slug}.html">${esc(x.nazwa)}</a></li>`).join('\n')}
  </ul>`;

  const graph = [
    ORG,
    {
      '@type': 'Service',
      '@id': `${SITE}/${file}#usluga`,
      name: 'Zarządzanie najmem mieszkań w Warszawie',
      serviceType: 'Zarządzanie najmem nieruchomości',
      description: `Kompleksowa obsługa mieszkań na wynajem w Warszawie. Prowizja ${PROWIZJA}, bez opłat wstępnych i bez prowizji od pustostanu.`,
      provider: { '@id': `${SITE}/#organizacja` },
      areaServed: { '@type': 'City', name: 'Warszawa' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PLN',
        description: `Prowizja ${PROWIZJA}, zależna od zakresu obsługi i liczby lokali.`,
      },
    },
    faqNode(`${SITE}/${file}#faq`, faq),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Strona główna', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Ile kosztuje zarządzanie najmem', item: `${SITE}/${file}` },
      ],
    },
  ];

  return { file, html: page({
    file, title, desc,
    crumbTail: 'Ile kosztuje zarządzanie najmem',
    h1: 'Ile kosztuje zarządzanie najmem mieszkania w Warszawie',
    body, graph,
  }) };
}

/* ═══════════════════════════════════════════════════════════════════ MAIN ══ */

const pages = [...DZIELNICE.map(d => districtPage(d, DZIELNICE)), costPage(DZIELNICE)];
for (const p of pages) {
  writeFileSync(join(ROOT, p.file), p.html);
  console.log(`[KaZem landing] ${p.file}`);
}
console.log(`[KaZem landing] Gotowe — ${pages.length} stron.`);
