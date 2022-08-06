# strapi-provider-upload-oci-objectstorage

---

## Deprecation Warning :warning:
### Install for v3 version of strapi

Minimal or even no effort will be devoted to continue supporting v3 since strapi version 4 is already available.

We recommend you to use strapi v4

If you still plan to use strapi version 3 you can use the following command to install this plugin:
```console
foo@bar:my-strapi-project/$ npm install strapi-provider-upload-oci-objectstorage@1.0.3-v3
```

---

## Install for v4 version of strapi
```console
foo@bar:my-strapi-project/$ npm install strapi-provider-upload-oci-objectstorage@1.0.3-v4
```

## Configurations

For more information on the required parameters visit this link:
[click here](https://docs.oracle.com/en-us/iaas/tools/typescript/2.37.0/classes/_common_lib_auth_auth_.simpleauthenticationdetailsprovider.html#constructor)


Note:
The `privateKey` parameter
has been remplazed  for this plugin by `privateKeyFilePath`

Usage example .env (`privateKeyFilePath`):

(Assuming the file is in the root folder of your strapi project)
```
OCI_PRIVATE_KEY_FILE_PATH='./my_oci_priv_key.pem'
```


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
