import { _config } from '../config/config.js';

export function conf(key) {
  return eval("process.env." + key + " || _config." + key);
};