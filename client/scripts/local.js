import favicons from 'favicons';
import pkg from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import faviconConfig from '../prebuild/faviconConfig.js';
import { promises as _promises } from 'fs';
import { createPage, injectNav } from '../prebuild/injectNav.js';

const { outputFileSync, readFileSync } = pkg;
const { readdir, readFile } = _promises;

const path = process.argv[2] ?? '../docs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFileList = async (dirName, og = dirName) => {
  let files = [];
  const items = await readdir(resolve(dirName), { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
};

const getFiles = async () => {
  const fileList = await getFileList(path);
  const markdownFiles = [];
  const staticFiles = [];
  let config = undefined;
  const promises = [];
  fileList.forEach((filename) => {
    promises.push(
      (async () => {
        const content = await readFile(resolve(filename));
        if (filename.endsWith('mint.config.json')) {
          config = content;
          return;
        }
        const absolutePath = filename.substring(path.length + 1);
        const extension =
          filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
        if (extension && (extension === 'mdx' || extension === 'md' || extension === 'tsx')) {
          markdownFiles.push({
            path: absolutePath,
            content: Buffer.from(content, 'base64'),
          });
          return;
        }
        // every other file
        staticFiles.push({
          path: absolutePath,
          content: Buffer.from(content, 'base64'),
        });
      })()
    );
  });
  await Promise.all(promises);
  return { markdownFiles, staticFiles, config };
};

const injectMarkdownFilesAndNav = (markdownFiles, configObj) => {
  let pages = {};
  markdownFiles.forEach((markdownFile) => {
    const path = __dirname + `/../src/pages/${markdownFile.path}`;
    const page = createPage(markdownFile.path, markdownFile.content, undefined);
    if (page != null) {
      pages = {
        ...pages,
        ...page
      }
    }
    outputFileSync(path, Buffer.from(markdownFile.content), { flag: 'w' });
  });

  console.log(`📄  ${markdownFiles.length} pages injected`);

  injectNav(pages, configObj);
};

const injectStaticFiles = (staticFiles) => {
  staticFiles.forEach((staticFile) => {
    const path = __dirname + `/../public/${staticFile.path}`;
    outputFileSync(path, Buffer.from(staticFile.content), { flag: 'w' });
  });

  console.log(`📄  ${staticFiles.length} static files injected`);
};

const injectConfig = (config) => {
  const path = __dirname + `/../src/config.json`;
  outputFileSync(path, Buffer.from(config), { flag: 'w' });
  console.log('⚙️  Config file set properly');
};

const injectFavicons = async (config) => {
  const buffer = Buffer.from(config);
  const configJSON = JSON.parse(buffer.toString());

  if (configJSON?.favicon == null) return;

  const desiredPath = resolve(__dirname + `/../public/${configJSON.favicon}`);
  const favicon = readFileSync(desiredPath);
  if (favicon == null) return;
  console.log('Generating favicons...');
  favicons(favicon, faviconConfig(config?.name), (err, response) => {
    if (err) {
      console.log(err.message); // Error description e.g. "An unknown error has occurred"
      return;
    }
    response.images.forEach((img) => {
      const path = __dirname + `/../public/favicons/${img.name}`;
      outputFileSync(path, Buffer.from(img.contents), { flag: 'w' });
    });
    response.files.forEach((file) => {
      const path = __dirname + `/../public/favicons/${file.name}`;
      outputFileSync(path, file.contents, { flag: 'w' });
    });
    console.log('Favicons generated');
  });
};

const getAllFilesAndConfig = async () => {
  const { markdownFiles, staticFiles, config } = await getFiles();
  const configObj = JSON.parse(config.toString());
  injectMarkdownFilesAndNav(markdownFiles, configObj);
  injectStaticFiles(staticFiles);
  injectConfig(config);
  injectFavicons(config);
};

(async function () {
  try {
    console.log('🔍  Fetching files');
    await getAllFilesAndConfig();
  } catch (error) {
    console.log(error);
    console.error('⚠️   Error while prebuilding documents');
  }
})();
