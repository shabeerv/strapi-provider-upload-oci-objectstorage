# strapi-provider-upload-oci-objectstorage

---

## Install for v4 version of strapi
```console
npm install strapi-provider-upload-oci-objectstorage
```

---

## Install for v3 version of strapi
### Deprecation Warning :warning:

Minimal or even no effort will be devoted to continue supporting v3 since strapi version 4 is already available.

We recommend you to use strapi v4

If you still plan to use strapi version 3 you can use the following command to install this plugin:
```console
npm install strapi-provider-upload-oci-objectstorage@1.0.3-v3
```

---

## Configurations

For more information on the required parameters visit this link:
[click here](https://docs.oracle.com/en-us/iaas/tools/typescript/2.37.0/classes/_common_lib_auth_auth_.simpleauthenticationdetailsprovider.html#constructor)

---
To authenticate you require an ssh key that you can obtain or configure in your oracle cloud

You can use your ssh key in base64 or in a file indicating the path as explained below

Note:
The `privateKey` parameter
has been remplazed  for this plugin by `privateKeyFilePath` or `privateKeyBase64`

.env (`privateKeyFilePath`) Usage example:

(Assuming the file is in the root folder of your strapi project)
```
OCI_PRIVATE_KEY_FILE_PATH='./my_oci_priv_key.pem'
```


or transform your ssh key text to base64 code for place value in one line into env variable


```
OCI_PRIVATE_KEY_BASE64='my_base64_code_in_oneline'
```

You can transform your ssh key file into base64 code with this unix command:
```
cat my_oci_priv_key.pem | openssl base64 | tr -d '\n'
```
Output value will be your ssh key in base64

Now you will be able to set your oracle cloud ssh key in your production environments like heroku in one line for this strapi provider 

---

See the [using a provider](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#environment-variables) for setting and using environment variables in your configs.


**Example**

### for Strapi V4

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'strapi-provider-upload-oci-objectstorage',
      providerOptions: {
        tenancy: env('OCI_TENANCY_ID'),
        user: env('OCI_USER_ID'),
        fingerprint: env('OCI_FINGERPRINT'),
        privateKeyFilePath: env('OCI_PRIVATE_KEY_FILE_PATH'),
        privateKeyBase64: env('OCI_PRIVATE_KEY_BASE64'),
        passphrase: env('OCI_PASSPHRASE'),
        region: env('OCI_REGION'),
        bucket: env('OCI_BUCKET')
      },
      actionOptions: {
        upload: {},
        delete: {}
      },
    }
  },
  // ...
});
```

### for Strapi V3

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: 'oci-objectstorage',
    providerOptions: {
      tenancy: env('OCI_TENANCY_ID'),
      user: env('OCI_USER_ID'),
      fingerprint: env('OCI_FINGERPRINT'),
      privateKeyFilePath: env('OCI_PRIVATE_KEY_FILE_PATH'),
      passphrase: env('OCI_PASSPHRASE'),
      region: env('OCI_REGION'),
      bucket: env('OCI_BUCKET')
    },
  },
  // ...
});
```
