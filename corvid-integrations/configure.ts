import * as fs from 'fs';
import { difference, partition } from 'lodash';
import * as path from 'path';

const CURRENT_DIR = path.resolve(__dirname, './');

// Backend
const BACKEND_SRC_DIR = path.resolve(__dirname, '../src/backend');
fs.copyFileSync(`${CURRENT_DIR}/tsconfig.backend.json`, `${BACKEND_SRC_DIR}/tsconfig.json`);
fs.renameSync(`${BACKEND_SRC_DIR}/backend-api.js`, `${BACKEND_SRC_DIR}/backend-api.jsw`);
fs.renameSync(`${BACKEND_SRC_DIR}/data-hooks.js`, `${BACKEND_SRC_DIR}/data.js`);

// Frontend public
const PUBLIC_SRC_DIR = path.resolve(__dirname, '../src/public');
fs.copyFileSync(`${CURRENT_DIR}/tsconfig.public.json`, `${PUBLIC_SRC_DIR}/tsconfig.json`);

// Frontend pages
const PAGES_SRC_DIR = path.resolve(__dirname, '../src/pages');
const [corvidPagesDirectories, typescriptPages] = partition(
  fs.readdirSync(PAGES_SRC_DIR, { withFileTypes: true }),
  (file) => file.isDirectory()
).map((files) =>
  files.map((file) => (file.name.endsWith('.js') ? file.name.split('.')[0] : file.name))
);

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
    pagesToCopy.map(([page]) => page)
  );
  throw new Error(`Typescript pages did not match source pages: ${missingPages}`);
}

pagesToCopy.forEach(([page, directory]) => {
  fs.renameSync(`${PAGES_SRC_DIR}/${page}.js`, `${PAGES_SRC_DIR}/${directory}/${page}.js`);
});
