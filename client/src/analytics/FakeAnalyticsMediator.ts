import { AnalyticsMediatorInterface } from './AbstractAnalyticsImplementation';

export default class FakeAnalyticsMediator implements AnalyticsMediatorInterface {
  createEventListener(_: string) {
    return async function () {};
  }

  onRouteChange(url: string, routeProps: any) {}
}
