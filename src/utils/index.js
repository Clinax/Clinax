import { URL_REGEX } from "../modules/regex";

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
