// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (process.env.VERCEL_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN || 'https://817b9178a3aa4a01b57a91160d3a24bb@o1352345.ingest.sentry.io/6633662',
    tracesSampleRate: 0.05,
    enabled: process.env.VERCEL_ENV === 'production',
  });
}
