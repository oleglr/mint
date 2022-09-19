import { withSentry } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { jsonSyntaxHighlight } from './utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { json } = req.body;
  const highlightedJson = jsonSyntaxHighlight(json);
  return res.send({
    highlightedJson,
  });
}

export default withSentry(handler);
