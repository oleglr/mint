import { Group, Groups } from '@/nav';

export function getGroupsInDivision(nav: Groups, divisionUrls: string[]) {
  return nav.filter((group: Group) =>
    group.pages.some((page) => divisionUrls.some((url) => checkIfPageIsInDivision(page, url)))
  );
}

export function getGroupsNotInDivision(nav: Groups, divisionUrls: string[]) {
  return nav.filter(
    (group: Group) =>
      !group.pages.some((page) => divisionUrls.some((url) => checkIfPageIsInDivision(page, url)))
  );
}

function checkIfPageIsInDivision(page: any, divisionUrl?: string): boolean {
  if (page?.href == null) {
    return false;
  }

  return page.href.startsWith(`/${divisionUrl}/`);
}
