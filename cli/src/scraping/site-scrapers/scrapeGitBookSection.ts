import axios from "axios";
import cheerio from "cheerio";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import { getSitemapLinks } from "../getSitemapLinks.js";
import { scrapeGitBookPage } from "./scrapeGitBookPage.js";
import { getOrigin } from "../../util.js";

export async function scrapeGitBookSection(
  html: string,
  origin: string,
  cliDir: string,
  overwrite: boolean
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections
  const navigationSections = $(
    'div[data-testid="page.desktopTableOfContents"] > div > div:first-child'
  )
    .children()
    .eq(1)
    .children()
    .first()
    .children();

  // Get all links per group
  let allNavPathnames = [];
  const groupsConfig = navigationSections
    .map((i, section) => {
      const sectionTitle = $(section)
        .find('div > div[dir="auto"]')
        .first()
        .text();

      const linkPaths = $(section)
        .find("a[href]")
        .map((i, link) => {
          const linkHref = $(link).attr("href");

          // Skip external links until Mintlify supports them
          if (
            linkHref.startsWith("https://") ||
            linkHref.startsWith("http://")
          ) {
            return undefined;
          }

          return linkHref;
        })
        .toArray();

      allNavPathnames = allNavPathnames.concat(linkPaths);

      // Follows the same structure as mint.config.json
      return {
        group: sectionTitle,
        pages: linkPaths,
      };
    })
    .toArray();

  // Scrape every link not in the navigation. Nested docs
  // don't show up in navigation without clicking buttons,
  // so this lets us download the files for the user to add
  // manually to mint.config.json.
  const sitemapPaths = (await getSitemapLinks(new URL("sitemap.xml", origin)))
    .map((sitemapLinks: string) => {
      return new URL(sitemapLinks).pathname;
    })
    .filter((pathname: string) => !allNavPathnames.includes(pathname));

  const sitemapPathnamesForConfig = await Promise.all(
    sitemapPaths.map(
      async (pathname: string) =>
        await scrapeGettingFileNameFromUrl(
          cliDir,
          origin,
          pathname,
          overwrite,
          scrapeGitBookPage
        )
    )
  );

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    groupsConfig.map(async (groupConfig) => {
      groupConfig.pages = await Promise.all(
        groupConfig.pages.map(async (pathname: string) =>
          scrapeGettingFileNameFromUrl(
            cliDir,
            origin,
            pathname,
            overwrite,
            scrapeGitBookPage
          )
        )
      );
      return groupConfig;
    })
  );

  if (sitemapPathnamesForConfig.length > 0) {
    return groupsConfigCleanPaths.concat([
      {
        group:
          "ATTENTION! WE CANNOT DETECT GROUPS FOR NESTED DOCS. PLEASE MOVE THEM INTO THEIR ORIGINAL GROUPS.",
        pages: sitemapPathnamesForConfig,
      },
    ]);
  }

  return groupsConfigCleanPaths;
}
