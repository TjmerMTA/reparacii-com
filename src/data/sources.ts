// Першоджерела, за якими звірено тексти сайту (див. VERIFIED у pages.ts).
// Факт, якого немає на цих сторінках, на сайт не потрапляє.

export interface Source {
  label: string;
  href: string;
}

export const src = {
  rdSubmit: {
    label: 'Реєстр збитків: «Подати заяву» — перелік категорій і правила',
    href: 'https://rd4u.coe.int/uk/submit-a-claim',
  },
  rdFaq: {
    label: 'Реєстр збитків: поширені запитання, загальні',
    href: 'https://rd4u.coe.int/uk/faq/general',
  },
  rdProcessing: {
    label: 'Реєстр збитків: обробка заяв',
    href: 'https://rd4u.coe.int/uk/claims-processing',
  },
  rdNewsAll: {
    label: 'Реєстр збитків: відкрито всі категорії заяв, 30 вересня 2026',
    href: 'https://rd4u.coe.int/uk/-/%D0%9C%D1%96%D0%B6%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9-%D0%A0%D0%B5%D1%94%D1%81%D1%82%D1%80-%D0%B7%D0%B1%D0%B8%D1%82%D0%BA%D1%96%D0%B2-%D0%B4%D0%BB%D1%8F-%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8-%D0%B2%D1%96%D0%B4%D0%BA%D1%80%D0%B8%D0%B2-',
  },
  rdIndividuals: {
    label: 'Реєстр збитків: категорії для фізичних осіб',
    href: 'https://rd4u.coe.int/uk/for-individuals',
  },
  rdA33: {
    label: 'Реєстр збитків: запитання про категорію A3.3',
    href: 'https://rd4u.coe.int/uk/claims-category-a3.3-loss-of-housing-or-residence',
  },
  rdA33Disclaimer: {
    label: 'Реєстр збитків: застереження та інструкції для категорії A3.3',
    href: 'https://rd4u.coe.int/uk/disclaimer-information-and-instructions-for-the-claimants-for-category-a3.3',
  },
  rdA36: {
    label: 'Реєстр збитків: запитання про категорію A3.6',
    href: 'https://rd4u.coe.int/uk/a3.6-loss-of-access-or-control-of-immovable-property-in-the-temporarily-occupied-territories',
  },
  rdLegalAid: {
    label: 'Реєстр збитків: система надання безоплатної правничої допомоги',
    href: 'https://rd4u.coe.int/uk/free-legal-aid-system',
  },
  rdAssistance: {
    label: 'Реєстр збитків: надавачі допомоги заявникам',
    href: 'https://rd4u.coe.int/uk/claimant-assistance-map',
  },
  diiaMain: {
    label: 'Дія: розділ «Репарації: міжнародний Реєстр збитків»',
    href: 'https://diia.gov.ua/reparatsii-mizhnarodnyi-reiestr-zbytkiv',
  },
  diiaA33: {
    label: 'Дія: послуга «A3.3 Втрата житла або місця проживання»',
    href: 'https://diia.gov.ua/services/zaiava-v-katehorii-a33-vtrata-zhytla-abo-mistsia-prozhyvannia',
  },
  diiaA36: {
    label: 'Дія: послуга «A3.6 Втрата доступу або контролю над нерухомим майном на тимчасово окупованих територіях»',
    href: 'https://diia.gov.ua/services/zaiava-v-katehorii-a36-vtrata-dostupu-abo-kontroliu-nad-nerukhomym-mainom-na-tymchasovo-okupovanykh-terytoriiakh',
  },
  diiaA36Disclaimer: {
    label: 'Дія: застереження та інструкції для заявників у категорії A3.6',
    href: 'https://diia.gov.ua/zasterezhennia-informatsiia-ta-instruktsii-dlia-zaiavnykiv-do-reiestru-zbytkiv-u-katehorii-a36',
  },
  diiaNewsA36: {
    label: 'Дія: новина про відкриття категорії A3.6',
    href: 'https://diia.gov.ua/news/reparatsii-za-vtratu-dostupu-do-nerukhomosti-na-tot-podavaite-zaiavy-do-reiestru-zbytkiv',
  },
} satisfies Record<string, Source>;

/** 21 категорія для фізичних осіб — за сторінкою «Подати заяву» Реєстру. */
export const individualCategories: { code: string; name: string }[] = [
  { code: 'A1.1', name: 'Вимушене внутрішнє переміщення' },
  { code: 'A1.2', name: 'Вимушене переміщення за межі України' },
  { code: 'A2.1', name: 'Смерть близького члена сім’ї' },
  { code: 'A2.2', name: 'Зникнення безвісти близького члена сім’ї' },
  { code: 'A2.3', name: 'Серйозні тілесні ушкодження' },
  { code: 'A2.4', name: 'Сексуальне насильство' },
  {
    code: 'A2.5',
    name: 'Катування або нелюдські чи такі, що принижують гідність, види поводження чи покарання',
  },
  { code: 'A2.6', name: 'Позбавлення свободи' },
  { code: 'A2.7', name: 'Примусова праця або служба' },
  { code: 'A2.8', name: 'Насильницьке переміщення або депортація дітей' },
  { code: 'A2.9', name: 'Насильницьке переміщення або депортація дорослих' },
  {
    code: 'A2.10',
    name: 'Інші порушення міжнародного права прав людини, міжнародного гуманітарного права або законів і звичаїв війни',
  },
  { code: 'A3.1', name: 'Пошкодження або знищення житлового нерухомого майна' },
  { code: 'A3.2', name: 'Пошкодження або знищення нежитлового нерухомого майна' },
  { code: 'A3.3', name: 'Втрата житла або місця проживання' },
  { code: 'A3.4', name: 'Втрата оплачуваної роботи' },
  { code: 'A3.5', name: 'Втрата приватного підприємництва' },
  {
    code: 'A3.6',
    name: 'Втрата доступу або контролю над нерухомим майном на тимчасово окупованих територіях',
  },
  { code: 'A3.7', name: 'Інші економічні втрати' },
  { code: 'A4.1', name: 'Втрата доступу до медичної допомоги' },
  { code: 'A4.2', name: 'Втрата доступу до освіти' },
];
