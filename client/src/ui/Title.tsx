import Head from 'next/head'
import { ReactNode } from 'react'

export function Title({ suffix, children }: { suffix: string, children: ReactNode }) {
  let title = '';
  if (suffix != null) {
    title = suffix;
    if (children != null) {
      title = children + ` - ${title}`
    }
  } else if (children != null) {
    title = children.toString();
  }

  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="og:title" property="og:title" content={title} />
    </Head>
  )
}
