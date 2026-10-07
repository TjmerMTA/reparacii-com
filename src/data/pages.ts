// Реєстр сторінок сайту: адреси, підписи для меню, хлібних крихт, блоків
// «Читайте також» і карти сайту. Нову сторінку додавати сюди — тоді вона
// потрапить у sitemap.xml і стане доступною для посилань.

/** Дата останньої звірки текстів із першоджерелами (rd4u.coe.int, diia.gov.ua). */
export const VERIFIED = '2026-10-08';

export interface PageInfo {
  path: string;
  /** Короткий підпис: меню, хлібні крихти. */
  label: string;
  /** Заголовок і опис для карток «Читайте також». */
  title: string;
  teaser: string;
  updated: string;
}

export const pages = {
  home: {
    path: '/',
    label: 'Головна',
    title: 'Центр репараційної допомоги',
    teaser: 'Допомагаємо розібратися з документами та підготувати заяву до Реєстру збитків.',
    updated: VERIFIED,
  },
  howto: {
    path: '/yak-podaty-zaiavu-do-reiestru-zbytkiv/',
    label: 'Як подати заяву',
    title: 'Як подати заяву самостійно',
    teaser: 'Покрокова інструкція: подання через Дію, безкоштовно і без посередників.',
    updated: VERIFIED,
  },
  a33: {
    path: '/a3-3-vtrata-zhytla/',
    label: 'Втрата житла',
    title: 'A3.3 Втрата житла або місця проживання',
    teaser: 'Хто може подати, що вважається місцем проживання, які докази підходять.',
    updated: VERIFIED,
  },
  a36: {
    path: '/a3-6-vtrata-dostupu-do-maina-na-tot/',
    label: 'Майно на ТОТ',
    title: 'A3.6 Втрата доступу до майна на ТОТ',
    teaser: 'Для власників і співвласників нерухомості на тимчасово окупованих територіях.',
    updated: VERIFIED,
  },
  registry: {
    path: '/reiestr-zbytkiv-rd4u/',
    label: 'Про Реєстр',
    title: 'Що таке Реєстр збитків (RD4U)',
    teaser: 'Що робить Реєстр, чому він не призначає виплат і які категорії заяв відкрито.',
    updated: VERIFIED,
  },
  documents: {
    path: '/dokumenty/',
    label: 'Документи',
    title: 'Документи і докази',
    teaser: 'Що підготувати до заяви і як діяти, якщо документів немає.',
    updated: VERIFIED,
  },
  faq: {
    path: '/pytannia/',
    label: 'Питання',
    title: 'Питання та відповіді',
    teaser: 'Про подання, строки, рішення Реєстру і про те, чим ми можемо допомогти.',
    updated: VERIFIED,
  },
  pricing: {
    path: '/posluhy-ta-tsiny/',
    label: 'Ціни',
    title: 'Послуги та ціни',
    teaser: 'Що входить у наш супровід, скільки він коштує і чого ми не робимо.',
    updated: VERIFIED,
  },
  contacts: {
    path: '/kontakty/',
    label: 'Контакти',
    title: 'Контакти',
    teaser: 'Як зв’язатися з нами і хто надає послугу.',
    updated: VERIFIED,
  },
  privacy: {
    path: '/polityka-konfidentsiinosti/',
    label: 'Політика конфіденційності',
    title: 'Політика конфіденційності',
    teaser: 'Які дані ми отримуємо з форми і навіщо.',
    updated: VERIFIED,
  },
} satisfies Record<string, PageInfo>;

export type PageKey = keyof typeof pages;

/** Шапка: шість пунктів, решта — у підвалі. */
export const headerNav: PageKey[] = ['howto', 'a33', 'a36', 'registry', 'faq', 'pricing'];

export const footerNav: { title: string; items: PageKey[] }[] = [
  { title: 'Подання заяви', items: ['howto', 'documents', 'faq'] },
  { title: 'Категорії та Реєстр', items: ['a33', 'a36', 'registry'] },
  { title: 'Сервіс', items: ['pricing', 'contacts', 'privacy'] },
];

/** Сторінки для карти сайту (усі, крім службових). */
export const sitemapPages: PageKey[] = [
  'home',
  'howto',
  'a33',
  'a36',
  'registry',
  'documents',
  'faq',
  'pricing',
  'contacts',
  'privacy',
];

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T12:00:00Z`),
  );
