const fs = require('fs');
const path = require('path');

const CURRENT_DIR = path.resolve(__dirname, './');
const BACKEND_SRC_DIR = path.resolve(__dirname, '../src/backend');

fs.copyFileSync(`${CURRENT_DIR}/corvid-tsconfig.json`, `${BACKEND_SRC_DIR}/tsconfig.json`);
fs.renameSync(`${BACKEND_SRC_DIR}/backend-api.js`, `${BACKEND_SRC_DIR}/backend-api.jsw`);
fs.renameSync(`${BACKEND_SRC_DIR}/data-hooks.js`, `${BACKEND_SRC_DIR}/data.js`);
