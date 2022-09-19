import { DocumentationLayout } from '@/layouts/DocumentationLayout';
import { config } from '@/config';

export default function Index() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: `/${
        (config?.navigation && config.navigation?.length > 0 && config.navigation[0].pages[0]) || ''
      }`,
      permanent: false,
    },
  };
}

Index.layoutProps = {
  meta: {
    title: 'Introduction',
  },
  Layout: DocumentationLayout,
  allowOverflow: false,
};
