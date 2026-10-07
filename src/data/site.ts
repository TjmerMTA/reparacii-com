// ─────────────────────────────────────────────────────────────────────────────
// Єдине місце для даних сайту, які треба замінити перед запуском.
//
// Усе, що записано в квадратних дужках [ ... ], — ЗАГЛУШКА.
// На сторінці такі значення підсвічуються жовтим пунктиром і позначкою
// «заглушка» (компонент src/components/Stub.astro), тож пропустити їх важко.
//
// Перед запуском: замінити кожне значення в дужках на реальне, додати відгуки
// (якщо є письмова згода клієнтів), підключити форму і лише тоді зняти noindex.
// ─────────────────────────────────────────────────────────────────────────────

export const isStub = (value: string) => /^\[.*\]$/.test(value.trim());

export interface Review {
  author: string;
  text: string;
  /** Письмова згода клієнта на публікацію — без неї відгук не додаємо. */
  consent: true;
}

export interface Price {
  title: string;
  price: string;
  note: string;
}

export const site = {
  name: 'Центр репараційної допомоги',
  tagline: 'приватний сервіс',
  domain: 'reparatsii.com',
  url: 'https://reparatsii.com',

  // Поки true — на кожній сторінці стоїть <meta name="robots" content="noindex, nofollow">.
  // Знімати лише після реальних реквізитів, цін, політики та робочої форми.
  noindex: true,

  // TODO(заглушка): хто надає послугу. Без цього сайт запускати не можна.
  executor: {
    legalName: '[ФОП / ТОВ — повна назва виконавця]',
    code: '[РНОКПП / код ЄДРПОУ]',
    address: '[юридична адреса]',
  },

  // TODO(заглушка): контакти.
  contacts: {
    phone: '[+380 00 000 00 00]',
    email: '[e-mail]',
    telegram: '[Telegram]',
    hours: '[години роботи]',
  },

  // TODO(заглушка): ціни. Перший рядок — правда вже зараз, решта чекає клієнта.
  prices: [
    {
      title: 'Перша консультація',
      price: 'Безкоштовно',
      note: 'Розбираємо ситуацію і чесно кажемо, чи потрібен вам супровід узагалі.',
    },
    {
      title: 'Підготовка документів за однією категорією',
      price: '[ціна, грн]',
      note: '[що входить у послугу]',
    },
    {
      title: 'Супровід до моменту подання',
      price: '[ціна, грн]',
      note: '[що входить у послугу]',
    },
  ] satisfies Price[],

  // Блок «Відгуки» і пункт меню з’являються самі, щойно тут буде хоча б один
  // реальний відгук. Вигадані відгуки не публікуємо.
  reviews: [] as Review[],

  // Форма заявки. Поки endpoint порожній — форма працює в демо-режимі
  // і нічого нікуди не надсилає (див. TODO у src/components/Consult.astro).
  form: {
    endpoint: '',
  },

  links: {
    privacy: '/polityka-konfidentsiinosti/',
    diia: 'https://diia.gov.ua/reparatsii-mizhnarodnyi-reiestr-zbytkiv',
    rd4u: 'https://rd4u.coe.int/uk/',
    rd4uLabel: 'rd4u.coe.int',
    freeLegalAid: 'https://rd4u.coe.int/uk/free-legal-aid-system',
  },

  // Державна система безоплатної правової допомоги — реальний номер, не заглушка.
  freeLegalAidPhone: {
    display: '0 800 213 103',
    href: 'tel:0800213103',
  },
} as const;

export const hasReviews = site.reviews.length > 0;

export const nav = [
  { href: '/#posluhy', label: 'Послуги' },
  { href: '/#etapy', label: 'Етапи роботи' },
  { href: '/#reiestr', label: 'Про Реєстр' },
  { href: '/#tsiny', label: 'Вартість' },
  ...(hasReviews ? [{ href: '/#vidhuky', label: 'Відгуки' }] : []),
];
