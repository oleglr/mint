import Router from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { AnalyticsInterface, ConfigInterface } from '@/analytics/AnalyticsInterface';

export default class FathomAnalytics implements AnalyticsInterface {
  initialized = false;
  fathom: any;

  init(implementationConfig: ConfigInterface) {
    if (implementationConfig.siteId && process.env.NODE_ENV === 'production') {
      import('fathom-client')
        .then((_fathom) => {
          if (!this.initialized) {
            // Get default module export
            const fathomLib = _fathom.default;
            fathomLib.load(implementationConfig.siteId!);

            this.initialized = true;
            this.fathom = fathomLib;

            // Track page views
            const handleRouteChange = () => this.fathom.trackPageview();
            Router.events.on('routeChangeComplete', handleRouteChange);
          }

          return this.fathom;
        })
        .catch((e: any) => {
          Sentry.captureException(e);
        });
    }
  }

  createEventListener(eventName: string) {
    // Sept 2022: Fathom tracks goals not custom events. Future versions of Fathom may improve this.
    return async function doNothing(_: object) {};
  }
}
