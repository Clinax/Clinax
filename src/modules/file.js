import BMF from "browser-md5-file";

export function fileMD5Hash(file) {
  const bmf = new BMF();

  return new Promise((resolve, reject) => {
    bmf.md5(file, (err, md5) => {
      if (err) reject(err);
      else resolve(md5);
    });
  });
}

/**
 * Get Humman readable size string from
 * size in bytes
 *
 * @param {Number} size Size in byte
 */
export function getSize(size) {
  var units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  var t = size,
    i = 0;
  while (t > 1024) {
    t = t / 1024;
    i++;
  }

  return `${t.toFixed(2)} ${units[i]}`;
}

export function getExtension(fileName) {
  return fileName
    .split(".")
    .reverse()[0]
    .toLowerCase();
}
