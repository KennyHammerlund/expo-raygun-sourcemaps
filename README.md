# expo-raygun-sourcemaps

Post publish hook to upload expo sourcemaps to raygun

This requires a 3rd party Hosting space to hold the sourcemap and minified files, currently only AWS S3 is supported. 

### Usage

Install
`yarn add expo-raygun-sourcemaps`

Create config entry in expo config file (`app.json`)
for more information about creating an aws SAC see https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/

```
{
   expo:{
        "hooks": {
            "postPublish": [
                {
                "file": "expo-raygun-sourcemaps",

                "config": {
                    "uploadToken": <Upload Token Generated in user panel>,
                    "appId": <Raygun App ID>,
                    "awsS3": {
                        "accessKeyId": <AWS AKI>,
                        "secretAccessKey": <AWS SAC>,
                        "bucketName": <AWS BUCKET NAME>
                        }
                    },
                    "fileNames":{ // not required
                        ios: // defaults to main.jsbundle
                        android: // defaults to index.android.bundle
                    }
                }
            ]
        }
    }
}
```
