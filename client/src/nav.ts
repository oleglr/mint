import navJSON from './nav.json';

export const documentationNav: Nav[] = navJSON;

export type PageContext = {
  title?: string,
  sidebarTitle?: string,
  description?: string,
  api?: string,
  openapi?: string,
  href?: string,
  group?: string,
  pages?: PageContext[]
}

type Nav = {
  group?: string,
  pages?: PageContext[]
}