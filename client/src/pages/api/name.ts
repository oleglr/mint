import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

function handler(_: NextApiRequest, res: NextApiResponse) {
  return res.status(200).send(process.env.NAME);
}

export default withSentry(handler);
