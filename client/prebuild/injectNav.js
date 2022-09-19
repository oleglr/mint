import fs from 'fs-extra';
import { slugToTitle } from './slugToTitle.js';
import matter from 'gray-matter';
import { getOpenApiTitleAndDescription } from './getOpenApiContext.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const desiredMetadata = ['title', 'description', 'sidebarTitle', 'api', 'openapi'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createPage = (path, content, openApiObj) => {
  const slug = path.replace(/\.mdx$/, '');
  let defaultTitle = slugToTitle(slug);
  const fileContents = Buffer.from(content).toString();
  const { data } = matter(fileContents);
  const metadata = {}
  desiredMetadata.forEach((desiredMetaField) => {
    if (typeof data[desiredMetaField] !== 'undefined') {
      metadata[desiredMetaField] = data[desiredMetaField]
    }
  });
  // Append data from OpenAPI if it exists
  const { title } = getOpenApiTitleAndDescription(openApiObj, metadata?.openapi);
  if (title) {
    defaultTitle = title;
  }
  return {
    [slug]: { title: defaultTitle, ...metadata, href: `/${slug}` }
  }
};

export const injectNav = (pages, configObj) => {
  const path = __dirname + `/../src/nav.json`;
  const createNav = (nav) => {
    return {
      group: nav.group,
      pages: nav.pages.map((page) => {
        if (typeof page === 'string') {
          return pages[page]
        }
        
        return createNav(page);
      }),
    }; 
  }

  if (configObj?.navigation == null) {
    return;
  }
  let navFile = configObj.navigation.map((nav) => createNav(nav));
  navFile = navFile.map((navGroup) => {
    const newPages = []
    navGroup.pages.forEach((page) => {
      if (page == null) {
        return;
      }
      newPages.push(page);
    })
    return {
      ...navGroup,
      pages: newPages
    }
  })
  fs.outputFileSync(path, JSON.stringify(navFile, null, 2), { flag: 'w' });
  console.log(`⛵️ Navigation generated and injected`);
}