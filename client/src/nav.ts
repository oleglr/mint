import navJSON from './nav.json';

export const documentationNav: Groups = navJSON;

export type PageContext = {
  title?: string;
  sidebarTitle?: string;
  description?: string;
  api?: string;
  openapi?: string;
  href?: string;
};

export type Groups = Group[];

export type Group = {
  group: string;
  pages: GroupPage[];
};

export type GroupPage = PageContext | Group;

export const isGroup = (group: GroupPage): group is Group => {
  // Used in if-statements to case GroupPage into either PageContext or Group
  // The return type "group is Group" is the cast
  return group && group.hasOwnProperty('group') && group.hasOwnProperty('pages');
};

export const findPageInGroup = (group: Group, targetHref: string): PageContext => {
  const { pages } = group;
  if (pages == null) {
    return {};
  }
  let targetPage: PageContext = {};
  pages.forEach((page) => {
    const actualPage = page as PageContext;
    const subGroup = page as Group;
    if (actualPage?.href === targetHref) {
      targetPage = actualPage;
    } else if (subGroup?.group && subGroup?.pages) {
      const resultInSubGroup = findPageInGroup(subGroup, targetHref);
      if (resultInSubGroup != null) {
        targetPage = resultInSubGroup;
      }
    }
  });
  return targetPage;
};
