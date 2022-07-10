import fs from 'fs';
import { convertBufferToString } from './convertBufferToString';
import { parse } from './parse';
import { CallbackFunc, OptionLike } from "./Option";
import { I18nStringsFiles } from './types';

export function readFile(file: string, options?: OptionLike, callback?: CallbackFunc) {
  let encoding: string | undefined;
  let wantsComments: boolean | undefined;
  if (typeof callback === 'undefined' && typeof options === 'function') {
    callback = options;
    encoding = undefined;
  } else if (typeof options === 'string') {
    encoding = options;
  } else if (typeof options === 'object') {
    encoding = options['encoding'];
    wantsComments = options['wantsComments'];
  }

  fs.readFile(file, (err, buffer) => {
    if (err) {
      return callback && callback(err, null);
    }
    const str = convertBufferToString(buffer, encoding);
    const data = parse(str, wantsComments);
    callback && callback(null, data);
  });
}

export async function readFileAsync(file: string, options?: OptionLike): Promise<I18nStringsFiles | null> {
  return new Promise<I18nStringsFiles | null>((resolve, reject) => {
    readFile(file, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function readFileSync(file: string, options: OptionLike) {
  let encoding: string | undefined;
  let wantsComments: boolean | undefined;
  if (typeof options === 'string') {
    encoding = options;
  } else if (typeof options === 'object') {
    encoding = options['encoding'];
    wantsComments = options['wantsComments'];
  }

  const buffer = fs.readFileSync(file);
  const str = convertBufferToString(buffer, encoding);
  return parse(str, wantsComments);
}


