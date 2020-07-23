const fs = require("fs").promises;
const rll = require("read-last-lines");

// for expo-> Raygun sourcemaps the last line of the file needs to be linked to the sourcemap and
// we need to add our normalized url
module.exports.prep = async (filePath, fileInfo = {}) => {
  const linestoRemove = 2;
  const { sourceMapURL, sourceURL } = fileInfo;

  await rll.read(filePath, linestoRemove).then(async (lines) => {
    const to_vanquish = lines.length;
    console.log(to_vanquish);
    const stats = await fs.stat(filePath);
    const result = await fs.truncate(filePath, stats.size - to_vanquish);
  });
  const lineToAdd = `//# sourceURL=${sourceURL}\n//# sourceMappingURL=${sourceMapURL}`;
  return fs.appendFile(filePath, lineToAdd);
};
