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
    // INDEX.HTML — strona główna (właściciele)
    // ════════════════════════════════════════════════════════════════════════

    // Hero
    'hero.pill':       { pl: '★ Zarządzanie najmem · Warszawa', en: '★ Property Management · Warsaw', ua: '★ Управління орендою · Варшава' },
    'hero.h1.line1':   { pl: 'Twoje mieszkanie',    en: 'Your property',         ua: 'Ваша квартира' },
    'hero.h1.line2':   { pl: 'zarabia. Ja',         en: 'earns. I',              ua: 'заробляє. Я' },
    'hero.h1.em':      { pl: 'jestem na miejscu.',  en: 'am on the ground.',     ua: 'завжди поруч.' },
    'hero.sub':        { pl: 'Jestem Kasia — zajmuję się kompleksową obsługą mieszkań na wynajem w Warszawie. Podpisuję umowy, pilnuję ciągłości najmu, reaguję na usterki. Właściciel nie musi robić dosłownie nic.', en: "I'm Kasia — I provide full-service rental management in Warsaw. I sign contracts, ensure continuous occupancy, and handle maintenance. The owner doesn't have to do a thing.", ua: 'Я Кася — займаюся комплексним управлінням орендою у Варшаві. Підписую договори, стежу за безперервністю оренди, реагую на несправності. Власник не повинен нічого робити.' },
    'hero.kasia':      { pl: '— Katarzyna Zemlik, KaZem Mieszkania', en: '— Katarzyna Zemlik, KaZem Mieszkania', ua: '— Катажина Землік, KaZem Mieszkania' },
    'hero.cta1':       { pl: 'Umów bezpłatną konsultację →', en: 'Book a free consultation →', ua: 'Замовити безкоштовну консультацію →' },
    'hero.cta2':       { pl: 'Sprawdź co robię',    en: 'See what I do',         ua: 'Дізнатись більше' },
    'hero.stat1.n':    { pl: 'Lata',                en: 'Years',                 ua: 'Роки' },
    'hero.stat1.l':    { pl: 'Doświadczenia na rynku', en: 'of market experience', ua: 'досвіду на ринку' },
    'hero.stat2.l':    { pl: 'Ciągłość najmu',      en: 'Occupancy rate',        ua: 'Безперервність оренди' },
    'hero.stat3.l':    { pl: 'Czas reakcji',         en: 'Response time',        ua: 'Час реакції' },
    'hero.badge':      { pl: 'najem\nstudencki',     en: 'student\nrentals',      ua: 'студентська\nоренда' },

    // Trust bar
    'trust.1': { pl: 'Działam na podstawie pełnomocnictwa właściciela', en: 'I act under power of attorney from the owner', ua: 'Діюу на підставі доручення власника' },
    'trust.2': { pl: 'Podpisuję umowy i aneksy w imieniu właściciela',  en: 'I sign contracts and annexes on behalf of the owner', ua: 'Підписую договори та додатки від імені власника' },
    'trust.3': { pl: 'Specjalistka od najmu studenckiego',              en: 'Specialist in student rentals',                  ua: 'Спеціаліст із студентської оренди' },
    'trust.4': { pl: 'Obsługa techniczna i interwencje 24h',            en: 'Technical support and 24h interventions',         ua: 'Технічне обслуговування та втручання 24/7' },

    // Mieszkania section
    'mzk.label':   { pl: 'Mieszkania pod opieką KaZem', en: 'Properties managed by KaZem', ua: 'Квартири під управлінням KaZem' },
    'mzk.title':   { pl: 'Aktualne oferty',              en: 'Current listings',             ua: 'Актуальні пропозиції' },
    'mzk.em':      { pl: 'w Twoim imieniu.',             en: 'on your behalf.',              ua: 'від вашого імені.' },
    'mzk.desc':    { pl: 'Każde mieszkanie które mi przekazujesz jest zadbane, wynajęte i pracuje na Twój zysk. Nie przechowuję pustych lokali — pilnuję ciągłości. Poniżej znajdziesz oferty które aktualnie prowadzę w imieniu właścicieli.', en: 'Every property you entrust to me is cared for, rented out and working for your profit. I keep no empty apartments — I maintain continuity. Below you will find listings I currently manage on behalf of owners.', ua: 'Кожна квартира, яку ви мені довіряєте, доглянута, здана в оренду і приносить вам прибуток. Я не тримаю порожніх квартир — слідкую за безперервністю. Нижче ви знайдете оголошення, якими я зараз керую від імені власників.' },
    'mzk.cta.h3':  { pl: 'Szukasz mieszkania<br>lub pokoju do wynajęcia?', en: 'Looking for an apartment<br>or room to rent?', ua: 'Шукаєте квартиру<br>або кімнату для оренди?' },
    'mzk.cta.p':   { pl: 'Wszystkie aktualne oferty — pokoje studenckie i mieszkania — znajdziesz na osobnej stronie. Tam możesz sprawdzić dostępność, ceny i umówić oglądanie.', en: 'All current listings — student rooms and apartments — are on a separate page. There you can check availability, prices and arrange a viewing.', ua: 'Усі актуальні пропозиції — студентські кімнати та квартири — знаходяться на окремій сторінці. Там ви можете перевірити наявність, ціни та домовитися про огляд.' },
    'mzk.cta.sub': { pl: 'Oferty aktualizowane na bieżąco · Odpowiedź w 24h', en: 'Listings updated daily · Response within 24h', ua: 'Оголошення оновлюються щодня · Відповідь протягом 24 год' },
    'mzk.cta.btn': { pl: 'Zobacz aktualne oferty →', en: 'See current listings →', ua: 'Переглянути актуальні оголошення →' },

    // Services
    'svc.label':   { pl: 'Usługi',  en: 'Services', ua: 'Послуги' },
    'svc.title':   { pl: 'Co dokładnie robię dla właścicieli?', en: 'What exactly do I do for owners?', ua: 'Що саме я роблю для власників?' },
    'svc.desc':    { pl: 'Nie jestem pośrednikiem, który podpisuje umowę i znika. Jestem stałą opiekunką Twojego mieszkania — od momentu przejęcia kluczy, aż do dnia kiedy zdecydujesz się zakończyć współpracę.', en: "I'm not a middleman who signs a contract and disappears. I'm the permanent caretaker of your apartment — from the moment I receive the keys until the day you decide to end our cooperation.", ua: 'Я не посередник, який підписує договір і зникає. Я постійний опікун вашої квартири — з моменту отримання ключів до дня, коли ви вирішите завершити співпрацю.' },
    'svc.badge':   { pl: 'Główna usługa', en: 'Main service', ua: 'Основна послуга' },
    'svc.1.title': { pl: 'Kompleksowe zarządzanie najmem', en: 'Full Property Management', ua: 'Комплексне управління орендою' },
    'svc.1.desc':  { pl: 'Pełna opieka nad mieszkaniem — jeden telefon do mnie zastępuje dziesiątki rozmów z najemcami, hydraulikami i agencjami. Działam na podstawie pełnomocnictwa.', en: 'Full care of the apartment — one call to me replaces dozens of conversations with tenants, plumbers and agencies. I act under power of attorney.', ua: 'Повне обслуговування квартири — один дзвінок мені замінює десятки розмов з орендарями, сантехніками та агенціями. Діюу на підставі доручення.' },
    'svc.1.li1':   { pl: 'Pilnowanie ciągłości najmu i terminów umów', en: 'Ensuring continuous occupancy and contract deadlines', ua: 'Забезпечення безперервності оренди та дотримання термінів договорів' },
    'svc.1.li2':   { pl: 'Podpisywanie umów i aneksów w imieniu właściciela', en: 'Signing contracts and annexes on behalf of the owner', ua: 'Підписання договорів та додатків від імені власника' },
    'svc.1.li3':   { pl: 'Regularny raport ze stanu mieszkania', en: 'Regular reports on the apartment condition', ua: 'Регулярні звіти про стан квартири' },
    'svc.1.li4':   { pl: 'Kontakt z najemcami w każdej sprawie', en: 'Tenant communication on all matters', ua: 'Зв\'язок з орендарями з усіх питань' },
    'svc.2.title': { pl: 'Najem studencki i wynajem pokoi', en: 'Student Rentals & Room Rentals', ua: 'Студентська оренда та оренда кімнат' },
    'svc.2.desc':  { pl: 'Specjalizuję się w wynajmie pokoi dla studentów. Znam rytm roku akademickiego i wiem kiedy szukać nowych lokatorów, żeby mieszkanie nigdy nie stało puste.', en: 'I specialize in renting rooms to students. I know the rhythm of the academic year and know when to look for new tenants so the apartment never stays empty.', ua: 'Я спеціалізуюсь на оренді кімнат студентам. Знаю ритм навчального року і знаю, коли шукати нових мешканців, щоб квартира ніколи не стояла порожньою.' },
    'svc.2.li1':   { pl: 'Rekrutacja studentów i weryfikacja', en: 'Student recruitment and verification', ua: 'Набір та перевірка студентів' },
    'svc.2.li2':   { pl: 'Umowy pokojowe i regulaminy mieszkania', en: 'Room contracts and house rules', ua: 'Договори на кімнату та правила проживання' },
    'svc.2.li3':   { pl: 'Rotacja najemców między latami akademickimi', en: 'Tenant rotation between academic years', ua: 'Ротація орендарів між навчальними роками' },
    'svc.3.title': { pl: 'Obsługa techniczna i interwencje', en: 'Technical Support & Maintenance', ua: 'Технічне обслуговування та втручання' },
    'svc.3.desc':  { pl: 'Usterki zdarzają się zawsze — ważne, żeby ktoś zareagował szybko. Koordynuję fachowców, kontroluję jakość napraw i rozliczam koszty.', en: 'Issues always arise — what matters is that someone reacts quickly. I coordinate specialists, monitor repair quality and settle costs.', ua: 'Несправності трапляються завжди — важливо, щоб хтось відреагував швидко. Координую спеціалістів, контролюю якість ремонту та розраховую витрати.' },
    'svc.3.li1':   { pl: 'Interwencje w ciągu 24 godzin', en: 'Interventions within 24 hours', ua: 'Втручання протягом 24 годин' },
    'svc.3.li2':   { pl: 'Sprawdzona sieć zaufanych fachowców', en: 'Proven network of trusted specialists', ua: 'Перевірена мережа надійних спеціалістів' },
    'svc.3.li3':   { pl: 'Nadzór i kontrola jakości napraw', en: 'Supervision and quality control of repairs', ua: 'Нагляд та контроль якості ремонту' },
    'svc.4.title': { pl: 'Homestaging', en: 'Home Staging', ua: 'Хоумстейджинг' },
    'svc.4.desc':  { pl: 'Dobrze przygotowane mieszkanie wynajmuje się szybciej i za wyższy czynsz. Oferuję pełną usługę home stagingu — aranżację, dekorację i profesjonalną sesję zdjęciową.', en: 'A well-prepared apartment rents faster and at a higher price. I offer full home staging — arrangement, decoration and professional photography.', ua: 'Добре підготовлена квартира здається швидше та за вищою ціною. Пропоную повний хоумстейджинг — планування, декорування та професійну фотосесію.' },
    'svc.5.title': { pl: 'Weryfikacja i dobór najemców', en: 'Tenant Verification & Selection', ua: 'Перевірка та підбір орендарів' },
    'svc.5.desc':  { pl: 'Weryfikuję potencjalnych najemców zanim cokolwiek podpiszę. Sprawdzam dokumenty, referencje i historię najmu. Dobry najemca to spokój na lata.', en: 'I verify potential tenants before signing anything. I check documents, references and rental history. A good tenant means peace of mind for years.', ua: 'Перевіряю потенційних орендарів перед підписанням. Перевіряю документи, рекомендації та історію оренди. Хороший орендар — це спокій на роки.' },
    'svc.6.title': { pl: 'Wynajem pojedynczych mieszkań', en: 'Single Apartment Rental', ua: 'Оренда окремих квартир' },
    'svc.6.desc':  { pl: 'Pomagam wynająć mieszkanie jednej rodzinie lub osobie — z pełną obsługą formalną, profesjonalnym ogłoszeniem i selekcją najemców.', en: 'I help rent an apartment to one family or person — with full formal handling, professional listing and tenant selection.', ua: 'Допомагаю здати квартиру одній родині або особі — з повним оформленням, професійним оголошенням та відбором орендарів.' },

    // About
    'about.label':  { pl: 'O mnie',  en: 'About me', ua: 'Про мене' },
    'about.title':  { pl: 'Jestem Kasia — nie firma, tylko człowiek', en: "I'm Kasia — not a company, just a person", ua: 'Я Кася — не компанія, а людина' },
    'about.p1':     { pl: 'Wiem, jak wiele stresu potrafi dać najem. Zna się na tym każdy właściciel, który choć raz o 22:00 odebrał telefon „bo przestała działać pralka". Dlatego robię to, co robię.', en: 'I know how much stress renting can cause. Every owner who has ever received a call at 10 PM saying "the washing machine stopped working" knows it. That\'s why I do what I do.', ua: 'Я знаю, скільки стресу може завдати оренда. Це знає кожен власник, який хоч раз о 22:00 отримав дзвінок «бо перестала працювати пральна машина». Ось чому я роблю те, що роблю.' },
    'about.p2':     { pl: 'Zarządzam mieszkaniami w Warszawie — z prawdziwą troską, nie na autopilocie. Nie jestem anonimową agencją z infolinią. Masz mój numer, moją uwagę i moją odpowiedzialność.', en: 'I manage apartments in Warsaw — with genuine care, not on autopilot. I\'m not an anonymous agency with a hotline. You have my number, my attention and my accountability.', ua: 'Керую квартирами у Варшаві — з щирою турботою, не на автопілоті. Я не анонімне агентство з гарячою лінією. У вас є мій номер, моя увага та моя відповідальність.' },
    'about.v1.strong': { pl: 'Działam w Twoim imieniu', en: 'I act on your behalf', ua: 'Я дію від вашого імені' },
    'about.v1.p':      { pl: '— mam pełnomocnictwo, podpisuję dokumenty, reprezentuję Cię wobec najemców. Ty możesz być gdziekolwiek.', en: '— I have power of attorney, I sign documents, I represent you to tenants. You can be anywhere.', ua: '— маю доручення, підписую документи, представляю вас перед орендарями. Ви можете бути де завгодно.' },
    'about.v2.strong': { pl: 'Znana twarz w kamienicy', en: 'A familiar face in the building', ua: 'Знайоме обличчя в будинку' },
    'about.v2.p':      { pl: '— najemcy wiedzą, kto się nimi zajmuje. Zaufanie buduje się latami i chroni Twoje mieszkanie.', en: '— tenants know who takes care of them. Trust is built over years and protects your apartment.', ua: '— орендарі знають, хто про них дбає. Довіра будується роками і захищає вашу квартиру.' },
    'about.v3.strong': { pl: 'Specjalistka od rynku studenckiego', en: 'Student market specialist', ua: 'Спеціаліст студентського ринку' },
    'about.v3.p':      { pl: '— znam ten rynek od podszewki. Wiem kiedy szukać, kogo weryfikować i jak unikać problemów.', en: '— I know this market inside out. I know when to look, who to verify and how to avoid problems.', ua: '— знаю цей ринок зсередини. Знаю, коли шукати, кого перевіряти та як уникати проблем.' },
    'about.badge.name':  { pl: 'Katarzyna Zemlik', en: 'Katarzyna Zemlik', ua: 'Катажина Землік' },
    'about.badge.small': { pl: 'KaZem Mieszkania · Warszawa', en: 'KaZem Mieszkania · Warsaw', ua: 'KaZem Mieszkania · Варшава' },

    // Why KaZem
    'why.label': { pl: 'Dlaczego KaZem', en: 'Why KaZem', ua: 'Чому KaZem' },
    'why.title': { pl: 'Co zyskujesz oddając mi klucze?', en: 'What do you gain by handing me the keys?', ua: 'Що ви отримуєте, передаючи мені ключі?' },
    'why.desc':  { pl: 'Spokojna głowa, regularny czynsz i pewność, że ktoś naprawdę patrzy na Twoje mieszkanie.', en: 'Peace of mind, regular rent and the certainty that someone really looks after your apartment.', ua: 'Спокій, регулярна оренда та впевненість, що хтось справді стежить за вашою квартирою.' },
    'why.1.strong': { pl: 'Zero przestojów.',              en: 'Zero downtime.',            ua: 'Нуль простоїв.' },
    'why.1.p':      { pl: 'Pilnuję terminów umów i zaczynam szukać nowych najemców z wyprzedzeniem, zanim poprzedni wyjdzie.', en: 'I monitor contract deadlines and start looking for new tenants in advance, before the previous one leaves.', ua: 'Слідкую за термінами договорів і починаю шукати нових орендарів заздалегідь, ще до того, як попередній з\'їде.' },
    'why.2.strong': { pl: 'Podpisuję wszystko w Twoim imieniu.', en: 'I sign everything on your behalf.', ua: 'Підписую все від вашого імені.' },
    'why.2.p':      { pl: 'Umowy, aneksy, protokoły — nie musisz przyjeżdżać do Warszawy.', en: 'Contracts, annexes, protocols — you don\'t have to come to Warsaw.', ua: 'Договори, додатки, протоколи — вам не потрібно приїжджати до Варшави.' },
    'why.3.strong': { pl: 'Jedna osoba, nie call center.', en: 'One person, not a call centre.', ua: 'Одна людина, не кол-центр.' },
    'why.3.p':      { pl: 'Dzwonisz do mnie i wiesz, z kim rozmawiasz.', en: 'You call me and you know who you\'re talking to.', ua: 'Ви телефонуєте мені і знаєте, з ким розмовляєте.' },
    'why.4.strong': { pl: 'Transparentne rozliczenia.', en: 'Transparent billing.', ua: 'Прозорі розрахунки.' },
    'why.4.p':      { pl: 'Wiesz co, kiedy i za ile. Żadnych ukrytych kosztów.', en: 'You know what, when and for how much. No hidden costs.', ua: 'Знаєте що, коли і за скільки. Жодних прихованих витрат.' },
    'why.5.strong': { pl: 'Sprawdzona sieć fachowców.', en: 'Proven network of specialists.', ua: 'Перевірена мережа спеціалістів.' },
    'why.5.p':      { pl: 'Hydraulik, elektryk, stolarz — reagują szybko i uczciwie wyceniają.', en: 'Plumber, electrician, carpenter — they respond quickly and price honestly.', ua: 'Сантехнік, електрик, тесля — реагують швидко та чесно оцінюють.' },

    // Steps
    'steps.title': { pl: 'Jak zaczynamy?', en: 'How do we start?', ua: 'Як ми починаємо?' },
    'steps.desc':  { pl: 'Od bezpłatnej rozmowy do spokojnego najmu — cztery proste kroki.', en: 'From a free conversation to worry-free rental — four simple steps.', ua: 'Від безкоштовної розмови до спокійної оренди — чотири прості кроки.' },
    'step.1.strong': { pl: 'Bezpłatna konsultacja', en: 'Free consultation', ua: 'Безкоштовна консультація' },
    'step.1.small':  { pl: 'Opowiadasz mi o mieszkaniu. Bez zobowiązań.', en: 'You tell me about your apartment. No obligations.', ua: 'Ви розповідаєте мені про квартиру. Без зобов\'язань.' },
    'step.2.strong': { pl: 'Ocena i ewentualny homestaging', en: 'Assessment and possible home staging', ua: 'Оцінка та можливий хоумстейджинг' },
    'step.2.small':  { pl: 'Przygotowuję mieszkanie, żeby wynajęło się szybko i drogo.', en: 'I prepare the apartment to rent quickly and at a good price.', ua: 'Готую квартиру, щоб вона здалась швидко та за хорошою ціною.' },
    'step.3.strong': { pl: 'Umowa współpracy i pełnomocnictwo', en: 'Cooperation agreement and power of attorney', ua: 'Договір про співпрацю та доручення' },
    'step.3.small':  { pl: 'Wszystko jasno na papierze — warunki, zakres, wynagrodzenie.', en: 'Everything clearly on paper — terms, scope, remuneration.', ua: 'Все чітко на папері — умови, обсяг, винагорода.' },
    'step.4.strong': { pl: 'Oddajesz klucze — my robimy resztę', en: 'You hand over the keys — we do the rest', ua: 'Ви передаєте ключі — ми робимо решту' },
    'step.4.small':  { pl: 'Czynsz trafia do Ciebie co miesiąc.', en: 'Rent comes to you every month.', ua: 'Орендна плата надходить до вас щомісяця.' },

    // Homestaging section
    'staging.label': { pl: 'Homestaging', en: 'Home Staging', ua: 'Хоумстейджинг' },
    'staging.title': { pl: 'Pierwsze zdjęcie to pierwsze wrażenie', en: 'The first photo is the first impression', ua: 'Перше фото — перше враження' },
    'staging.desc':  { pl: 'Właściciele, którzy inwestują w homestaging, wynajmują mieszkanie szybciej i często uzyskują wyższy czynsz niż zakładali. To nie magia — to dobre przygotowanie.', en: 'Owners who invest in home staging rent their apartment faster and often achieve a higher rent than expected. It\'s not magic — it\'s good preparation.', ua: 'Власники, які інвестують у хоумстейджинг, здають квартиру швидше та часто отримують вищу орендну плату, ніж очікували. Це не магія — це хороша підготовка.' },
    'staging.li1':   { pl: 'Wizyta w mieszkaniu i analiza potencjału', en: 'Apartment visit and potential analysis', ua: 'Відвідування квартири та аналіз потенціалу' },
    'staging.li2':   { pl: 'Plan aranżacji i zakup niezbędnych elementów', en: 'Arrangement plan and purchase of necessary items', ua: 'План планування та придбання необхідних елементів' },
    'staging.li3':   { pl: 'Stylizacja i przygotowanie wnętrza do zdjęć', en: 'Styling and preparing the interior for photos', ua: 'Стилізація та підготовка інтер\'єру до фотозйомки' },
    'staging.li4':   { pl: 'Profesjonalna sesja fotograficzna', en: 'Professional photo shoot', ua: 'Професійна фотосесія' },
    'staging.li5':   { pl: 'Przygotowanie ogłoszenia z opisem i zdjęciami', en: 'Preparing a listing with description and photos', ua: 'Підготовка оголошення з описом та фотографіями' },
    'staging.li6':   { pl: 'Publikacja na wszystkich kluczowych portalach', en: 'Publication on all key portals', ua: 'Публікація на всіх ключових порталах' },
    'staging.cta':   { pl: 'Zapytaj o homestaging →', en: 'Ask about home staging →', ua: 'Запитати про хоумстейджинг →' },

    // FAQ
    'faq.label': { pl: 'FAQ', en: 'FAQ', ua: 'Питання та відповіді' },
    'faq.title': { pl: 'Pytania, które słyszę najczęściej', en: 'Questions I hear most often', ua: 'Питання, які я чую найчастіше' },
    'faq.desc':  { pl: 'Zebrałam odpowiedzi na pytania, które zadają właściciele zanim zdecydują się powierzyć mi swoje mieszkanie.', en: "I've gathered answers to questions asked by owners before they decide to entrust me with their apartment.", ua: 'Я зібрала відповіді на запитання, які задають власники, перш ніж вирішити довірити мені свою квартиру.' },
    'faq.cta':   { pl: 'Masz inne pytanie? Napisz →', en: 'Have another question? Write →', ua: 'Маєте інше запитання? Напишіть →' },
    'faq.q1':    { pl: 'Czy muszę przyjeżdżać do Warszawy przy podpisywaniu umów?', en: 'Do I need to come to Warsaw to sign contracts?', ua: 'Чи потрібно мені приїжджати до Варшави для підписання договорів?' },
    'faq.a1':    { pl: 'Nie — działam na podstawie pełnomocnictwa, więc mogę podpisywać umowy, aneksy i wszelkie dokumenty związane z najmem w Twoim imieniu. Możesz mieszkać po drugiej stronie świata.', en: "No — I act under power of attorney, so I can sign contracts, annexes and all rental-related documents on your behalf. You can live on the other side of the world.", ua: 'Ні — я діюю на підставі доручення, тому можу підписувати договори, додатки та всі документи, пов\'язані з орендою, від вашого імені. Ви можете жити на іншому кінці світу.' },
    'faq.q2':    { pl: 'Ile kosztuje zarządzanie najmem w Warszawie?', en: 'How much does property management cost in Warsaw?', ua: 'Скільки коштує управління орендою у Варшаві?' },
    'faq.a2':    { pl: 'Moje wynagrodzenie to zazwyczaj procent od miesięcznego czynszu — dokładna stawka zależy od zakresu usług i liczby lokali. Nie ma ukrytych kosztów. Wszystko ustalamy jasno na początku, zanim cokolwiek podpiszemy.', en: 'My fee is usually a percentage of the monthly rent — the exact rate depends on the scope of services and the number of properties. No hidden costs. We agree everything clearly at the start, before signing anything.', ua: 'Моя винагорода — це зазвичай відсоток від місячної орендної плати — точна ставка залежить від обсягу послуг і кількості об\'єктів. Жодних прихованих витрат. Все обговорюємо чітко на початку, перш ніж щось підписувати.' },
    'faq.q3':    { pl: 'Czy zajmujesz się wyłącznie mieszkaniami studenckimi?', en: 'Do you only deal with student apartments?', ua: 'Чи займаєтеся ви виключно студентськими квартирами?' },
    'faq.a3':    { pl: 'Nie — specjalizuję się w najmie studenckim, ale zajmuję się też kompleksowym zarządzaniem zwykłymi mieszkaniami wynajmowanymi rodzinom lub singlom, oraz wynajmem pojedynczych lokali.', en: "No — I specialize in student rentals, but I also handle full management of regular apartments rented to families or singles, and single-property rentals.", ua: 'Ні — я спеціалізуюсь на студентській оренді, але також займаюсь комплексним управлінням звичайними квартирами, що здаються родинам або одинакам, та орендою окремих об\'єктів.' },
    'faq.q4':    { pl: 'Co się dzieje, gdy najemca przestaje płacić?', en: 'What happens when a tenant stops paying?', ua: 'Що відбувається, коли орендар перестає платити?' },
    'faq.a4':    { pl: 'Reaguję natychmiast — kontaktuję się z najemcą, wysyłam wezwania i wspieram właściciela w podjęciu kroków prawnych. Kluczem jest prewencja: staram się dobierać najemców tak, żeby do takiej sytuacji nie dochodziło.', en: 'I react immediately — I contact the tenant, send notices and support the owner in taking legal steps. Prevention is key: I try to select tenants so that this situation never arises.', ua: 'Реагую негайно — зв\'язуюсь з орендарем, надсилаю попередження та підтримую власника у вжитті правових заходів. Головне — профілактика: намагаюсь підбирати орендарів так, щоб такої ситуації не виникало.' },
    'faq.q5':    { pl: 'Na jakich dzielnicach Warszawy działasz?', en: 'In which Warsaw districts do you operate?', ua: 'У яких районах Варшави ви працюєте?' },
    'faq.a5':    { pl: 'Działam przede wszystkim na Mokotowie, Ursynowie, Woli, Ochocie, w Śródmieściu i na Żoliborzu — ale zasadniczo obsługuję całą Warszawę.', en: 'I operate primarily in Mokotów, Ursynów, Wola, Ochota, Śródmieście and Żoliborz — but I essentially cover all of Warsaw.', ua: 'Працюю переважно на Мокотові, Урсинові, Волі, Охоті, Śródmieście та Жолібожі — але в основному охоплюю всю Варшаву.' },

    // Contact section
    'contact.label':  { pl: 'Kontakt', en: 'Contact', ua: 'Контакт' },
    'contact.title':  { pl: 'Porozmawiajmy o Twoim mieszkaniu', en: "Let's talk about your apartment", ua: 'Поговоримо про вашу квартиру' },
    'contact.desc':   { pl: 'Bezpłatna konsultacja — bez zobowiązań. Opowiedz mi o swoim mieszkaniu, a ja powiem Ci szczerze, co mogę zrobić i ile to kosztuje.', en: 'Free consultation — no obligations. Tell me about your apartment and I\'ll honestly tell you what I can do and what it costs.', ua: 'Безкоштовна консультація — без зобов\'язань. Розкажіть мені про свою квартиру, і я чесно скажу вам, що можу зробити та скільки це коштує.' },
    'contact.phone':  { pl: 'Telefon',          en: 'Phone',          ua: 'Телефон' },
    'contact.area':   { pl: 'Obszar działania', en: 'Service area',   ua: 'Зона обслуговування' },
    'contact.area.v': { pl: 'Warszawa i okolice', en: 'Warsaw and surroundings', ua: 'Варшава та околиці' },
    'contact.f.name': { pl: 'Imię i nazwisko',  en: 'Full name',      ua: 'Ім\'я та прізвище' },
    'contact.f.tel':  { pl: 'Telefon',          en: 'Phone',          ua: 'Телефон' },
    'contact.f.email':{ pl: 'E-mail',           en: 'E-mail',         ua: 'E-mail' },
    'contact.f.what': { pl: 'Czego szukasz?',   en: 'What are you looking for?', ua: 'Що вас цікавить?' },
    'contact.f.opt1': { pl: 'Zarządzanie najmem',           en: 'Property management',       ua: 'Управління орендою' },
    'contact.f.opt2': { pl: 'Najem studencki / pokoje',     en: 'Student rental / rooms',    ua: 'Студентська оренда / кімнати' },
    'contact.f.opt3': { pl: 'Homestaging',                  en: 'Home staging',              ua: 'Хоумстейджинг' },
    'contact.f.opt4': { pl: 'Wynajem pojedynczego mieszkania', en: 'Single apartment rental', ua: 'Оренда окремої квартири' },
    'contact.f.opt5': { pl: 'Inne',                         en: 'Other',                     ua: 'Інше' },
    'contact.f.msg':  { pl: 'Wiadomość',        en: 'Message',        ua: 'Повідомлення' },
    'contact.f.send': { pl: 'Wyślij wiadomość — odezwę się w ciągu 24h', en: 'Send message — I\'ll reply within 24h', ua: 'Надіслати повідомлення — відповім протягом 24 год' },
    'contact.f.ph.name': { pl: 'Jan Kowalski',  en: 'John Smith',     ua: 'Іван Петренко' },
    'contact.f.ph.msg':  { pl: 'Opisz krótko swoje mieszkanie i czego potrzebujesz...', en: 'Briefly describe your apartment and what you need...', ua: 'Коротко опишіть свою квартиру та що вам потрібно...' },
    'contact.f.sending': { pl: 'Wysyłam…',      en: 'Sending…',       ua: 'Надсилаю…' },
    'contact.f.success': { pl: '✅ Wiadomość wysłana! Odezwę się w ciągu 24h.', en: '✅ Message sent! I\'ll get back to you within 24h.', ua: '✅ Повідомлення надіслано! Відповім протягом 24 год.' },
    'contact.f.error':   { pl: '⚠️ Coś poszło nie tak. Napisz bezpośrednio na kasia@kazemmieszkania.pl', en: '⚠️ Something went wrong. Write directly to kasia@kazemmieszkania.pl', ua: '⚠️ Щось пішло не так. Напишіть безпосередньо на kasia@kazemmieszkania.pl' },
    'contact.f.valid':   { pl: 'Proszę wypełnić imię, telefon i e-mail.', en: 'Please fill in name, phone and e-mail.', ua: 'Будь ласка, заповніть ім\'я, телефон та e-mail.' },

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
    'modal.ask':        { pl: '📞 Zapytaj o tę ofertę', en: '📞 Ask about this listing', ua: '📞 Запитати про це оголошення' },
    'modal.type.label': { pl: 'Czego szukasz?',          en: 'What are you looking for?',   ua: 'Що вас цікавить?' },
    'modal.type.apt':   { pl: '🏠 Mieszkanie',           en: '🏠 Apartment',                ua: '🏠 Квартира' },
    'modal.type.room':  { pl: '🛏 Pokój',                en: '🛏 Room',                     ua: '🛏 Кімната' },
    'modal.type.other': { pl: '💬 Inne',                 en: '💬 Other',                    ua: '💬 Інше' },
    'modal.or':         { pl: 'lub wyślij wiadomość',    en: 'or send a message',            ua: 'або надішліть повідомлення' },
    'modal.name':       { pl: 'Imię',                    en: 'Name',                        ua: 'Ім\'я' },
    'modal.phone':      { pl: 'Telefon',                 en: 'Phone',                       ua: 'Телефон' },
    'modal.email':      { pl: 'E-mail',                  en: 'E-mail',                      ua: 'E-mail' },
    'modal.msg':        { pl: 'Wiadomość',               en: 'Message',                     ua: 'Повідомлення' },
    'modal.send':       { pl: 'Wyślij zapytanie →',      en: 'Send inquiry →',              ua: 'Надіслати запит →' },
    'modal.sending':    { pl: 'Wysyłam…',                en: 'Sending…',                    ua: 'Надсилаю…' },
    'modal.success':    { pl: '✅ Wysłano! Odezwę się wkrótce.', en: '✅ Sent! I\'ll get back to you soon.', ua: '✅ Надіслано! Відповім незабаром.' },
    'modal.error':      { pl: '⚠️ Błąd wysyłki. Zadzwoń: 723 168 200', en: '⚠️ Send error. Call: 723 168 200', ua: '⚠️ Помилка надсилання. Телефонуйте: 723 168 200' },
    'modal.valid':      { pl: 'Proszę podać imię i telefon.', en: 'Please provide name and phone.', ua: 'Будь ласка, вкажіть ім\'я та телефон.' },
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
    'js.avail.from':  { pl: 'Dostępne od:', en: 'Available from:', ua: 'Доступно з:' },
    'js.end':         { pl: 'Koniec umowy:', en: 'Contract end:', ua: 'Кінець договору:' },
    'js.soon.label':  { pl: 'Wkrótce wolne', en: 'Soon available', ua: 'Незабаром вільно' },
    'js.avail.dt':    { pl: 'Dostępne od: ', en: 'Available from: ', ua: 'Доступно з: ' },
    'off.map.find':     { pl: 'Znajdź ofertę na mapie', en: 'Find listing on map', ua: 'Знайти оголошення на карті' },
    'off.map.details':  { pl: 'Zobacz szczegóły →', en: 'View details →',   ua: 'Переглянути →' },
    'off.card.details': { pl: 'Szczegóły',           en: 'Details',          ua: 'Деталі' },
    'js.taken.until':   { pl: 'Zajęte do',           en: 'Taken until',      ua: 'Зайнято до' },


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
    // Atrybuty text
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key, lang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = val;
      } else {
        el.innerHTML = val;
      }
    });
    // Placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-ph'), lang);
    });
    // data-i18n-title (dla przycisków/ikon)
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = t(el.getAttribute('data-i18n-title'), lang);
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
