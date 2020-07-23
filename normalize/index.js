const { cloneDeep } = require("lodash");

const normalize = (payload) => (manifest) => (OS) => {
  const modifiedPayload = cloneDeep(payload);
  console.log("extra", manifest.extra);
  const normalizedFiles = getUrl({ exp: manifest });
  const url = normalizedFiles[OS].sourceUrl;

  const adjStackTrace = (() => {
    if (OS === "android") {
      return modifiedPayload.Details.Error.StackString.split("\n").map(
        (ln, i) => {
          if (!ln) return;
          if (ln.match("native code")) {
            return {
              ClassName: "Native code error",
              ColumnNumber: null,
              FileName: url,
              LineNumber: null,
              MethodName: ln.split("@")[0],
            };
          }
          const splitLine = ln.split(":");
          const [line, column] = splitLine.slice(splitLine.length - 2);
          return {
            ClassName: `line ${line}, column ${column}`,
            ColumnNumber: column,
            FileName: url,
            LineNumber: line,
            MethodName: ln.split("@")[0],
          };
        }
      );
    }

    if (OS === "ios") {
      return modifiedPayload.Details.Error.StackTrace.map((line) => ({
        ...line,
        FileName: url,
      }));
    }
  })();

  modifiedPayload.Details.Error.StackTrace = adjStackTrace;

  return modifiedPayload;
};

const getUrl = ({ exp }) => {
  try {
    if (!exp.extra || !exp.extra.normalizedUrl)
      if (!normalizedUrl)
        throw new Error(
          "expo-raygun-sourcemaps: normalizedUrl is not set properly in app.json (app.extra.normalizedUrl)"
        );

    const { version, extra } = exp;
    const { normalizedUrl, fileNames } = extra;

    const appendVersion = /\d+\.\d+\.\d+/.test(version);
    const envString = appendVersion ? `-${version}` : "-dev";

    const iosName = `https://ios${envString}.${normalizedUrl}`;
    const andName = `https://android${envString}.${normalizedUrl}`;

    const { android = "index.android.bundle", ios = "main.jsbundle" } =
      fileNames || {};

    return {
      ios: {
        sourceUrl: `${iosName}/${ios}`,
        mapUrl: `${iosName}/${ios}.map`,
        source: ios,
        map: `${ios}.map`,
      },
      android: {
        sourceUrl: `${andName}/${android}`,
        mapUrl: `${andName}/${android}.map`,
        source: android,
        map: `${android}.map`,
      },
    };
  } catch (e) {
    console.log(`expo-raygun-sourcemaps:`, e.message);
    return {
      ios: {},
      android: {},
    };
  }
};

module.exports.normalize = normalize;
module.exports.getUrl = getUrl;
