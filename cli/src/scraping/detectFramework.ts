import cheerio from "cheerio";

export enum Frameworks {
  DOCUSAURUS = "DOCUSAURUS",
  GITBOOK = "GITBOOK",
  README = "README",
}

export function detectFramework(html) {
  const $ = cheerio.load(html);
  return Frameworks.README;
}
