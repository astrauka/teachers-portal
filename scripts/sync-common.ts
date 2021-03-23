import * as path from 'path';
import { rsync } from './rsync';

const CURRENT_DIR = path.resolve(__dirname, './');
const COMMON_DIR = path.resolve(CURRENT_DIR, '../typescript/common');
const BACKEND_DIR = path.resolve(COMMON_DIR, '../backend/common');
const FRONTEND_DIR = path.resolve(COMMON_DIR, '../frontend/public/common');

async function syncCommon() {
  await rsync(`${COMMON_DIR}/`, BACKEND_DIR);
  await rsync(`${COMMON_DIR}/`, FRONTEND_DIR);
}

syncCommon().then(() => console.log('Sync of "common" done'));
