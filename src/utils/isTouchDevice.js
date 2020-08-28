/**
 * Small snippet to check whether the device has touch
 *
 * @see https://stackoverflow.com/a/4819886/6942651
 */
export default () => {
  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  const mq = (query) => window.matchMedia(query).matches;
  if (
    "ontouchstart" in window ||
    // eslint-disable-next-line
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
    ""
  );
  return mq(query);
};
