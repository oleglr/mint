import '../css/fonts.css';
import '../css/main.css';
import 'focus-visible';
import { useState, useEffect, Fragment } from 'react';
import { Header } from '@/ui/Header';
import { Title } from '@/ui/Title';
import Router from 'next/router';
import ProgressBar from '@badrap/bar-of-progress';
import Head from 'next/head';
import { ResizeObserver } from '@juggle/resize-observer';
import 'intersection-observer';
import { SearchProvider } from '@/ui/Search';
import { config } from '@/config';
import '@/utils/fontAwesome';
import getAnalyticsConfig from '@/utils/getAnalyticsConfig';
import AnalyticsMediator from '@/analytics/AnalyticsMediator';
import AnalyticsContext from '@/analytics/AnalyticsContext';
import FakeAnalyticsMediator from '@/analytics/FakeAnalyticsMediator';
import { AnalyticsMediatorInterface } from '@/analytics/AnalyticsInterface';
import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import { documentationNav, findPageInGroup } from '@/nav';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}

const progress = new ProgressBar({
  size: 2,
  color: config?.colors?.primary ?? '#0C8C5E',
  className: 'bar-of-progress',
  delay: 100,
});

// this fixes safari jumping to the bottom of the page
// when closing the search modal using the `esc` key
if (typeof window !== 'undefined') {
  progress.start();
  progress.finish();
}

Router.events.on('routeChangeStart', () => progress.start());
Router.events.on('routeChangeComplete', () => progress.finish());
Router.events.on('routeChangeError', () => progress.finish());

export default function App(props: any) {
  const { Component, pageProps, router } = props;
  const [initializedAnalyticsMediator, setInitializedAnalyticsMediator] = useState(false);
  const [analyticsMediator, setAnalyticsMediator] = useState<AnalyticsMediatorInterface>(
    new FakeAnalyticsMediator()
  );

  // AnalyticsMediator can only run in the browser
  // We use useEffect because it only runs on render
  useEffect(() => {
    if (!initializedAnalyticsMediator) {
      const newMediator = new AnalyticsMediator(getAnalyticsConfig(config));
      setAnalyticsMediator(newMediator);
      setInitializedAnalyticsMediator(true);
    }
  }, [initializedAnalyticsMediator]);

  let [navIsOpen, setNavIsOpen] = useState(false);

  useEffect(() => {
    if (!navIsOpen) return;
    function handleRouteChange() {
      setNavIsOpen(false);
    }
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [navIsOpen]);

  const Layout = pageProps?.isMdx ? DocumentationLayout : Fragment;

  let page = {}
  documentationNav.forEach((group) => {
    const foundPage = findPageInGroup(group, router.pathname);
    if (foundPage?.title) {
      page = foundPage;
      return;
    }
  });
  const meta = {...pageProps.meta, ...page};
  const description = meta.description || `Documentation for ${config.name}`;
  const layoutProps = { navIsOpen, setNavIsOpen, meta };
  let section = config.navigation?.find((nav) =>
    nav.pages.find((page) => `/${page}` === router.pathname)
  )?.group;

  return (
    <AnalyticsContext.Provider value={analyticsMediator}>
      <Title suffix={config.name}>{meta.sidebarTitle || meta.title}</Title>
      <Head>
        <meta name="description" content={description} />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:site" name="twitter:site" content="@mintlify" />
        <meta key="twitter:description" name="twitter:description" content={description} />
        {/* TODO: Add config data */}
        {/* <meta
          key="twitter:image"
          name="twitter:image"
          content="https://hbdev-vids.hyperbeam.com/meta-image.png"
        />
        <meta key="twitter:creator" name="twitter:creator" content="@hyperbeamapi" />
        <meta
          key="og:url"
          property="og:url"
          content={`https://hyperbeam.dev`}
        /> */}
        {/* <meta
          key="og:image"
          property="og:image"
          content="https://hbdev-vids.hyperbeam.com/meta-image.png"
        /> */}
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={description} />
      </Head>
      <SearchProvider>
        <Header
          hasNav={Boolean(config.navigation?.length)}
          navIsOpen={navIsOpen}
          onNavToggle={(isOpen: boolean) => setNavIsOpen(isOpen)}
          title={meta.title}
          section={section}
        />
        <Layout {...layoutProps}>
          <Component section={section} meta={meta} />
        </Layout>
      </SearchProvider>
    </AnalyticsContext.Provider>
  );
}
