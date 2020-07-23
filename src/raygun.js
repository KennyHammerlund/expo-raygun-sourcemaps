const { Curl } = require("node-libcurl");

module.exports.send = (config, { path, name }) => {
  const { appId, uploadToken } = config;
  if (!appId)
    throw new Error(
      "appId missing in config, this is your raygun appId and needs to be in the app.json. See the readme.MD for more information"
    );
  if (!uploadToken)
    throw new Error(
      "uploadToken missing in config, this is your raygun upload token and needs to be in the app.json. See the readme.MD for more information"
    );
  const curl = new Curl();
  const uploadPath = `https://app.raygun.com/jssymbols/${appId}?authToken=${uploadToken}`;
  curl.setOpt("URL", uploadPath.toString());

  curl.on("end", function (statusCode, dataString, headers) {
    const data = JSON.parse(dataString);

    console.info(
      `expo-raygun-sourcemaps: Raygun upload finished with status: ${data.Status}`
    );
    if (data.Status === "Error") {
      console.warn("expo-raygun-sourcemaps:", data.Message);
    }
    this.close();
  });

  curl.setOpt(Curl.option.HTTPPOST, [
    {
      name: "file",
      file: path,
      type: "text/html",
    },
    { name: "url", contents: name },
  ]);

  curl.on("error", (e) => {
    console.error("expo-raygun-sourcemaps:", e);
    curl.close.bind(curl);
  });
  curl.perform();
};
