import { decompressFromUTF16 } from "lz-string";
import { URL_REGEX } from "@pranavraut033/js-utils/utils/regex";

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function extractURLs(input) {
  const matches = input.match(URL_REGEX);
  let t = input;
  if (matches)
    matches.forEach((match) => {
      t = t.replace(match, `<a href="${match}" target="_blank">${match}</<a>`);
    });
  return t;
}

export function decrypt(data) {
  return JSON.parse(decompressFromUTF16(data));
}
