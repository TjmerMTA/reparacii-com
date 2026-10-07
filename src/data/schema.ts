// Розмітка schema.org (JSON-LD). Усі дані про виконавця — з site.ts.
// Поки там заглушки, вони потрапляють і сюди: сайт закритий noindex, а зняти
// noindex із заглушками не дасть запобіжник у layouts/Base.astro.

import { site } from './site';
import { pages, type PageInfo } from './pages';
import type { FaqGroup } from './faq';

const abs = (path: string) => new URL(path, site.url).href;

export const ORG_ID = abs('/#organization');
export const SITE_ID = abs('/#website');

export function organization() {
  const { executor, contacts } = site;
  return {
    '@type': executor.schemaType,
    '@id': ORG_ID,
    name: site.name,
    legalName: executor.legalName,
    description: 'Приватний сервіс: допомога з підготовкою заяви до Міжнародного реєстру збитків для України.',
    url: abs('/'),
    logo: abs('/favicon.svg'),
    taxID: executor.code,
    address: { '@type': 'PostalAddress', addressCountry: 'UA', streetAddress: executor.address },
    telephone: contacts.phone,
    email: contacts.email,
    areaServed: { '@type': 'Country', name: 'Україна' },
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: abs('/'),
    name: site.name,
    inLanguage: 'uk',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbs(page: PageInfo) {
  const trail = page.path === '/' ? [pages.home] : [pages.home, page];
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(page.path)}#breadcrumbs`,
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: abs(item.path),
    })),
  };
}

export function webPage(page: PageInfo, title: string, description: string, type = 'WebPage') {
  return {
    '@type': type,
    '@id': `${abs(page.path)}#webpage`,
    url: abs(page.path),
    name: title,
    description,
    inLanguage: 'uk',
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    dateModified: page.updated,
    ...(page.path === '/' ? {} : { breadcrumb: { '@id': `${abs(page.path)}#breadcrumbs` } }),
  };
}

export function faqPage(page: PageInfo, groups: FaqGroup[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(page.path)}#faq`,
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
      })),
    ),
  };
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
