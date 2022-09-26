import { init as amplitudeInit, track } from '@amplitude/analytics-browser';
import {
  AbstractAnalyticsImplementation,
  ConfigInterface,
} from '@/analytics/AbstractAnalyticsImplementation';

export default class AmplitudeAnalytics extends AbstractAnalyticsImplementation {
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
