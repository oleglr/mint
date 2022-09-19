import * as Sentry from '@sentry/nextjs';
import {
  AmplitudeConfigInterface,
  AnalyticsInterface,
  AnalyticsMediatorInterface,
  MixpanelConfigInterface,
  PostHogConfigInterface,
} from '@/analytics/AnalyticsInterface';
import PostHogAnalytics from '@/analytics/implementations/posthog';
import AmplitudeAnalytics from './implementations/amplitude';
import MixpanelAnalytics from './implementations/mixpanel';

export type AnalyticsMediatorConstructorInterface = {
  posthog?: PostHogConfigInterface;
  amplitude?: AmplitudeConfigInterface;
  mixpanel?: MixpanelConfigInterface;
};

export default class AnalyticsMediator implements AnalyticsMediatorInterface {
  analyticsIntegrations: AnalyticsInterface[] = [];

  constructor(analytics?: AnalyticsMediatorConstructorInterface) {
    // Ran first so we can assign the Sentry tags to false when not set.
    const amplitudeEnabled = Boolean(analytics?.amplitude?.apiKey);
    const mixpanelEnabled = Boolean(analytics?.mixpanel?.projectToken);
    const posthogEnabled = Boolean(analytics?.posthog?.apiKey);
    Sentry.setTag('amplitude_enabled', `${amplitudeEnabled}`);
    Sentry.setTag('mixpanelEnabled', `${mixpanelEnabled}`);
    Sentry.setTag('posthog_enabled', `${posthogEnabled}`);

    if (!analytics || Object.keys(analytics).length === 0) {
      return;
    }

    if (posthogEnabled) {
      const posthog = new PostHogAnalytics();
      posthog.init(analytics.posthog!);
      this.analyticsIntegrations.push(posthog);
    }

    if (amplitudeEnabled) {
      const amplitude = new AmplitudeAnalytics();
      amplitude.init(analytics.amplitude!);
      this.analyticsIntegrations.push(amplitude);
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
}
