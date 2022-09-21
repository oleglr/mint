#! /usr/bin/env node

import axios from "axios";
import { writeFileSync } from "fs";
import inquirer from "inquirer";
import minimistLite from "minimist-lite";
import { MintConfig } from "./templates.js";
import { scrapePage } from "./scraping/scrapePage.js";
import { scrapeSection } from "./scraping/scrapeSection.js";
import { createPage, toFilename, getOrigin } from "./util.js";
import { scrapeDocusaurusPage } from "./scraping/site-scrapers/scrapeDocusaurusPage.js";
import { scrapeDocusaurusSection } from "./scraping/site-scrapers/scrapeDocusaurusSection.js";
import { scrapeGitBookPage } from "./scraping/site-scrapers/scrapeGitBookPage.js";
import { scrapeGitBookSection } from "./scraping/site-scrapers/scrapeGitBookSection.js";
import { scrapeReadMePage } from "./scraping/site-scrapers/scrapeReadMePage.js";
import { scrapeReadMeSection } from "./scraping/site-scrapers/scrapeReadMeSection.js";
import { detectFramework, Frameworks } from "./scraping/detectFramework.js";

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

function validateFramework(framework) {
  if (!framework) {
    console.log(
      "Could not detect the framework automatically. Please use one of:"
    );
    console.log("scrape-page-docusaurus");
    console.log("scrape-page-gitbook");
    console.log("scrape-page-readme");
    return process.exit(1);
  }
}

async function scrapePageAutomatically() {
  const href = argv._[1];
  const res = await axios.default.get(href);
  const html = res.data;
  const framework = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapePageWrapper(scrapeDocusaurusPage);
  } else if (framework === Frameworks.GITBOOK) {
    await scrapePageWrapper(scrapeGitBookPage);
  } else if (framework === Frameworks.README) {
    await scrapePageWrapper(scrapeReadMePage);
  }
}

async function scrapePageWrapper(scrapeFunc) {
  const href = argv._[1];
  const res = await axios.default.get(href);
  const html = res.data;
  await scrapePage(scrapeFunc, href, html, argv.overwrite);
  process.exit(1);
}

if (command === "scrape-page") {
  await scrapePageAutomatically();
}

if (command === "scrape-docusaurus-page") {
  await scrapePageWrapper(scrapeDocusaurusPage);
}

if (command === "scrape-gitbook-page") {
  await scrapePageWrapper(scrapeGitBookPage);
}

if (command === "scrape-readme-page") {
  await scrapePageWrapper(scrapeReadMePage);
}

async function scrapeSectionAutomatically() {
  const href = argv._[1];
  const res = await axios.default.get(href);
  const html = res.data;
  const framework = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapeSectionWrapper(scrapeDocusaurusSection);
  } else if (framework === Frameworks.GITBOOK) {
    await scrapeSectionWrapper(scrapeGitBookSection);
  } else if (framework === Frameworks.README) {
    await scrapeSectionWrapper(scrapeReadMeSection);
  }
}

async function scrapeSectionWrapper(scrapeFunc: any) {
  const href = argv._[1];
  const res = await axios.default.get(href);
  const html = res.data;
  await scrapeSection(scrapeFunc, html, getOrigin(href), argv.overwrite);
  process.exit(1);
}

if (command === "scrape-section") {
  await scrapeSectionAutomatically();
}

if (command === "scrape-docusaurus-section") {
  await scrapeSectionWrapper(scrapeDocusaurusSection);
}

if (command === "scrape-gitbook-section") {
  await scrapeSectionWrapper(scrapeGitBookSection);
}

if (command === "scrape-readme-section") {
  await scrapeSectionWrapper(scrapeReadMeSection);
}
