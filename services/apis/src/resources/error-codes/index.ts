/* eslint-disable global-require, import/no-dynamic-require */

import { readdirSync } from 'fs';
import { basename } from 'path';

const index = basename(__filename);

const isJavaScriptFile = (path: string) => path.endsWith('.js') || path.endsWith('.ts');

const errorCodes = readdirSync(__dirname)
  .filter(relativePath => isJavaScriptFile(relativePath) && relativePath !== index)
  .map(relativePath => require(`./${relativePath}`).default);

export default Object.assign.apply(global, [{}, ...errorCodes]);
