import Link from 'next/link';
import isAbsoluteUrl from 'is-absolute-url';
import { useRouter } from 'next/router';
import { createContext, forwardRef, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import clsx from 'clsx';
import { Dialog } from '@headlessui/react';
import { config, Page } from '../config';
import { StyledTopLevelLink, TopLevelLink } from '../ui/TopLevelLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getMethodDotsColor } from '@/utils/brands';
import { extractMethodAndEndpoint } from '@/utils/api';
import { PageContext } from '@/nav';

type SidebarContextType = {
  nav: any;
  navIsOpen: boolean;
  setNavIsOpen: (navIsOpen: boolean) => void;
};

// @ts-ignore
export const SidebarContext = createContext<SidebarContextType>({
  nav: [],
  navIsOpen: false,
  setNavIsOpen: () => {}
});

const NavItem = forwardRef(
  ({ page, isSubpage = false }: { page: PageContext | undefined, isSubpage?: boolean }, ref: any) => {
    const router = useRouter();

    if (page == null) {
      return null;
    }

    if (page.group && page.pages) {
      return <GroupDropdown group={page} />
    }

    const { href, api: pageApi, openapi } = page;

    const isActive = page.href === router.pathname;
    const api = pageApi || openapi;
    const title = page.sidebarTitle || page.title;

    return (
      <li ref={ref}>
        <Link href={href || '/'}>
          <a
            className={clsx('flex border-l -ml-px',
              isActive
                ? 'text-primary border-current font-semibold dark:text-primary-light'
                : 'border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
              isSubpage ? 'pl-7' : 'pl-4'
            )}
          >
            {api && (
              <div
                className={clsx('mt-[0.5rem] mr-2 h-2 w-2 rounded-sm', {
                  'bg-primary dark:bg-primary-light': isActive,
                  [getMethodDotsColor(extractMethodAndEndpoint(api).method)]: !isActive,
                })}
              />
            )}
            <div className="flex-1">{title}</div>
          </a>
        </Link>
      </li>
    );
  }
);

const GroupDropdown = ({ group }: { group: PageContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { group: name, pages } = group;

  if (!name || !pages) {
    return null;
  }

  const onClick = () => {
    if (!isOpen) {
      router.push(pages[0].href || '/');
    }
    setIsOpen(!isOpen)
  }

  return <>
    <span
      className='group flex items-center border-l pl-4 -ml-px cursor-pointer space-x-3 border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
      onClick={onClick}
    >
      <div>{name}</div>
      <svg width="3" height="24" viewBox="0 -9 3 24" className={clsx("text-slate-400 overflow-visible group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500", isOpen && 'rotate-90')}>
        <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
    </span>
    {isOpen && pages.map((subpage) => <NavItem page={subpage} isSubpage />)}
  </>
}

function nearestScrollableContainer(el: any) {
  function isScrollable(el: Element) {
    const style = window.getComputedStyle(el);
    const overflowX = style['overflowX'];
    const overflowY = style['overflowY'];
    const canScrollY = el.clientHeight < el.scrollHeight;
    const canScrollX = el.clientWidth < el.scrollWidth;

    const isScrollableY = canScrollY && (overflowY === 'auto' || overflowY === 'scroll');
    const isScrollableX = canScrollX && (overflowX === 'auto' || overflowX === 'scroll');

    return isScrollableY || isScrollableX;
  }

  while (el && el !== document.body && isScrollable(el) === false) {
    el = el.parentNode || el.host;
  }

  return el;
}

function Nav({ nav, children, mobile = false }: any) {
  const router = useRouter();
  const activeItemRef: any = useRef();
  const previousActiveItemRef: any = useRef();
  const scrollRef: any = useRef();

  let numPages = 0;
  if (nav) {
    nav.forEach((group: { group: string; pages: string[] }) => {
      numPages += group.pages.length;
    });
  }

  useIsomorphicLayoutEffect(() => {
    function updatePreviousRef() {
      previousActiveItemRef.current = activeItemRef.current;
    }

    if (activeItemRef.current) {
      if (activeItemRef.current === previousActiveItemRef.current) {
        updatePreviousRef();
        return;
      }

      updatePreviousRef();

      const scrollable = nearestScrollableContainer(scrollRef.current);

      const scrollRect = scrollable.getBoundingClientRect();
      const activeItemRect = activeItemRef.current.getBoundingClientRect();

      const top = activeItemRef.current.offsetTop;
      const bottom = top - scrollRect.height + activeItemRect.height;

      if (scrollable.scrollTop > top || scrollable.scrollTop < bottom) {
        scrollable.scrollTop = top - scrollRect.height / 2 + activeItemRect.height / 2;
      }
    }
  }, [router.pathname]);

  return (
    <nav ref={scrollRef} id="nav" className="lg:text-sm lg:leading-6 relative">
      <div className="sticky top-0 -ml-0.5 pointer-events-none">
        {!mobile && <div className="h-8 bg-gradient-to-b from-white dark:from-background-dark" />}
      </div>
      <ul>
        {config?.anchors != null && config.anchors.length > 0 && <TopLevelNav mobile={mobile} />}
        {children}
        {nav &&
          numPages > 1 &&
          nav
            .map(({ group, pages }: { group: string; pages: PageContext[] }, i: number) => {
              return (
                <li
                  key={i}
                  className={clsx(
                    {
                      'mt-12 lg:mt-8': !Boolean(i === 0 && (config?.anchors == null || config.anchors?.length === 0))
                    }
                  )}
                >
                  <h5 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                    {group}
                  </h5>
                  <ul
                    className={clsx(
                      'space-y-6 lg:space-y-2 border-l border-slate-100',
                      mobile ? 'dark:border-slate-700' : 'dark:border-slate-800'
                    )}
                  >
                    {pages.map((page, i: number) => {
                      return (
                        <NavItem
                          key={i}
                          page={page}
                        />
                      );
                    })}
                  </ul>
                </li>
              );
            })
            .filter(Boolean)}
      </ul>
    </nav>
  );
}

function TopLevelNav({ mobile }: { mobile: boolean }) {
  let { pathname } = useRouter();
  const isRootAnchorActive =
    pathname.startsWith('/') &&
    !config.anchors?.some((anchor) => pathname.startsWith(`/${anchor.url}`));
  return (
    <>
      <TopLevelLink
        mobile={mobile}
        href="/"
        isActive={isRootAnchorActive}
        className="mb-4"
        shadow="group-hover:shadow-primary-ultralight dark:group-hover:bg-primary"
        activeBackground="bg-primary"
        icon={
          <FontAwesomeIcon
            className={clsx(
              `h-6 w-6 p-1 text-white secondary-opacity group-hover:fill-primary-dark dark:group-hover:text-white`,
              isRootAnchorActive ? 'dark:text-white' : 'dark:text-slate-500'
            )}
            icon={['fad', 'book-open']}
          />
        }
      >
        {config.topAnchor?.name ?? 'Documentation'}
      </TopLevelLink>
      {config?.anchors &&
        config.anchors.filter((anchor) => {
          if (!anchor.isDefaultHidden) {
            return true;
          }

          return pathname.startsWith(`/${anchor.url}`);
        }).map((anchor, i) => {
          const isAbsolute = isAbsoluteUrl(anchor.url);
          let href;
          if (isAbsolute) {
            href = anchor.url;
          } else {
            const firstPage = config.navigation?.find((nav) => {
              return nav.pages.find((page) => {
                // Only work for non-nested navs
                if (typeof page === 'string') {
                  return page.includes(`${anchor.url}/`)
                }

                return false;
              });
            });
            if (firstPage) {
              href = `/${firstPage.pages[0]}`;
            }
          }

          return (
            <StyledTopLevelLink
              i={i}
              key={i}
              mobile={mobile}
              href={href || '/'}
              name={anchor?.name}
              icon={anchor?.icon}
              color={anchor?.color}
              isActive={pathname.startsWith(`/${anchor.url}`)}
            />
          );
        })}
    </>
  );
}

function Wrapper({
  allowOverflow,
  children,
}: {
  allowOverflow: boolean;
  children: React.ReactChild;
}) {
  return <div className={allowOverflow ? undefined : 'overflow-hidden'}>{children}</div>;
}

const checkIfPageIsInDivision = (page: any, divisionUrl?: string): boolean => {
  if (page?.href == null) {
    return false;
  }

  return page.href.startsWith(`/${divisionUrl}/`);
}

export function SidebarLayout({
  children,
  navIsOpen,
  setNavIsOpen,
  nav,
  sidebar,
  layoutProps: { allowOverflow = true } = {},
}: any) {
  const router = useRouter();
  const pathname = router.pathname;
  const currentDivision = config.anchors?.find((anchor) => pathname.startsWith(`/${anchor.url}`));
  let navForDivision = nav.filter(({ pages }: { pages: Page[] }) => {
    return pages.some((page) => checkIfPageIsInDivision(page, currentDivision?.url));
  });

  if (navForDivision.length === 0) {
    const divisions = config.anchors?.filter((anchor) => !isAbsoluteUrl(anchor.url)) || [];
    if (divisions) {
      navForDivision = nav.filter(({ pages }: { pages: Page[] }) => {
        return !pages.some((page) => {
          return divisions.some((division) => checkIfPageIsInDivision(page, division.url));
        });
      });
    } else {
      navForDivision = nav;
    }
  }
  return (
    <SidebarContext.Provider value={{ nav, navIsOpen, setNavIsOpen }}>
      <Wrapper allowOverflow={allowOverflow}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="hidden lg:block fixed z-20 top-[3.8125rem] bottom-0 left-[max(0px,calc(50%-45rem))] right-auto w-[19.5rem] pb-10 px-8 overflow-y-auto">
            <Nav nav={navForDivision}>
              {sidebar}
            </Nav>
          </div>
          <div className="lg:pl-[20rem]">{children}</div>
        </div>
      </Wrapper>
      <Dialog
        as="div"
        open={navIsOpen}
        onClose={() => setNavIsOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto lg:hidden"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
        <div className="relative bg-white w-80 min-h-full max-w-[calc(100%-3rem)] p-6 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setNavIsOpen(false)}
            className="absolute z-10 top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <span className="sr-only">Close navigation</span>
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Nav nav={navForDivision} mobile={true}>
            {sidebar}
          </Nav>
        </div>
      </Dialog>
    </SidebarContext.Provider>
  );
}
