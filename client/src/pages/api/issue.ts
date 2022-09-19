import { NextApiRequest, NextApiResponse } from 'next';

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path, title } = req.query;
  return res.redirect(
    `https://docs.mintlify.com/api/v1/app/issue/${process.env.NAME}?path=${path}.mdx&title=${title}`
  );
}

export default handler;
