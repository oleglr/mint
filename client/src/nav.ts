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

export const findPageInGroup = (group: Nav, targetHref: string): PageContext => {
  const { pages } = group;
  if (pages == null) { return {}; }
  let targetPage = {};
  pages.forEach((page) => {
    if (page.href === targetHref) {
      targetPage = page;
    } else if (page.group) {
      const resultInSubGroup = findPageInGroup(page, targetHref);
      if (resultInSubGroup != null) { targetPage = resultInSubGroup }
    }
  });
  return targetPage;
}