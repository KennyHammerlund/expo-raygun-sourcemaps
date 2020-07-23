# expo-raygun-sourcemaps

Post publish hook to upload expo sourcemaps to raygun

once installed and published sourcemaps can be found https://app.raygun.com/settings/<APPID>/jssymbols

This will overwrite sourcemaps with the same version number in raygun. If you have 1.1.1 and publish 1.1.1 again with new code the sourcemaps may be off. Make sure you bump your patch versions. Also any sourcemap with a version that does not match `/\d+\.\d+\.\d+/` will be written as `-dev` to support CI/CD pipleline dev versioning

### Usage

Install
`yarn add expo-raygun-sourcemaps`

Add the following to your `app.json` or wherever the expo manifist is for your project

```
"expo":{
    "extra": {
        "normalizedUrl": <pick a url: example.com>
    },
    "hooks": {
        "postPublish": [
        {
            "file": "expo-raygun-sourcemaps",
            "config": {
                "uploadToken": <Raygun Upload token: found in raygun user accounts >,
                "appId": <Raygun App ID>
            }
        }
        ]
    }
}
```

You will need to modify the payload sent to raygun. We do this with a function that is exported from the package.

add the following to where you initialize `rg4js`

```
import { normalize } from 'expo-raygun-sourcemaps/normalize';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const { manifest } = Constants;
const { OS } = Platform;

rg4js('onBeforeSend', (payload) => normalize(modifiedPayload)(manifest)(OS)

```

