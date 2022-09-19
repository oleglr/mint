#! /usr/bin/env node

import path from "path";
import { writeFileSync } from "fs";
import inquirer from "inquirer";
import minimistLite from "minimist-lite";
import { getOrigin } from "./util.js";
import { MintConfig } from "./templates.js";
import { createPage, toFilename, objToReadableString } from "./util.js";
import { scrapeDocusaurusPage } from "./scraping/scrapeDocusaurusPage.js";
import { scrapeDocusaurusSection } from "./scraping/scrapeDocusaurusSection.js";
import { scrapeGitBookPage } from "./scraping/scrapeGitBookPage.js";
import { scrapeGitBookSection } from "./scraping/scrapeGitBookSection.js";
import { scrapeReadMePage } from "./scraping/scrapeReadMePage.js";
import { scrapeReadMeSection } from "./scraping/scrapeReadMeSection.js";

const argv = minimistLite(process.argv.slice(2), {
  boolean: ["overwrite"],
  default: {
    overwrite: false,
  },
});

if (argv._.length === 0) {
  console.error(
    `No command specified. Here are is the list that you can use:\ninit: initialize a Mintlify documentation instance`
  );
  process.exit(1); //an error occurred
}

const command = argv._[0];

if (command === "init") {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the organization?",
      },
      {
        type: "input",
        name: "color",
        message: "What is the primary color of the brand?",
        default: "#3b83f4",
      },
      {
        type: "input",
        name: "ctaName",
        message: "What is the name of the call to action button?",
        default: "Get Started",
      },
      {
        type: "input",
        name: "ctaUrl",
        message: "What is the URL destination of the call to action button?",
        default: "/",
      },
      {
        type: "input",
        name: "title",
        message: "What is the title of the first page?",
        default: "Introduction",
      },
    ])
    .then((answers) => {
      const { name, color, ctaName, ctaUrl, title } = answers;
      writeFileSync(
        "mint.config.json",
        JSON.stringify(
          MintConfig(name, color, ctaName, ctaUrl, toFilename(title)),
          null,
          "\t"
        )
      );
      createPage(title);
      console.log("🌱 Created initial files for Mintlify docs");
      process.exit(1);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

if (command === "page") {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new page?",
      },
      {
        type: "input",
        name: "description",
        message: "What is the description?",
        default: "",
      },
    ])
    .then((answers) => {
      const { title, description } = answers;

      createPage(title, description);
      console.log("🌱 Created initial files for Mintlify docs");
      process.exit(1);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

async function pageScrapeWrapper(
  scrapeFunc: (
    href: string,
    origin: string,
    imageBaseDir?: string
  ) => Promise<any>
) {
  const href = argv._[1];
  const origin = getOrigin(href);
  const imageBaseDir = path.join(process.cwd(), "images");
  const { title, description, markdown } = await scrapeFunc(
    href,
    origin,
    imageBaseDir
  );
  createPage(title, description, markdown, argv.overwrite, process.cwd());
  process.exit(1);
}

if (command === "scrape-docusaurus-page") {
  await pageScrapeWrapper(scrapeDocusaurusPage);
}

if (command === "scrape-gitbook-page") {
  await pageScrapeWrapper(scrapeGitBookPage);
}

if (command === "scrape-readme-page") {
  await pageScrapeWrapper(scrapeReadMePage);
}

async function sectionScrapeWrapper(scrapeFunc) {
  const href = argv._[1];
  console.log(
    `Started scraping${argv.overwrite ? ", overwrite mode is on" : ""}...`
  );
  const groupsConfig = await scrapeFunc(href, process.cwd(), argv.overwrite);
  console.log("Finished scraping.");
  console.log("Add the following to your navigation in mint.config.json:");
  console.log(objToReadableString(groupsConfig));
  process.exit(1);
}

if (command === "scrape-docusaurus-section") {
  await sectionScrapeWrapper(scrapeDocusaurusSection);
}

if (command === "scrape-gitbook-section") {
  await sectionScrapeWrapper(scrapeGitBookSection);
}

if (command === "scrape-readme-section") {
  await sectionScrapeWrapper(scrapeReadMeSection);
}
