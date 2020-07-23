const prepForRaygun = require("./prepForRaygun");
const S3 = require("./upload");
const createLocalFiles = require("./createLocalFiles");
const raygun = require("./raygun");
const normalize = require("../normalize");

module.exports.process = async (options) => {
  const { config, exp } = options || {};
  const { ios, android } = normalize.getUrl({ exp, config });
  console.log(ios, android);
  console.log(
    "%c expo-raygun-sourcemaps: Processing Sourcemaps to raygun",
    `color:#0061aa`
  );

  const {
    iosPath,
    iosMapPath,
    androidPath,
    androidMapPath,
  } = await createLocalFiles.create(options);

  console.log(
    "%c expo-raygun-sourcemaps: Files written to temp storage",
    `color:#0061aa`
  );

  await prepForRaygun.prep(androidPath, {
    sourceMapURL: android.mapUrl,
    sourceURL: android.sourceUrl,
  });

  await prepForRaygun.prep(iosPath, {
    sourceMapURL: ios.mapUrl,
    sourceURL: ios.sourceUrl,
  });

  console.log(
    "%c expo-raygun-sourcemaps: Files preped for upload",
    `color:#0061aa`
  );

  raygun.send(config, { path: iosPath, name: ios.sourceUrl });
  raygun.send(config, { path: iosMapPath, name: ios.mapUrl });
  raygun.send(config, { path: androidPath, name: android.sourceUrl });
  raygun.send(config, { path: androidMapPath, name: android.mapUrl });

  // Upload to S3 if needed
  // const results = await Promise.all([
  //   S3.upload(config, { path: iosPath, name: `${folder}/${ios}` }),
  //   S3.upload(config, { path: iosMapPath, name: `${folder}/${ios}.map` }),
  //   S3.upload(config, { path: androidPath, name: `${folder}/${android}` }),
  //   S3.upload(config, {
  //     path: androidMapPath,
  //     name: `${folder}/${android}.map`,
  //   }),
  // ]);

  // console.log(
  //   "%c expo-raygun-sourcemaps: Files uploaded to S3",
  //   `color:#0061aa`
  // );
};
