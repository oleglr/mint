import { AnalyticsMediatorInterface } from './AnalyticsInterface';

export default class FakeAnalyticsMediator implements AnalyticsMediatorInterface {
  createEventListener(_: string) {
    return async function () {};
  }
}
