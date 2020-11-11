import * as fs from 'fs';
import * as path from 'path';

const CURRENT_DIR = path.resolve(__dirname, './');

const BACKEND_SRC_DIR = path.resolve(__dirname, '../src/backend');
fs.copyFileSync(`${CURRENT_DIR}/tsconfig.backend.json`, `${BACKEND_SRC_DIR}/tsconfig.json`);
fs.renameSync(`${BACKEND_SRC_DIR}/backend-api.js`, `${BACKEND_SRC_DIR}/backend-api.jsw`);
fs.renameSync(`${BACKEND_SRC_DIR}/data-hooks.js`, `${BACKEND_SRC_DIR}/data.js`);

const PUBLIC_SRC_DIR = path.resolve(__dirname, '../src/public');
fs.copyFileSync(`${CURRENT_DIR}/tsconfig.public.json`, `${PUBLIC_SRC_DIR}/tsconfig.json`);

// const PAGES_SRC_DIR = path.resolve(__dirname, '../src/pages');
// fs.copyFileSync(`${CURRENT_DIR}/tsconfig.pages.json`, `${PAGES_SRC_DIR}/tsconfig.json`);
