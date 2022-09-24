import { SidebarLayout } from '@/layouts/SidebarLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Title } from '@/ui/Title';
import { documentationNav } from '@/nav';
import { config } from '@/config';
import { slugToTitle } from '@/utils/slugToTitle';
import { ReactNode } from 'react';

export function DocumentationLayout({
  isMdx,
  navIsOpen,
  setNavIsOpen,
  meta,
  slug,
  children,
}: {
  isMdx: boolean;
  navIsOpen: boolean;
  setNavIsOpen: any;
  meta: any;
  slug?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  if (!isMdx) {
    return <>{children}</>;
  }

  let defaultTitle = null;
  if (slug != null) {
    // TO DO: Fix regression, we are not passing in slug.
    defaultTitle = slugToTitle(slug);
  }
  return (
    <>
      <Title suffix={router.pathname === '/' ? '' : config.name}>
        {meta.sidebarTitle || meta.title || defaultTitle}
      </Title>
      <Head>
        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta key="twitter:image" name="twitter:image" content="/img/favicon/favicon-32x32.png" />
      </Head>
      <SidebarLayout nav={documentationNav} navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen}>
        {children}
      </SidebarLayout>
    </>
  );
}
