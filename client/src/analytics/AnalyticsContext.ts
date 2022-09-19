import { createContext } from 'react';
import { AnalyticsMediatorInterface } from './AnalyticsInterface';

const AnalyticsContext = createContext({} as AnalyticsMediatorInterface);
export default AnalyticsContext;
