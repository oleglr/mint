import { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  return res.redirect(
    `https://docs.mintlify.com/api/v1/app/suggest/${process.env.NAME}?path=${path}.mdx`
  );
}

export default handler;
