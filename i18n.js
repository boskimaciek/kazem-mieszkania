// ═══════════════════════════════════════════════════════════════════════════
// KaZem Mieszkania — System tłumaczeń (PL / EN / UA)
// Użycie: <element data-i18n="klucz"> lub data-i18n-placeholder="klucz"
// Język zapisywany w localStorage['kazem_lang'] — trwa między stronami
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Słowniki ───────────────────────────────────────────────────────────────

  var TRANSLATIONS = {

    // ════════════════════════════════════════════════════════════════════════
    // WSPÓLNE — nawigacja, modal kontaktowy, stopka
    // ════════════════════════════════════════════════════════════════════════

    'nav.offers':      { pl: 'Oferty najmu ↗',       en: 'Listings ↗',           ua: 'Оголошення ↗' },
    'nav.services':    { pl: 'Usługi',                en: 'Services',             ua: 'Послуги' },
    'nav.about':       { pl: 'O mnie',                en: 'About',                ua: 'Про мене' },
    'nav.homestaging': { pl: 'Homestaging',           en: 'Home Staging',         ua: 'Хоумстейджинг' },
    'nav.contact':     { pl: 'Kontakt',               en: 'Contact',              ua: 'Контакт' },
    'nav.apartments':  { pl: 'Mieszkania',            en: 'Properties',           ua: 'Квартири' },
    'nav.back':        { pl: '← Strona główna',       en: '← Home',               ua: '← Головна' },
    'nav.manage':      { pl: '⚙ Zarządzaj',           en: '⚙ Manage',             ua: '⚙ Керувати' },
    'nav.logout':      { pl: 'Wyloguj',               en: 'Log out',              ua: 'Вийти' },
    'nav.range':       { pl: 'Zasięg',                en: 'Coverage',             ua: 'Зона охоплення' },

    'footer.copy':     { pl: 'Katarzyna Zemlik · Warszawa · © 2025', en: 'Katarzyna Zemlik · Warsaw · © 2025', ua: 'Катажина Землік · Варшава · © 2025' },

    // ════════════════════════════════════════════════════════════════════════
    // REDESIGN 2.0 — galeria + dostępność (dodane v2026-07-02)
    // ════════════════════════════════════════════════════════════════════════

    'gallery.title':   { pl: 'Mieszkania pod opieką',        en: 'Properties we manage',      ua: 'Нерухомість під нашою опікою' },
    'gallery.btn':     { pl: 'Zobacz oferty →',              en: 'View listings →',             ua: 'До оголошень →' },
    'gallery.l1':      { pl: 'Mokotów · pokój studencki',    en: 'Mokotów · student room',     ua: 'Мокотув · студентська кімната' },
    'gallery.l2':      { pl: 'Wola · mieszkanie 2-pok.',     en: 'Wola · 2-room apartment',    ua: 'Воля · 2-кімнатна квартира' },
    'gallery.l3':      { pl: 'Śródmieście · studio',         en: 'Śródmieście · studio',       ua: 'Середмістя · студія' },
    'gallery.l4':      { pl: 'Żoliborz · sypialnia',         en: 'Żoliborz · bedroom',          ua: 'Жолібож · спальня' },
    'gallery.l5':      { pl: 'Ursynów · salon',              en: 'Ursynów · living room',      ua: 'Урсинув · вітальня' },
    'a11y.skip':       { pl: 'Przejdź do treści',            en: 'Skip to content',            ua: 'Перейти до вмісту' },

    // ════════════════════════════════════════════════════════════════════════
    // OFERTY.HTML v2.0 — hero, mapa, filtry (dodane v2026-07-03)
    // ════════════════════════════════════════════════════════════════════════

    'of.hlabel':    { pl: 'Aktualne oferty · Warszawa', en: 'Available now · Warsaw', ua: 'Вільні зараз · Варшава' },
    'of.h1':        { pl: 'Pokoje i mieszkania<br>do wynajęcia w <em>Warszawie</em>', en: 'Rooms & apartments<br>for rent in <em>Warsaw</em>', ua: 'Кімнати та квартири<br>в оренду у <em>Варшаві</em>' },
    'of.sub':       { pl: 'Pokoje studenckie i mieszkania na wynajem w Warszawie — Mokotów, Wola, Śródmieście, Żoliborz i inne dzielnice. Wszystkie lokale zarządzane przez KaZem Mieszkania.', en: 'Student rooms and apartments across Warsaw — Mokotów, Wola, Śródmieście, Żoliborz and beyond. Every property is managed by KaZem Mieszkania.', ua: 'Студентські кімнати та квартири по всій Варшаві — Мокотув, Воля, Середмістя, Жолібож та інші райони. Кожен об’єкт під управлінням KaZem Mieszkania.' },
    'of.stat.av':   { pl: 'Dostępne',    en: 'Available',   ua: 'Доступні' },
    'of.stat.so':   { pl: 'Wkrótce',     en: 'Soon',        ua: 'Незабаром' },
    'of.stat.all':  { pl: 'Wszystkich',  en: 'Total',       ua: 'Усього' },
    'of.map.label': { pl: 'Mapa ofert',  en: 'Listings map', ua: 'Карта пропозицій' },
    'of.map.h2':    { pl: 'Znajdź ofertę na mapie', en: 'Find a listing on the map', ua: 'Знайдіть пропозицію на карті' },
    'of.map.p':     { pl: 'Najedź na kropkę aby zobaczyć szczegóły.<br>Kliknij aby przejść do oferty.', en: 'Hover a pin for a quick preview.<br>Click to see the full listing.', ua: 'Наведіть на мітку для швидкого перегляду.<br>Натисніть, щоб відкрити повний опис.' },
    'of.f.type':    { pl: 'Typ:',        en: 'Type:',       ua: 'Тип:' },
    'of.f.status':  { pl: 'Status:',     en: 'Status:',     ua: 'Статус:' },
    'of.f.all':     { pl: 'Wszystkie',   en: 'All',         ua: 'Усі' },
    'of.f.room':    { pl: '🛏 Pokój',    en: '🛏 Room',     ua: '🛏 Кімната' },
    'of.f.apt':     { pl: '🏠 Mieszkanie', en: '🏠 Apartment', ua: '🏠 Квартира' },
    'of.f.av':      { pl: 'Dostępne',    en: 'Available',   ua: 'Доступні' },
    'of.f.soon':    { pl: 'Wkrótce',     en: 'Soon',        ua: 'Незабаром' },
    'of.f.taken':   { pl: 'Zajęte',      en: 'Taken',       ua: 'Зайняті' },
    'of.details':   { pl: 'Szczegóły',   en: 'Details',     ua: 'Деталі' },
    'of.noresults': { pl: 'Brak ofert',  en: 'Nothing here yet', ua: 'Поки що нічого' },
    'of.results':   { pl: 'Wyników:',    en: 'Results:',    ua: 'Результатів:' },
    'of.type.room': { pl: 'Pokój',       en: 'Room',        ua: 'Кімната' },
    'of.type.apt':  { pl: 'Mieszkanie',  en: 'Apartment',   ua: 'Квартира' },

    // ════════════════════════════════════════════════════════════════════════
    // INDEX.HTML — strona główna (właściciele)
    // ════════════════════════════════════════════════════════════════════════

    // Quick facts (GEO — zwięzłe fakty, dodane v2026-08-31)
    'qf.title':   { pl: 'KaZem Mieszkania w skrócie', en: 'KaZem Mieszkania at a glance', ua: 'KaZem Mieszkania коротко' },
    'qf.li1.b':   { pl: 'Co robię:', en: 'What I do:', ua: 'Що я роблю:' },
    'qf.li1.p':   { pl: 'kompleksowe zarządzanie najmem mieszkań i pokoi studenckich w Warszawie — od podpisania umowy po obsługę techniczną.', en: 'full-service rental management for apartments and student rooms in Warsaw — from signing the lease to handling repairs.', ua: 'комплексне управління орендою квартир та студентських кімнат у Варшаві — від підписання договору до технічного обслуговування.' },
    'qf.li2.b':   { pl: 'Dla kogo:', en: "Who it's for:", ua: 'Для кого:' },
    'qf.li2.p':   { pl: 'właścicieli mieszkań, którzy nie chcą (lub nie mogą) zajmować się najmem osobiście — również mieszkających poza Warszawą lub za granicą.', en: "apartment owners who don't want to (or can't) handle the rental themselves — including those living outside Warsaw or abroad.", ua: 'власників квартир, які не хочуть (або не можуть) займатися орендою особисто — зокрема тих, хто живе поза Варшавою або за кордоном.' },
    'qf.li3.b':   { pl: 'Jak to działa:', en: 'How it works:', ua: 'Як це працює:' },
    'qf.li3.p':   { pl: 'działam na podstawie pełnomocnictwa właściciela — podpisuję umowy i aneksy w jego imieniu.', en: "I act under the owner's power of attorney — signing leases and annexes on their behalf.", ua: 'я дію на підставі довіреності власника — підписую договори та додатки від його імені.' },
    'qf.li4.b':   { pl: 'Gdzie:', en: 'Where:', ua: 'Де:' },
    'qf.li4.p':   { pl: 'Warszawa — głównie Mokotów, Ursynów, Wola, Ochota, Śródmieście i Żoliborz.', en: 'Warsaw — mainly Mokotów, Ursynów, Wola, Ochota, Śródmieście and Żoliborz.', ua: 'Варшава — переважно Мокотув, Урсинув, Воля, Охота, Середмістя та Жолібож.' },
    'qf.li5.b':   { pl: 'Reakcja na usterki:', en: 'Repair response time:', ua: 'Реакція на несправності:' },
    'qf.li5.p':   { pl: 'do 24 godzin.', en: 'within 24 hours.', ua: 'до 24 годин.' },
    'qf.li6.b':   { pl: 'Kontakt:', en: 'Contact:', ua: 'Контакт:' },
    'qf.li6.p':   { pl: 'telefon +48 723 168 200, e-mail kasia@kazemmieszkania.pl.', en: 'phone +48 723 168 200, email kasia@kazemmieszkania.pl.', ua: 'телефон +48 723 168 200, ел. пошта kasia@kazemmieszkania.pl.' },

    // Hero
    'hero.pill':       { pl: '★ Zarządzanie najmem · Warszawa', en: '★ Rental management · Warsaw', ua: '★ Управління орендою · Варшава' },
    'hero.h1.line1':   { pl: 'Twoje mieszkanie',    en: 'Your property',         ua: 'Ваша нерухомість' },
    'hero.h1.line2':   { pl: 'zarabia. Ja',         en: 'earns. I',              ua: 'працює. А я' },
    'hero.h1.em':      { pl: 'jestem na miejscu.',  en: 'handle the rest.',     ua: 'подбаю про все.' },
    'hero.sub':        { pl: 'Jestem Kasia — zajmuję się kompleksową obsługą mieszkań na wynajem w Warszawie. Podpisuję umowy, pilnuję ciągłości najmu, reaguję na usterki. Właściciel nie musi robić dosłownie nic.', en: "I'm Kasia. I take care of rental properties across Warsaw so their owners don't have to. I sign leases, keep apartments occupied, and deal with every issue that comes up — from a dripping tap to a tenant moving out. You sit back; I keep things running.", ua: 'Я Кася. Я керую орендною нерухомістю по всій Варшаві, щоб власники могли спати спокійно. Підписую договори, тримаю квартири заселеними, вирішую будь-які питання — від протікаючого крана до виїзду мешканця. Ви відпочиваєте — я працюю.' },
    'hero.kasia':      { pl: '— Katarzyna Zemlik, KaZem Mieszkania', en: '— Katarzyna Zemlik, KaZem Mieszkania', ua: '— Катажина Землік, KaZem Mieszkania' },
    'hero.cta1':       { pl: 'Umów bezpłatną konsultację →', en: 'Get a free consultation →', ua: 'Безкоштовна консультація →' },
    'hero.cta2':       { pl: 'Sprawdź co robię',    en: 'What I do',         ua: 'Що я роблю' },
    'hero.stat1.n':    { pl: 'Lata',                en: 'Years',                 ua: 'Роки' },
    'hero.stat1.l':    { pl: 'Doświadczenia na rynku', en: 'In the rental market', ua: 'На ринку оренди' },
    'hero.stat2.l':    { pl: 'Ciągłość najmu',      en: 'Occupancy rate',        ua: 'Заповнюваність' },
    'hero.stat3.l':    { pl: 'Czas reakcji',         en: 'Response time',        ua: 'Час реагування' },
    'hero.badge':      { pl: 'najem\nstudencki',     en: 'student\nrentals',       ua: 'студентська\nоренда' },

    // Trust bar
    'trust.1': { pl: 'Działam na podstawie pełnomocnictwa właściciela', en: 'I act under legal power of attorney', ua: 'Дію за нотаріальним дорученням' },
    'trust.2': { pl: 'Podpisuję umowy i aneksy w imieniu właściciela',  en: 'I sign leases and amendments on your behalf', ua: 'Підписую договори та додатки від вашого імені' },
    'trust.3': { pl: 'Specjalistka od najmu studenckiego',              en: 'Student rental specialist',                  ua: 'Експерт зі студентської оренди' },
    'trust.4': { pl: 'Obsługa techniczna i interwencje 24h',            en: 'On-call maintenance & 24 h response',         ua: 'Технічна підтримка та реагування 24/7' },

    // Mieszkania section
    'mzk.label':   { pl: 'Mieszkania pod opieką KaZem', en: 'Properties in KaZem’s hands', ua: 'Нерухомість під опікою KaZem' },
    'mzk.title':   { pl: 'Aktualne oferty',              en: 'Live listings',             ua: 'Актуальні пропозиції' },
    'mzk.em':      { pl: 'w Twoim imieniu.',             en: 'managed for you.',              ua: 'під вашим управлінням.' },
    'mzk.desc':    { pl: 'Każde mieszkanie które mi przekazujesz jest zadbane, wynajęte i pracuje na Twój zysk. Nie przechowuję pustych lokali — pilnuję ciągłości. Poniżej znajdziesz oferty które aktualnie prowadzę w imieniu właścicieli.', en: 'Every property you hand me is looked after, tenanted, and earning. I don’t let apartments sit empty — I keep things moving. Below are the listings I currently run on behalf of owners.', ua: 'Кожна квартира, яку ви мені довіряєте, доглянута, заселена і приносить дохід. Я не допускаю простою — тримаю все в русі. Нижче — оголошення, якими я зараз керую від імені власників.' },
    'mzk.cta.h3':  { pl: 'Szukasz mieszkania<br>lub pokoju do wynajęcia?', en: 'Looking for a room<br>or apartment in Warsaw?', ua: 'Шукаєте кімнату<br>або квартиру у Варшаві?' },
    'mzk.cta.p':   { pl: 'Wszystkie aktualne oferty — pokoje studenckie i mieszkania — znajdziesz na osobnej stronie. Tam możesz sprawdzić dostępność, ceny i umówić oglądanie.', en: 'All available listings — student rooms and full apartments — are on a dedicated page. Check what’s open, compare prices, and book a viewing.', ua: 'Усі вільні пропозиції — студентські кімнати та повноцінні квартири — зібрані на окремій сторінці. Подивіться, що доступно, порівняйте ціни та запишіться на перегляд.' },
    'mzk.cta.sub': { pl: 'Oferty aktualizowane na bieżąco · Odpowiedź w 24h', en: 'Updated in real time · Reply within 24 h', ua: 'Оновлюються в реальному часі · Відповідь протягом 24 год' },
    'mzk.cta.btn': { pl: 'Zobacz aktualne oferty →', en: 'Browse available listings →', ua: 'Переглянути пропозиції →' },

    // Services
    'svc.label':   { pl: 'Usługi',  en: 'Services', ua: 'Послуги' },
    'svc.title':   { pl: 'Co dokładnie robię dla właścicieli?', en: 'What exactly do I do for landlords?', ua: 'Що саме я роблю для власників?' },
    'svc.desc':    { pl: 'Nie jestem pośrednikiem, który podpisuje umowę i znika. Jestem stałą opiekunką Twojego mieszkania — od momentu przejęcia kluczy, aż do dnia kiedy zdecydujesz się zakończyć współpracę.', en: "I'm not a broker who signs a contract and vanishes. I'm the one looking after your property day in, day out — from the moment you hand me the keys until the day you decide we're done.", ua: 'Я не посередник, який підписує договір і зникає. Я — та людина, яка дбає про вашу нерухомість щодня, від моменту передачі ключів до дня, коли ви вирішите завершити співпрацю.' },
    'svc.desc2':   { pl: 'Pracuję zarówno z właścicielami mieszkającymi na co dzień w Warszawie, jak i z tymi, którzy zarządzają najmem zdalnie — z innego miasta albo zza granicy.', en: 'I work with owners who live in Warsaw day-to-day as well as those managing their rental remotely — from another city or abroad.', ua: 'Я працюю як із власниками, що живуть у Варшаві, так і з тими, хто керує орендою дистанційно — з іншого міста чи з-за кордону.' },
    'svc.badge':   { pl: 'Główna usługa', en: 'Core service', ua: 'Основна послуга' },
    'svc.1.title': { pl: 'Kompleksowe zarządzanie najmem', en: 'End-to-end rental management', ua: 'Повне управління орендою' },
    'svc.1.desc':  { pl: 'Pełna opieka nad mieszkaniem — jeden telefon do mnie zastępuje dziesiątki rozmów z najemcami, hydraulikami i agencjami. Działam na podstawie pełnomocnictwa.', en: 'One call to me replaces dozens of calls to tenants, plumbers and agencies. I hold power of attorney — you don’t need to be involved at all.', ua: 'Один дзвінок мені замінює десятки розмов із мешканцями, сантехніками та агентствами. Маю доручення — вам не потрібно втручатися взагалі.' },
    'svc.1.li1':   { pl: 'Pilnowanie ciągłości najmu i terminów umów', en: 'Keeping occupancy unbroken and leases on track', ua: 'Безперервна заповнюваність та контроль термінів' },
    'svc.1.li2':   { pl: 'Podpisywanie umów i aneksów w imieniu właściciela', en: 'Signing leases and amendments on your behalf', ua: 'Підписання договорів та додатків від вашого імені' },
    'svc.1.li3':   { pl: 'Regularny raport ze stanu mieszkania', en: 'Regular condition reports', ua: 'Регулярні звіти про стан квартири' },
    'svc.1.li4':   { pl: 'Kontakt z najemcami w każdej sprawie', en: 'Tenant liaison on every matter', ua: 'Зв’язок із мешканцями з будь-яких питань' },
    'svc.2.title': { pl: 'Najem studencki i wynajem pokoi', en: 'Student & room rentals', ua: 'Студентська оренда та здача кімнат' },
    'svc.2.desc':  { pl: 'Specjalizuję się w wynajmie pokoi dla studentów. Znam rytm roku akademickiego i wiem kiedy szukać nowych lokatorów, żeby mieszkanie nigdy nie stało puste.', en: 'I specialise in renting rooms to students. I know the academic calendar inside out and start filling vacancies well before anyone moves out.', ua: 'Я спеціалізуюсь на здачі кімнат студентам. Знаю академічний календар напам’ять і починаю шукати нових мешканців задовго до виїзду попередніх.' },
    'svc.2.li1':   { pl: 'Rekrutacja studentów i weryfikacja', en: 'Sourcing and screening students', ua: 'Пошук та перевірка студентів' },
    'svc.2.li2':   { pl: 'Umowy pokojowe i regulaminy mieszkania', en: 'Room-by-room leases and house rules', ua: 'Покімнатні договори та правила проживання' },
    'svc.2.li3':   { pl: 'Rotacja najemców między latami akademickimi', en: 'Seamless turnover between academic years', ua: 'Безшовна ротація між навчальними роками' },
    'svc.3.title': { pl: 'Obsługa techniczna i interwencje', en: 'Maintenance & emergency response', ua: 'Технічне обслуговування та аварійне реагування' },
    'svc.3.desc':  { pl: 'Usterki zdarzają się zawsze — ważne, żeby ktoś zareagował szybko. Koordynuję fachowców, kontroluję jakość napraw i rozliczam koszty.', en: 'Things break — that’s inevitable. What matters is how fast someone picks up the phone. I dispatch trusted tradespeople, oversee the work, and keep costs transparent.', ua: 'Поломки — це неминуче. Головне — як швидко хтось візьме трубку. Я відправляю перевірених майстрів, контролюю роботу і тримаю витрати прозорими.' },
    'svc.3.li1':   { pl: 'Interwencje w ciągu 24 godzin', en: 'On-site response within 24 hours', ua: 'Виїзд протягом 24 годин' },
    'svc.3.li2':   { pl: 'Sprawdzona sieć zaufanych fachowców', en: 'Vetted network of reliable tradespeople', ua: 'Перевірена мережа надійних майстрів' },
    'svc.3.li3':   { pl: 'Nadzór i kontrola jakości napraw', en: 'Quality oversight on every repair', ua: 'Контроль якості кожного ремонту' },
    'svc.4.title': { pl: 'Homestaging', en: 'Home Staging', ua: 'Хоумстейджинг' },
    'svc.4.desc':  { pl: 'Dobrze przygotowane mieszkanie wynajmuje się szybciej i za wyższy czynsz. Oferuję pełną usługę home stagingu — aranżację, dekorację i profesjonalną sesję zdjęciową.', en: 'A well-staged apartment rents faster and commands higher rent. I handle the entire process — styling, décor, and a professional photo shoot.', ua: 'Гарно оформлена квартира здається швидше та за вищою ціною. Я беру на себе весь процес — стилізацію, декор та професійну фотозйомку.' },
    'svc.5.title': { pl: 'Weryfikacja i dobór najemców', en: 'Tenant vetting & selection', ua: 'Перевірка та відбір мешканців' },
    'svc.5.desc':  { pl: 'Weryfikuję potencjalnych najemców zanim cokolwiek podpiszę. Sprawdzam dokumenty, referencje i historię najmu. Dobry najemca to spokój na lata.', en: 'I screen every prospective tenant before anything is signed. References, documents, rental history — a good tenant means years of peace of mind.', ua: 'Перевіряю кожного потенційного мешканця, перш ніж щось підписати. Рекомендації, документи, історія оренди — хороший мешканець — це роки спокою.' },
    'svc.6.title': { pl: 'Wynajem pojedynczych mieszkań', en: 'Single-property rentals', ua: 'Оренда окремих квартир' },
    'svc.6.desc':  { pl: 'Pomagam wynająć mieszkanie jednej rodzinie lub osobie — z pełną obsługą formalną, profesjonalnym ogłoszeniem i selekcją najemców.', en: 'I help you rent out a flat to one family or individual — with a polished listing, proper paperwork, and hand-picked tenants.', ua: 'Допомагаю здати квартиру одній родині або особі — з якісним оголошенням, правильним оформленням та ретельно відібраними мешканцями.' },

    // About
    'about.label':  { pl: 'O mnie',  en: 'About me', ua: 'Про мене' },
    'about.title':  { pl: 'Jestem Kasia — nie firma, tylko człowiek', en: "I'm Kasia — a person, not a corporation", ua: 'Я Кася — людина, а не корпорація' },
    'about.p1':     { pl: 'Wiem, jak wiele stresu potrafi dać najem. Zna się na tym każdy właściciel, który choć raz o 22:00 odebrał telefon „bo przestała działać pralka". Dlatego robię to, co robię.', en: 'I know how stressful being a landlord can be. If you’ve ever had your phone ring at 10 PM because “the washing machine died,” you already understand why I do this.', ua: 'Я знаю, скільки нервів коштує оренда. Якщо вам хоч раз телефонували о 22:00, бо «зламалася пральна машина», ви розумієте, навіщо я це роблю.' },
    'about.p2':     { pl: 'Zarządzam mieszkaniami w Warszawie — z prawdziwą troską, nie na autopilocie. Nie jestem anonimową agencją z infolinią. Masz mój numer, moją uwagę i moją odpowiedzialność.', en: 'I manage properties in Warsaw with genuine care, not on autopilot. I’m not a faceless agency with a call centre. You have my personal number, my full attention, and my word.', ua: 'Я керую нерухомістю у Варшаві з щирою турботою, а не на автопілоті. Я — не безлике агентство з кол-центром. У вас є мій особистий номер, моя повна увага та моє слово.' },
    'about.v1.strong': { pl: 'Działam w Twoim imieniu', en: 'I act in your name', ua: 'Дію від вашого імені' },
    'about.v1.p':      { pl: '— mam pełnomocnictwo, podpisuję dokumenty, reprezentuję Cię wobec najemców. Ty możesz być gdziekolwiek.', en: '— holding power of attorney, signing documents, representing you to tenants. You can be anywhere in the world.', ua: '— маю доручення, підписую документи, представляю вас перед мешканцями. Ви можете бути будь-де у світі.' },
    'about.v2.strong': { pl: 'Znana twarz w kamienicy', en: 'A known face in the building', ua: 'Знайоме обличчя в будинку' },
    'about.v2.p':      { pl: '— najemcy wiedzą, kto się nimi zajmuje. Zaufanie buduje się latami i chroni Twoje mieszkanie.', en: '— tenants know exactly who’s responsible. That kind of trust takes years to build and it’s what keeps your property safe.', ua: '— мешканці точно знають, хто відповідає. Така довіра будується роками — і саме вона захищає вашу квартиру.' },
    'about.v3.strong': { pl: 'Specjalistka od rynku studenckiego', en: 'Student-market expert', ua: 'Експерт студентського ринку' },
    'about.v3.p':      { pl: '— znam ten rynek od podszewki. Wiem kiedy szukać, kogo weryfikować i jak unikać problemów.', en: '— I know this niche cold: when to advertise, who to screen, and how to dodge the common pitfalls.', ua: '— я знаю цю нішу як свої п’ять пальців: коли давати оголошення, кого перевіряти і як уникнути типових пасток.' },
    'about.v4.strong': { pl: 'Przejrzyste zasady, bez ukrytych kosztów', en: 'Transparent terms, no hidden costs', ua: 'Прозорі умови, без прихованих витрат' },
    'about.v4.p':      { pl: '— jasno ustalone wynagrodzenie i elastyczny zakres usług dopasowany do Twojego mieszkania, a nie gotowy szablon dla każdego.', en: '— a clearly agreed fee and a flexible scope of services tailored to your apartment, not a one-size-fits-all template.', ua: '— чітко узгоджена винагорода та гнучкий обсяг послуг, підібраний під вашу квартиру, а не однаковий шаблон для всіх.' },
    'about.badge.name':  { pl: 'Katarzyna Zemlik', en: 'Katarzyna Zemlik', ua: 'Катажина Землік' },
    'about.badge.small': { pl: 'KaZem Mieszkania · Warszawa', en: 'KaZem Mieszkania · Warsaw', ua: 'KaZem Mieszkania · Варшава' },

    // Why KaZem
    'why.label': { pl: 'Dlaczego KaZem', en: 'Why KaZem', ua: 'Чому KaZem' },
    'why.title': { pl: 'Co zyskujesz oddając mi klucze?', en: 'What do you gain by handing me the keys?', ua: 'Що ви отримаєте, передавши мені ключі?' },
    'why.desc':  { pl: 'Spokojna głowa, regularny czynsz i pewność, że ktoś naprawdę patrzy na Twoje mieszkanie.', en: 'Peace of mind, steady income, and the confidence that someone truly has an eye on your property.', ua: 'Спокій, стабільний дохід та впевненість, що хтось справді стежить за вашою квартирою.' },
    'why.1.strong': { pl: 'Zero przestojów.',              en: 'No vacancies.',            ua: 'Жодного простою.' },
    'why.1.p':      { pl: 'Pilnuję terminów umów i zaczynam szukać nowych najemców z wyprzedzeniem, zanim poprzedni wyjdzie.', en: 'I track every lease deadline and start sourcing new tenants well before the current ones move out.', ua: 'Відстежую кожен термін договору і починаю шукати нових мешканців задовго до виїзду поточних.' },
    'why.2.strong': { pl: 'Podpisuję wszystko w Twoim imieniu.', en: 'I sign everything on your behalf.', ua: 'Підписую все від вашого імені.' },
    'why.2.p':      { pl: 'Umowy, aneksy, protokoły — nie musisz przyjeżdżać do Warszawy.', en: 'Leases, amendments, handover reports — no need to fly to Warsaw.', ua: 'Договори, додатки, акти прийому-передачі — приїжджати до Варшави не потрібно.' },
    'why.3.strong': { pl: 'Jedna osoba, nie call center.', en: 'One person, not a call centre.', ua: 'Одна людина, а не кол-центр.' },
    'why.3.p':      { pl: 'Dzwonisz do mnie i wiesz, z kim rozmawiasz.', en: 'When you call me, you know exactly who’s on the other end.', ua: 'Коли ви мені телефонуєте, ви точно знаєте, з ким розмовляєте.' },
    'why.4.strong': { pl: 'Transparentne rozliczenia.', en: 'Crystal-clear billing.', ua: 'Абсолютно прозорі розрахунки.' },
    'why.4.p':      { pl: 'Wiesz co, kiedy i za ile. Żadnych ukrytych kosztów.', en: 'You know what was spent, when, and how much. No surprises.', ua: 'Ви знаєте, що було витрачено, коли і скільки. Жодних сюрпризів.' },
    'why.5.strong': { pl: 'Sprawdzona sieć fachowców.', en: 'A tried-and-tested crew.', ua: 'Перевірена команда.' },
    'why.5.p':      { pl: 'Hydraulik, elektryk, stolarz — reagują szybko i uczciwie wyceniają.', en: 'Plumber, electrician, carpenter — they pick up fast and quote fairly.', ua: 'Сантехнік, електрик, тесля — реагують швидко і оцінюють чесно.' },

    // Steps
    'steps.title': { pl: 'Jak zaczynamy?', en: 'How do we get started?', ua: 'Як ми починаємо?' },
    'steps.desc':  { pl: 'Od bezpłatnej rozmowy do spokojnego najmu — cztery proste kroki.', en: 'From a no-strings chat to hassle-free rental income — four straightforward steps.', ua: 'Від розмови без зобов’язань до стабільного доходу — чотири прості кроки.' },
    'step.1.strong': { pl: 'Bezpłatna konsultacja', en: 'Free consultation', ua: 'Безкоштовна консультація' },
    'step.1.small':  { pl: 'Opowiadasz mi o mieszkaniu. Bez zobowiązań.', en: 'Tell me about your property. Zero commitment.', ua: 'Розкажіть про свою нерухомість. Без зобов’язань.' },
    'step.2.strong': { pl: 'Ocena i ewentualny homestaging', en: 'Assessment & optional staging', ua: 'Оцінка та можливий стейджинг' },
    'step.2.small':  { pl: 'Przygotowuję mieszkanie, żeby wynajęło się szybko i drogo.', en: 'I get the place ready to rent quickly and at top price.', ua: 'Готую квартиру, щоб здати швидко і за найкращою ціною.' },
    'step.3.strong': { pl: 'Umowa współpracy i pełnomocnictwo', en: 'Agreement & power of attorney', ua: 'Договір та доручення' },
    'step.3.small':  { pl: 'Wszystko jasno na papierze — warunki, zakres, wynagrodzenie.', en: 'Everything on paper — scope, terms, fee.', ua: 'Все на папері — обсяг, умови, оплата.' },
    'step.4.strong': { pl: 'Oddajesz klucze — my robimy resztę', en: 'Hand over the keys — I take it from here', ua: 'Передайте ключі — далі я' },
    'step.4.small':  { pl: 'Czynsz trafia do Ciebie co miesiąc.', en: 'Rent hits your account every month.', ua: 'Орендна плата надходить щомісяця.' },

    // Homestaging section
    'staging.label': { pl: 'Homestaging', en: 'Home Staging', ua: 'Хоумстейджинг' },
    'staging.title': { pl: 'Pierwsze zdjęcie to pierwsze wrażenie', en: 'The first photo makes or breaks a listing', ua: 'Перше фото вирішує все' },
    'staging.desc':  { pl: 'Właściciele, którzy inwestują w homestaging, wynajmują mieszkanie szybciej i często uzyskują wyższy czynsz niż zakładali. To nie magia — to dobre przygotowanie.', en: 'Landlords who invest in staging rent out faster and often pocket higher rent than they expected. It’s not magic — it’s preparation.', ua: 'Власники, які інвестують у стейджинг, здають швидше і часто отримують більше, ніж розраховували. Це не магія — це підготовка.' },
    'staging.li1':   { pl: 'Wizyta w mieszkaniu i analiza potencjału', en: 'On-site visit and potential assessment', ua: 'Огляд квартири та оцінка потенціалу' },
    'staging.li2':   { pl: 'Plan aranżacji i zakup niezbędnych elementów', en: 'Layout plan and sourcing décor items', ua: 'План облаштування та підбір декору' },
    'staging.li3':   { pl: 'Stylizacja i przygotowanie wnętrza do zdjęć', en: 'Interior styling and photo-ready prep', ua: 'Стилізація інтер’єру та підготовка до зйомки' },
    'staging.li4':   { pl: 'Profesjonalna sesja fotograficzna', en: 'Professional photo shoot', ua: 'Професійна фотозйомка' },
    'staging.li5':   { pl: 'Przygotowanie ogłoszenia z opisem i zdjęciami', en: 'Crafting the listing with copy and images', ua: 'Створення оголошення з текстом та фото' },
    'staging.li6':   { pl: 'Publikacja na wszystkich kluczowych portalach', en: 'Publishing across all major platforms', ua: 'Публікація на всіх основних платформах' },
    'staging.cta':   { pl: 'Zapytaj o homestaging →', en: 'Ask about staging →', ua: 'Запитати про стейджинг →' },

    // FAQ
    'faq.label': { pl: 'FAQ', en: 'FAQ', ua: 'Питання та відповіді' },
    'faq.title': { pl: 'Pytania, które słyszę najczęściej', en: 'Questions I get asked the most', ua: 'Запитання, які мені ставлять найчастіше' },
    'faq.desc':  { pl: 'Zebrałam odpowiedzi na pytania, które zadają właściciele zanim zdecydują się powierzyć mi swoje mieszkanie.', en: "I've gathered answers to questions asked by owners before they decide to entrust me with their apartment.", ua: 'Я зібрала відповіді на запитання, які задають власники, перш ніж вирішити довірити мені свою квартиру.' },
    'faq.cta':   { pl: 'Masz inne pytanie? Napisz →', en: 'Got a different question? Ask away →', ua: 'Маєте інше запитання? Пишіть →' },
    'faq.q1':    { pl: 'Czy muszę przyjeżdżać do Warszawy przy podpisywaniu umów?', en: 'Do I have to come to Warsaw to sign paperwork?', ua: 'Чи потрібно мені приїжджати до Варшави для підписання документів?' },
    'faq.a1':    { pl: 'Nie — działam na podstawie pełnomocnictwa, więc mogę podpisywać umowy, aneksy i wszelkie dokumenty związane z najmem w Twoim imieniu. Możesz mieszkać po drugiej stronie świata.', en: "No — I act under power of attorney, so I can sign contracts, annexes and all rental-related documents on your behalf. You can live on the other side of the world.", ua: 'Ні — я діюю на підставі доручення, тому можу підписувати договори, додатки та всі документи, пов\'язані з орендою, від вашого імені. Ви можете жити на іншому кінці світу.' },
    'faq.q2':    { pl: 'Ile kosztuje zarządzanie najmem w Warszawie?', en: 'How much does rental management in Warsaw cost?', ua: 'Скільки коштує управління орендою у Варшаві?' },
    'faq.a2':    { pl: 'Moje wynagrodzenie to zazwyczaj procent od miesięcznego czynszu — dokładna stawka zależy od zakresu usług i liczby lokali. Nie ma ukrytych kosztów. Wszystko ustalamy jasno na początku, zanim cokolwiek podpiszemy.', en: 'My fee is typically a percentage of the monthly rent — the exact rate depends on the scope and number of properties. No hidden charges. We lay everything out clearly upfront, before anything is signed.', ua: 'Моя винагорода — зазвичай відсоток від місячної оренди. Точна ставка залежить від обсягу послуг та кількості об’єктів. Жодних прихованих платежів. Усе обговорюємо відкрито ще до підписання.' },
    'faq.q3':    { pl: 'Czy zajmujesz się wyłącznie mieszkaniami studenckimi?', en: 'Do you only work with student apartments?', ua: 'Ви працюєте тільки зі студентськими квартирами?' },
    'faq.a3':    { pl: 'Nie — specjalizuję się w najmie studenckim, ale zajmuję się też kompleksowym zarządzaniem zwykłymi mieszkaniami wynajmowanymi rodzinom lub singlom, oraz wynajmem pojedynczych lokali.', en: "No — I specialize in student rentals, but I also handle full management of regular apartments rented to families or singles, and single-property rentals.", ua: 'Ні — я спеціалізуюсь на студентській оренді, але також займаюсь комплексним управлінням звичайними квартирами, що здаються родинам або одинакам, та орендою окремих об\'єктів.' },
    'faq.q4':    { pl: 'Co się dzieje, gdy najemca przestaje płacić?', en: 'What happens if a tenant stops paying?', ua: 'Що робити, якщо мешканець перестає платити?' },
    'faq.a4':    { pl: 'Reaguję natychmiast — kontaktuję się z najemcą, wysyłam wezwania i wspieram właściciela w podjęciu kroków prawnych. Kluczem jest prewencja: staram się dobierać najemców tak, żeby do takiej sytuacji nie dochodziło.', en: 'I step in immediately — contacting the tenant, issuing formal notices, and supporting you through any legal steps. But the real key is prevention: I vet tenants carefully so this rarely comes up.', ua: 'Я реагую негайно — зв’язуюся з мешканцем, надсилаю офіційні попередження та підтримую вас у правових кроках. Але головне — профілактика: я ретельно перевіряю мешканців, тому такі ситуації трапляються рідко.' },
    'faq.q5':    { pl: 'Na jakich dzielnicach Warszawy działasz?', en: 'Which Warsaw neighbourhoods do you cover?', ua: 'У яких районах Варшави ви працюєте?' },
    'faq.a5':    { pl: 'Działam przede wszystkim na Mokotowie, Ursynowie, Woli, Ochocie, w Śródmieściu i na Żoliborzu — ale zasadniczo obsługuję całą Warszawę.', en: 'My core areas are Mokotów, Ursynów, Wola, Ochota, Śródmieście and Żoliborz — but I effectively cover all of Warsaw.', ua: 'Мої основні райони — Мокотув, Урсинув, Воля, Охота, Середмістя та Жолібож — але фактично я працюю по всій Варшаві.' },
    'faq.q6':    { pl: 'Czy mogę zlecić zarządzanie tylko jednym mieszkaniem, czy trzeba mieć ich kilka?', en: 'Can I hand over just one apartment, or do I need several?', ua: 'Чи можу я передати в управління лише одну квартиру, чи потрібно мати кілька?' },
    'faq.a6':    { pl: 'Nie — zarządzam zarówno pojedynczymi mieszkaniami, jak i portfelami kilku lokali należących do jednego właściciela. Zasady współpracy, pełnomocnictwo i zakres opieki są takie same niezależnie od liczby mieszkań.', en: 'Neither — I manage single apartments as well as portfolios of several units belonging to one owner. The terms of cooperation, the power of attorney and the scope of care are the same regardless of how many apartments you have.', ua: 'Ні — я керую як окремими квартирами, так і портфелями з кількох об’єктів одного власника. Умови співпраці, довіреність та обсяг опіки однакові незалежно від кількості квартир.' },
    'faq.q7':    { pl: 'Jak wygląda pierwszy krok, jeśli chcę zlecić Ci zarządzanie najmem?', en: "What's the first step if I want you to manage my rental?", ua: 'Який перший крок, якщо я хочу доручити вам управління орендою?' },
    'faq.a7':    { pl: 'Zaczynamy od bezpłatnej i niezobowiązującej konsultacji — opowiadasz mi o mieszkaniu. Potem oceniam lokal i, jeśli to ma sens, proponuję homestaging. Na końcu podpisujemy prostą umowę współpracy wraz z pełnomocnictwem, w której jasno opisany jest zakres usług i wynagrodzenie — dopiero wtedy przekazujesz mi klucze.', en: "We start with a free, no-obligation consultation — you tell me about the apartment. Then I assess the property and, if it makes sense, suggest home staging. Finally we sign a simple cooperation agreement together with a power of attorney that clearly sets out the scope of services and my fee — only then do you hand over the keys.", ua: 'Починаємо з безкоштовної консультації без зобов’язань — розповідаєте мені про квартиру. Потім я оцінюю об’єкт і, якщо це має сенс, пропоную хоумстейджинг. Наостанок підписуємо просту угоду про співпрацю разом із довіреністю, де чітко описано обсяг послуг та винагороду — лише тоді ви передаєте мені ключі.' },
    'faq.q8':    { pl: 'Czy pomagasz znaleźć najemcę, czy zajmujesz się tylko obsługą już wynajętego mieszkania?', en: "Do you help find a tenant, or do you only manage an apartment that's already rented?", ua: 'Ви допомагаєте знайти орендаря, чи лише керуєте вже зданою квартирою?' },
    'faq.a8':    { pl: 'Jedno i drugie. Jeśli mieszkanie stoi puste, przygotowuję je do wynajmu (w razie potrzeby homestaging), tworzę i publikuję ogłoszenie oraz weryfikuję kandydatów na najemców. Jeśli najemca już jest, przejmuję bieżącą obsługę i pilnuję ciągłości najmu, żeby mieszkanie nigdy nie stało bez przychodu.', en: "Both. If the apartment is empty, I prepare it for rent (with home staging if needed), write and publish the listing, and screen tenant candidates. If a tenant is already in place, I take over day-to-day management and keep the rental continuous, so the apartment is never sitting without income.", ua: 'І те, і інше. Якщо квартира порожня, я готую її до оренди (за потреби — хоумстейджинг), створюю та публікую оголошення, перевіряю кандидатів. Якщо орендар вже є, я беру на себе поточне управління та стежу за безперервністю оренди, щоб квартира ніколи не залишалася без доходу.' },
    'faq.q9':    { pl: 'Czy warto zatrudnić firmę do zarządzania najmem, czy zarządzać mieszkaniem samodzielnie?', en: 'Is it worth hiring a rental management company, or should I manage it myself?', ua: 'Чи варто наймати компанію з управління орендою, чи керувати квартирою самостійно?' },
    'faq.a9':    { pl: 'To zależy, ile czasu i uwagi możesz poświęcić najmowi. Samodzielne zarządzanie oznacza samodzielne szukanie najemców, podpisywanie umów, pilnowanie terminów i reagowanie na każdą usterkę — często o niedogodnej porze. Firma zarządzająca, taka jak KaZem, przejmuje to wszystko za Ciebie: Ty dostajesz czynsz, ja zajmuję się resztą.', en: 'It depends on how much time and attention you can give the rental. Managing it yourself means finding tenants, signing contracts, tracking deadlines and reacting to every repair — often at an inconvenient hour. A management company like KaZem takes all of that off your plate: you get the rent, I handle the rest.', ua: 'Це залежить від того, скільки часу й уваги ви можете приділяти оренді. Самостійне управління означає самостійний пошук орендарів, підписання договорів, контроль термінів і реакцію на кожну несправність — часто в незручний час. Компанія з управління, як KaZem, бере це все на себе: ви отримуєте орендну плату, я займаюся рештою.' },
    'faq.q10':   { pl: 'Czy mogę zrezygnować ze współpracy, jeśli będę niezadowolony?', en: "Can I end the agreement if I'm not satisfied?", ua: 'Чи можу я розірвати співпрацю, якщо буду незадоволений?' },
    'faq.a10':   { pl: 'Tak — warunki zakończenia współpracy są jasno opisane w umowie, którą podpisujemy na starcie, zanim przekażesz mi klucze. Zależy mi na długoterminowej współpracy opartej na zaufaniu, a nie na wiązaniu właścicieli niekorzystną umową.', en: 'Yes — the terms for ending our cooperation are clearly laid out in the agreement we sign at the start, before you hand over the keys. I care about a long-term relationship built on trust, not locking owners into an unfavourable contract.', ua: 'Так — умови завершення співпраці чітко прописані в угоді, яку ми підписуємо на старті, ще до передачі ключів. Мені важлива довготривала співпраця на довірі, а не прив’язування власників невигідним договором.' },

    // Contact section
    'contact.label':  { pl: 'Kontakt', en: 'Contact', ua: 'Контакт' },
    'contact.title':  { pl: 'Porozmawiajmy o Twoim mieszkaniu', en: "Let's talk about your apartment", ua: 'Поговоримо про вашу квартиру' },
    'contact.desc':   { pl: 'Bezpłatna konsultacja — bez zobowiązań. Opowiedz mi o swoim mieszkaniu, a ja powiem Ci szczerze, co mogę zrobić i ile to kosztuje.', en: 'Free, no-strings consultation. Tell me about your apartment and I’ll give you an honest picture — what I can do and what it’ll cost.', ua: 'Безкоштовна консультація без зобов’язань. Розкажіть про свою квартиру, і я чесно скажу, що можу зробити і скільки це коштує.' },
    'contact.phone':  { pl: 'Telefon',          en: 'Phone',          ua: 'Телефон' },
    'contact.area':   { pl: 'Obszar działania', en: 'Coverage area',   ua: 'Зона роботи' },
    'contact.area.v': { pl: 'Warszawa i okolice', en: 'Warsaw & surroundings', ua: 'Варшава та передмістя' },
    'contact.f.name': { pl: 'Imię i nazwisko',  en: 'Full name',      ua: 'Ім’я та прізвище' },
    'contact.f.tel':  { pl: 'Telefon',          en: 'Phone',          ua: 'Телефон' },
    'contact.f.email':{ pl: 'E-mail',           en: 'E-mail',         ua: 'E-mail' },
    'contact.f.what': { pl: 'Czego szukasz?',   en: 'How can I help?', ua: 'Чим можу допомогти?' },
    'contact.f.opt1': { pl: 'Zarządzanie najmem',           en: 'Rental management',       ua: 'Управління орендою' },
    'contact.f.opt2': { pl: 'Najem studencki / pokoje',     en: 'Student rooms',    ua: 'Студентські кімнати' },
    'contact.f.opt3': { pl: 'Homestaging',                  en: 'Home staging',              ua: 'Хоумстейджинг' },
    'contact.f.opt4': { pl: 'Wynajem pojedynczego mieszkania', en: 'Renting out a single flat', ua: 'Здати окрему квартиру' },
    'contact.f.opt5': { pl: 'Inne',                         en: 'Other',                     ua: 'Інше' },
    'contact.f.msg':  { pl: 'Wiadomość',        en: 'Message',        ua: 'Повідомлення' },
    'contact.f.send': { pl: 'Wyślij wiadomość — odezwę się w ciągu 24h', en: 'Send message — I’ll reply within 24 h', ua: 'Надіслати — відповім протягом 24 год' },
    'contact.f.ph.name': { pl: 'Jan Kowalski',  en: 'John Smith',     ua: 'Іван Петренко' },
    'contact.f.ph.msg':  { pl: 'Opisz krótko swoje mieszkanie i czego potrzebujesz...', en: 'A few words about your property and what you need…', ua: 'Кілька слів про вашу квартиру та що вам потрібно…' },
    'contact.f.sending': { pl: 'Wysyłam…',      en: 'Sending…',       ua: 'Надсилаю…' },
    'contact.f.success': { pl: '✅ Wiadomość wysłana! Odezwę się w ciągu 24h.', en: '✅ Message sent! I’ll be in touch within 24 h.', ua: '✅ Надіслано! Зв’яжуся протягом 24 год.' },
    'contact.f.error':   { pl: '⚠️ Coś poszło nie tak. Napisz bezpośrednio na kasia@kazemmieszkania.pl', en: '⚠️ Something went wrong. Write directly to kasia@kazemmieszkania.pl', ua: '⚠️ Щось пішло не так. Напишіть безпосередньо на kasia@kazemmieszkania.pl' },
    'contact.f.valid':   { pl: 'Proszę wypełnić imię, telefon i e-mail.', en: 'Please fill in your name, phone and email.', ua: 'Будь ласка, заповніть ім’я, телефон та email.' },
    'contact.f.email.invalid': { pl: 'Proszę podać poprawny adres e-mail.', en: 'Please enter a valid email address.', ua: 'Будь ласка, вкажіть правильну адресу e-mail.' },

    // ════════════════════════════════════════════════════════════════════════
    // OFERTY.HTML — strona ofert (najemcy)
    // ════════════════════════════════════════════════════════════════════════

    'off.hero.label': { pl: 'Aktualne oferty · Warszawa', en: 'Current listings · Warsaw', ua: 'Актуальні пропозиції · Варшава' },
    'off.hero.h1.1':  { pl: 'Pokoje i mieszkania',        en: 'Rooms and apartments',       ua: 'Кімнати та квартири' },
    'off.hero.h1.2':  { pl: 'do wynajęcia w',             en: 'for rent in',                ua: 'для оренди у' },
    'off.hero.h1.3':  { pl: 'Warszawie',                  en: 'Warsaw',                     ua: 'Варшаві' },
    'off.hero.desc':  { pl: 'Pokoje studenckie i mieszkania na wynajem w Warszawie — Mokotów, Wola, Śródmieście, Żoliborz i inne dzielnice. Wszystkie lokale zarządzane przez KaZem Mieszkania.', en: 'Student rooms and apartments for rent in Warsaw — Mokotów, Wola, Śródmieście, Żoliborz and other districts. All properties managed by KaZem Mieszkania.', ua: 'Студентські кімнати та квартири для оренди у Варшаві — Мокотув, Воля, Śródmieście, Жолібож та інші райони. Всі об\'єкти під управлінням KaZem Mieszkania.' },

    'off.filter.avail':  { pl: 'Dostępne',   en: 'Available',  ua: 'Доступні' },
    'off.filter.soon':   { pl: 'Wkrótce',    en: 'Soon',       ua: 'Незабаром' },
    'off.filter.all':    { pl: 'Wszystkich', en: 'All',        ua: 'Всі' },
    'off.filter.type':   { pl: 'Typ:',       en: 'Type:',      ua: 'Тип:' },
    'off.filter.all2':   { pl: 'Wszystkie',  en: 'All',        ua: 'Всі' },
    'off.filter.room':   { pl: '🛏 Pokój',   en: '🛏 Room',    ua: '🛏 Кімната' },
    'off.filter.apt':    { pl: '🏠 Mieszkanie', en: '🏠 Apartment', ua: '🏠 Квартира' },
    'off.filter.status': { pl: 'Status:',    en: 'Status:',    ua: 'Статус:' },
    'off.filter.taken':  { pl: 'Zajęte',     en: 'Taken',      ua: 'Зайняті' },

    'off.map.title': { pl: 'Mapa ofert',                   en: 'Listings map',                 ua: 'Карта пропозицій' },
    'off.map.hint1': { pl: 'Najedź na kropkę aby zobaczyć szczegóły.', en: 'Hover over a dot to see details.', ua: 'Наведіть на крапку, щоб побачити деталі.' },
    'off.map.hint2': { pl: 'Kliknij aby przejść do oferty.', en: 'Click to go to the listing.', ua: 'Натисніть, щоб перейти до оголошення.' },

    // Modal
    'modal.ask':        { pl: '📞 Zapytaj o tę ofertę', en: '📞 Enquire about this listing', ua: '📞 Запитати про цю пропозицію' },
    'modal.type.label': { pl: 'Czego szukasz?',          en: 'What are you looking for?',   ua: 'Що вас цікавить?' },
    'modal.type.apt':   { pl: '🏠 Mieszkanie',           en: '🏠 Apartment',                ua: '🏠 Квартира' },
    'modal.type.room':  { pl: '🛏 Pokój',                en: '🛏 Room',                     ua: '🛏 Кімната' },
    'modal.type.other': { pl: '💬 Inne',                 en: '💬 Other',                    ua: '💬 Інше' },
    'modal.or':         { pl: 'lub wyślij wiadomość',    en: 'or send a message',            ua: 'або надішліть повідомлення' },
    'modal.name':       { pl: 'Imię',                    en: 'Name',                        ua: 'Ім\'я' },
    'modal.phone':      { pl: 'Telefon',                 en: 'Phone',                       ua: 'Телефон' },
    'modal.email':      { pl: 'E-mail',                  en: 'E-mail',                      ua: 'E-mail' },
    'modal.msg':        { pl: 'Wiadomość',               en: 'Message',                     ua: 'Повідомлення' },
    'modal.send':       { pl: 'Wyślij zapytanie →',      en: 'Send enquiry →',              ua: 'Надіслати запит →' },
    'modal.sending':    { pl: 'Wysyłam…',                en: 'Sending…',                    ua: 'Надсилаю…' },
    'modal.success':    { pl: '✅ Wysłano! Odezwę się wkrótce.', en: '✅ Sent! I’ll be in touch shortly.', ua: '✅ Надіслано! Зв’яжуся найближчим часом.' },
    'modal.error':      { pl: '⚠️ Błąd wysyłki. Zadzwoń: 723 168 200', en: '⚠️ Something went wrong. Call me: 723 168 200', ua: '⚠️ Щось пішло не так. Телефонуйте: 723 168 200' },
    'modal.valid':      { pl: 'Proszę podać imię, telefon i e-mail.', en: 'Please provide name, phone and email.', ua: 'Будь ласка, вкажіть ім\'я, телефон та email.' },
    'modal.desc':       { pl: 'Opis', en: 'Description', ua: 'Опис' },
    'modal.ph.name':    { pl: 'Jan Kowalski', en: 'John Smith', ua: 'Іван Петренко' },

    // Status labels (used in JS renderGrid/openModal)
    'status.available': { pl: 'Dostępne teraz',  en: 'Available now',  ua: 'Доступно зараз' },
    'status.soon':      { pl: 'Wkrótce',         en: 'Available soon', ua: 'Незабаром' },
    'status.soon.from': { pl: 'Wkrótce · dostępne od', en: 'Soon · available from', ua: 'Незабаром · доступно з' },
    'status.taken':     { pl: 'Zajęte',          en: 'Taken',          ua: 'Зайнято' },

    // Admin panel (nie tłumaczymy — Kasia zawsze po polsku)
    // Zostawiamy panel administracyjny w języku polskim

    // Komunikaty walidacji w JS (oferty)
    'js.no-offers':   { pl: 'Brak ofert spełniających kryteria.', en: 'No listings match the criteria.', ua: 'Немає пропозицій, що відповідають критеріям.' },
    'js.page':        { pl: 'Strona',    en: 'Page',    ua: 'Сторінка' },
    'js.of':          { pl: 'z',         en: 'of',      ua: 'з' },
    'js.deposit':     { pl: 'Kaucja:',   en: 'Deposit:', ua: 'Застава:' },
    'js.avail.from':  { pl: 'Dostępne od:', en: 'Available from:', ua: 'Вільно з:' },
    'js.end':         { pl: 'Koniec umowy:', en: 'Contract end:', ua: 'Кінець договору:' },
    'js.soon.label':  { pl: 'Wkrótce wolne', en: 'Available soon', ua: 'Незабаром вільно' },
    'js.avail.dt':    { pl: 'Dostępne od: ', en: 'Available from: ', ua: 'Вільно з: ' },
    'off.map.find':     { pl: 'Znajdź ofertę na mapie', en: 'Find listing on map', ua: 'Знайти оголошення на карті' },
    'off.map.details':  { pl: 'Zobacz szczegóły →', en: 'View details →',   ua: 'Переглянути →' },
    'off.card.details': { pl: 'Szczegóły',           en: 'Details',          ua: 'Деталі' },
    'js.taken.until':   { pl: 'Zajęte do',           en: 'Occupied until',      ua: 'Зайнято до' },


  };

  // ── Core ───────────────────────────────────────────────────────────────────

  var LANG_KEY = 'kazem_lang';
  var SUPPORTED = ['pl', 'en', 'ua'];

  function getLang() {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    return 'pl';
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
    updateSwitcher(lang);
  }

  function t(key, lang) {
    lang = lang || getLang();
    var entry = TRANSLATIONS[key];
    if (!entry) { console.warn('i18n: missing key', key); return key; }
    return entry[lang] || entry['pl'] || key;
  }

  function applyLang(lang) {
    // Atrybuty text — brakujący klucz NIGDY nie nadpisuje treści (zostaje polski tekst z HTML)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!TRANSLATIONS[key]) { console.warn('i18n: missing key', key); return; }
      var val = t(key, lang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = val;
      } else {
        el.innerHTML = val;
      }
    });
    // Placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var pk = el.getAttribute('data-i18n-ph');
      if (TRANSLATIONS[pk]) el.placeholder = t(pk, lang);
    });
    // data-i18n-title (dla przycisków/ikon)
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var tk = el.getAttribute('data-i18n-title');
      if (TRANSLATIONS[tk]) el.title = t(tk, lang);
    });
    // <html lang>
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang;
    // Zapisz do okna żeby JS na stronie mógł używać
    window.KAZEM_LANG = lang;
    // Wywołaj event żeby strona mogła zareagować (np. re-render statusów)
    document.dispatchEvent(new CustomEvent('kazem:langchange', { detail: { lang: lang } }));
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // ── Przełącznik HTML ───────────────────────────────────────────────────────

  function buildSwitcher() {
    var sw = document.createElement('div');
    sw.className = 'lang-switcher';
    sw.setAttribute('aria-label', 'Language switcher');
    var langs = [
      { code: 'pl', label: 'PL', flag: '🇵🇱' },
      { code: 'en', label: 'EN', flag: '🇬🇧' },
      { code: 'ua', label: 'UA', flag: '🇺🇦' },
    ];
    var current = getLang();
    langs.forEach(function (l) {
      var btn = document.createElement('button');
      btn.className = 'lang-btn' + (l.code === current ? ' active' : '');
      btn.setAttribute('data-lang', l.code);
      btn.setAttribute('title', l.label);
      btn.innerHTML = '<span class="lang-flag">' + l.flag + '</span><span class="lang-label">' + l.label + '</span>';
      btn.addEventListener('click', function () { setLang(l.code); });
      sw.appendChild(btn);
    });
    return sw;
  }

  // ── Styl przełącznika (wstrzykiwany dynamicznie) ──────────────────────────

  function injectStyles() {
    var css = [
      '.lang-switcher{display:flex;align-items:center;gap:.25rem;margin-left:.8rem}',
      '.lang-btn{background:transparent;border:1px solid var(--border);border-radius:100px;padding:.28rem .6rem;cursor:pointer;font-size:.72rem;font-weight:600;letter-spacing:.04em;color:var(--muted);display:flex;align-items:center;gap:.22rem;transition:all .18s;white-space:nowrap}',
      '.lang-btn:hover{border-color:var(--accent);color:var(--accent)}',
      '.lang-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}',
      '.lang-flag{font-size:.85rem;line-height:1}',
      '.lang-label{font-size:.7rem}',
      '@media(max-width:768px){.lang-label{display:none}.lang-btn{padding:.28rem .45rem}}',
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  function init() {
    injectStyles();

    // Wstaw przełącznik do nav
    var nav = document.querySelector('nav');
    if (nav) {
      // Szukamy prawego końca nav (.nav-right, .nav-links lub końca nav)
      var navRight = nav.querySelector('.nav-right, .nav-links');
      var switcher = buildSwitcher();
      if (navRight) {
        navRight.parentNode.insertBefore(switcher, navRight.nextSibling);
      } else {
        nav.appendChild(switcher);
      }
    }

    // Zastosuj aktualny język
    applyLang(getLang());
  }

  // Eksportuj publiczne API
  window.i18n = { t: t, setLang: setLang, getLang: getLang };

  // Uruchom po załadowaniu DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
