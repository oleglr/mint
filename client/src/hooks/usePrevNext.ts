import { useContext } from 'react';
import { SidebarContext } from '@/layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { PageContext, GroupPage, isGroup } from '@/nav';

const getFirstNonGroupPage = (group?: GroupPage): PageContext | null => {
  if (group == null) {
    return null;
  }

  if (isGroup(group)) {
    return getFirstNonGroupPage(group.pages[0]);
  }

  return group;
};

export function usePrevNext() {
  let router = useRouter();
  let { nav } = useContext(SidebarContext);
  let pages: PageContext[] = nav.reduce(
    (acc: PageContext[], currentGroup: { pages: PageContext[] }) => {
      return acc.concat(...currentGroup.pages);
    },
    []
  );

  let pageIndex = pages.findIndex((page) => page?.href === router.pathname);
  return {
    prev: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex - 1]) : undefined,
    next: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex + 1]) : undefined,
  };
}
