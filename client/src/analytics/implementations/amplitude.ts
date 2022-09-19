import { init as amplitudeInit, track } from '@amplitude/analytics-browser';
import { AnalyticsInterface, ConfigInterface } from '@/analytics/AnalyticsInterface';

export default class AmplitudeAnalytics implements AnalyticsInterface {
  initialized = false;

  init(implementationConfig: ConfigInterface) {
    if (implementationConfig?.apiKey && process.env.NODE_ENV === 'production') {
      amplitudeInit(implementationConfig.apiKey);
      this.initialized = true;
    }
  }

  createEventListener(eventName: string) {
    if (this.initialized) {
      return async function capture(eventProperties: object) {
        track(eventName, eventProperties);
      };
    }
    return async function doNothing(_: object) {};
  }
}
