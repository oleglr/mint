import { SidebarLayout } from '@/layouts/SidebarLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Title } from '@/ui/Title';
import { documentationNav } from '@/nav';
import { config } from '@/config';
import { slugToTitle } from '@/utils/slugToTitle';

export function DocumentationLayout(props: any) {
  let router = useRouter();
  let defaultTitle = null;
  if (props?.layoutProps?.slug != null) {
    defaultTitle = slugToTitle(props?.layoutProps?.slug);
  }
  return (
    <>
      <Title suffix={router.pathname === '/' ? '' : config.name}>
        {props.meta.sidebarTitle || props.meta.title || defaultTitle}
      </Title>
      <Head>
        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta key="twitter:image" name="twitter:image" content="/img/favicon/favicon-32x32.png" />
      </Head>
      <SidebarLayout nav={documentationNav} {...props} />
    </>
  );
}
