import { hotjar } from 'react-hotjar';
import { AnalyticsInterface, ConfigInterface } from '@/analytics/AnalyticsInterface';

export default class HotjarAnalytics implements AnalyticsInterface {
  initialized = false;

  init(implementationConfig: ConfigInterface) {
    if (implementationConfig?.hjid && implementationConfig?.hjsv && process.env.NODE_ENV === 'production') {
      const hjid = parseInt(implementationConfig.hjid, 10);
      const hjsv = parseInt(implementationConfig.hjsv, 10);
      
      import('react-hotjar')
        .then(({ hotjar }) => {
          hotjar.initialize(hjid, hjsv);
          this.initialized = true;
        })
    }
  }

  createEventListener(eventName: string) {
    if (this.initialized) {
      return async function capture() {
        hotjar.event(eventName);
      };
    }
    return async function doNothing(_: object) {};
  }
}
