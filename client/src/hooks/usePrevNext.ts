import { useContext } from 'react';
import { SidebarContext } from '@/layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { PageContext } from '@/nav';

const getFirstNonGroupPage = (page?: PageContext): PageContext | null => {
  if (page == null) {
    return null;
  }

  if (page.pages) {
    return getFirstNonGroupPage(page.pages[0])
  }
  return page
}

export function usePrevNext() {
  let router = useRouter();
  let { nav } = useContext(SidebarContext);
  let pages: PageContext[] = nav.reduce((acc: PageContext[], currentGroup: { pages: PageContext[] }) => {
    return acc.concat(...currentGroup.pages);
  }, []);

  let pageIndex = pages.findIndex((page) => page?.href === router.pathname);
  return {
    prev: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex - 1]) : undefined,
    next: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex + 1]) : undefined,
  };
}
