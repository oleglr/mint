import * as Sentry from '@sentry/nextjs';
import {
  AmplitudeConfigInterface,
  AbstractAnalyticsImplementation,
  AnalyticsMediatorInterface,
  FathomConfigInterface,
  HotjarConfigInterface,
  MixpanelConfigInterface,
  PostHogConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';
import PostHogAnalytics from '@/analytics/implementations/posthog';
import AmplitudeAnalytics from './implementations/amplitude';
import MixpanelAnalytics from './implementations/mixpanel';
import FathomAnalytics from './implementations/fathom';
import HotjarAnalytics from './implementations/hotjar';

export type AnalyticsMediatorConstructorInterface = {
  amplitude?: AmplitudeConfigInterface;
  fathom?: FathomConfigInterface;
  hotjar?: HotjarConfigInterface;
  mixpanel?: MixpanelConfigInterface;
  posthog?: PostHogConfigInterface;
};

export default class AnalyticsMediator implements AnalyticsMediatorInterface {
  analyticsIntegrations: AbstractAnalyticsImplementation[] = [];

  constructor(analytics?: AnalyticsMediatorConstructorInterface) {
    // Ran first so we can assign the Sentry tags to false when not set.
    const amplitudeEnabled = Boolean(analytics?.amplitude?.apiKey);
    const fathomEnabled = Boolean(analytics?.fathom?.siteId);
    const hotjarEnabled = Boolean(analytics?.hotjar?.hjid && analytics?.hotjar?.hjsv);
    const mixpanelEnabled = Boolean(analytics?.mixpanel?.projectToken);
    const posthogEnabled = Boolean(analytics?.posthog?.apiKey);
    Sentry.setTag('amplitude_enabled', `${amplitudeEnabled}`);
    Sentry.setTag('fathom_enabled', `${fathomEnabled}`);
    Sentry.setTag('hotjar_enabled', `${hotjarEnabled}`);
    Sentry.setTag('mixpanel_enabled', `${mixpanelEnabled}`);
    Sentry.setTag('posthog_enabled', `${posthogEnabled}`);

    if (!analytics || Object.keys(analytics).length === 0) {
      return;
    }

    if (amplitudeEnabled) {
      const amplitude = new AmplitudeAnalytics();
      amplitude.init(analytics.amplitude!);
      this.analyticsIntegrations.push(amplitude);
    }

    if (fathomEnabled) {
      const fathom = new FathomAnalytics();
      fathom.init(analytics.fathom!);
      this.analyticsIntegrations.push(fathom);
    }

    if (hotjarEnabled) {
      const hotjar = new HotjarAnalytics();
      hotjar.init(analytics.hotjar!);
      this.analyticsIntegrations.push(hotjar);
    }

    if (posthogEnabled) {
      const posthog = new PostHogAnalytics();
      posthog.init(analytics.posthog!);
      this.analyticsIntegrations.push(posthog);
    }

    if (mixpanelEnabled) {
      const mixpanel = new MixpanelAnalytics();
      mixpanel.init(analytics.mixpanel!);
      this.analyticsIntegrations.push(mixpanel);
    }
  }

  createEventListener(eventName: string) {
    const listeners = this.analyticsIntegrations.map((integration) =>
      integration.createEventListener(eventName)
    );
    return async function (eventConfig: object) {
      listeners.forEach((listener) => listener(eventConfig));
    };
  }

  onRouteChange(url: string, routeProps: any) {
    this.analyticsIntegrations.forEach((integration) => integration.onRouteChange(url, routeProps));
  }
}
