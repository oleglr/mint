import { createContext } from 'react';
import { AnalyticsMediatorInterface } from './AbstractAnalyticsImplementation';

const AnalyticsContext = createContext({} as AnalyticsMediatorInterface);
export default AnalyticsContext;
