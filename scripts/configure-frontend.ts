import * as del from 'del';
import * as fs from 'fs';
import { difference } from 'lodash';
import * as path from 'path';
import * as copy from 'recursive-copy/lib/copy';

const CURRENT_DIR = path.resolve(__dirname, './');
const DIST_DIR = path.resolve(CURRENT_DIR, '../dist');
const SRC_DIR = path.resolve(CURRENT_DIR, '../src');

async function configureFrontendPublic() {
  const PUBLIC_DIST_DIR = path.resolve(DIST_DIR, './frontend/public');
  const PUBLIC_SRC_DIR = path.resolve(SRC_DIR, './public');

  await del(PUBLIC_SRC_DIR);
  await copy(PUBLIC_DIST_DIR, PUBLIC_SRC_DIR, {filter: ['**/*.js', '!**/*.spec.js']});
  fs.copyFileSync(`${CURRENT_DIR}/tsconfig.public.json`, `${PUBLIC_SRC_DIR}/tsconfig.json`);
}

async function configureFrontendPages() {
  const PAGES_DIST_DIR = path.resolve(DIST_DIR, './frontend/pages');
  const PAGES_SRC_DIR = path.resolve(SRC_DIR, './pages');
  await configurePages(PAGES_DIST_DIR, PAGES_SRC_DIR);
}

async function configureFrontendLightboxes() {
  const PAGES_DIST_DIR = path.resolve(DIST_DIR, './frontend/lightboxes');
  const PAGES_SRC_DIR = path.resolve(SRC_DIR, './lightboxes');
  await configurePages(PAGES_DIST_DIR, PAGES_SRC_DIR);
}

async function configurePages(distDir: string, srcDir: string) {
  const typescriptPages = fs.readdirSync(distDir)
    .filter(file => !file.endsWith('.spec.js'))
    .map(file => file.split('.js')[0]);
  const corvidPagesDirectories =
    fs.readdirSync(srcDir, {withFileTypes: true})
      .filter((file) => file.isDirectory())
      .map((directory) => directory.name);

  const pagesToCopy = corvidPagesDirectories
    .map((directory) => {
      const page = directory.split('.')[0];
      if (page && typescriptPages.includes(page)) {
        return [page, directory];
      }
    })
    .filter(Boolean);

  if (typescriptPages.length !== pagesToCopy.length) {
    const missingPages = difference(
      typescriptPages,
      pagesToCopy.map(([page]) => page),
    );
    throw new Error(`Typescript pages did not match source pages: ${missingPages}`);
  }

  pagesToCopy.forEach(([page, directory]) => {
    fs.copyFileSync(`${distDir}/${page}.js`, `${srcDir}/${directory}/${page}.js`);
  });

}

Promise.all([
  configureFrontendPublic(),
  configureFrontendPages(),
  // configureFrontendLightboxes(), unused
]).then(() => console.log('Done'));
