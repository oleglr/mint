import cheerio from "cheerio";

export enum Frameworks {
  DOCUSAURUS = "DOCUSAURUS",
  GITBOOK = "GITBOOK",
  README = "README",
}

export function detectFramework(html) {
  const $ = cheerio.load(html);
  const docusaurusMeta = $('meta[name="generator"]');

  if (
    docusaurusMeta.length > 0 &&
    docusaurusMeta.attr("content").includes("Docusaurus")
  ) {
    return Frameworks.DOCUSAURUS;
  }

  const isGitBook = $(".gitbook-root").length > 0;
  if (isGitBook) {
    return Frameworks.GITBOOK;
  }

  const isReadMe = $('meta[name="readme-deploy"]').length > 0;
  if (isReadMe) {
    return Frameworks.README;
  }

  return undefined;
}
