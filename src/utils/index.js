import { URL_REGEX } from "../modules/regex";
import stc from "string-to-color";

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function extractURLs(input) {
  let matches = input.match(URL_REGEX);
  var t = input;
  if (matches)
    matches.forEach((match) => {
      t = t.replace(
        match,
        '<a href="' + match + '" target="_blank">' + match + "</<a>"
      );
    });
  return t;
}

let colorMap = {};
/**
 *
 * @param {String} text
 */
export const getFromColorMap = (text) =>
  colorMap[text] || (colorMap[text] = stc(text));

/**
 *
 * @param {String} text
 * @param {String} color hex color
 */
export const setInColorMap = (text, color) => (colorMap[text] = color);
