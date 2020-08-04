const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const fs = require("fs").promises;
const { getUrl } = require("../normalize");

module.exports.create = async (options) => {
  if (!options) {
    console.log("No options passes from expo. . . Aborting");
    return;
  }
  const { config, projectRoot, exp } = options || {};

  const { ios, android } = getUrl({ exp, config });

  const tmpdir = path.resolve(projectRoot, ".tmp", "raygun");
  //delete existing temp folder
  rimraf.sync(tmpdir);
  //create new temp folder
  mkdirp.sync(tmpdir);

  // somehow things got switched. . .
  const iosBundle = options.androidBundle;
  const iosSourceMap = options.androidSourceMap;
  const androidBundle = options.iosBundle;
  const androidSourceMap = options.iosSourceMap;

  const iosPath = tmpdir + `/${ios.source}`;
  const iosMapPath = tmpdir + `/${ios.map}`;
  const androidPath = tmpdir + `/${android.source}`;
  const androidMapPath = tmpdir + `/${android.map}`;

  try {
    await fs.writeFile(iosPath, iosBundle, "utf-8");
    await fs.writeFile(iosMapPath, iosSourceMap, "utf-8");
    await fs.writeFile(androidPath, androidBundle, "utf-8");
    await fs.writeFile(androidMapPath, androidSourceMap, "utf-8");
  } catch (e) {
    console.log(e);
  }

  return { iosPath, iosMapPath, ios, android, androidPath, androidMapPath };
};
