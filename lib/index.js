'use strict';

const common = require('oci-common');
const os = require('oci-objectstorage');
const { Region } = require('oci-common');
const { readFileSync } = require('fs')
const { UploadManager } = require('../upload-manager')

module.exports = {
  
  init(config) {
    const {
      tenancy,
      user,
      fingerprint,
      privateKeyFilePath,
      privateKeyBase64,
      passphrase,
      region,
      bucket
    } = config;

    let privateKey;
    if(privateKeyFilePath && privateKeyFilePath !== '') {
      privateKey = readFileSync(privateKeyFilePath).toString('utf-8')
    } else if(privateKeyBase64 && privateKeyBase64 !== '') {
      const buff = Buffer.from(privateKeyBase64, 'base64');
      privateKey = buff.toString('utf-8');
    }

    const provider = new common.SimpleAuthenticationDetailsProvider(
      tenancy,
      user,
      fingerprint,
      privateKey,
      (passphrase === '' || passphrase === 'null' || !passphrase) ? null : passphrase,
      Region.fromRegionId(region)
    );

    const client = new os.ObjectStorageClient({ authenticationDetailsProvider: provider });
    const uploadManager = new UploadManager(client);

    const upload = (file, customParams = {}) => {
      return new Promise(async (resolve, reject) => {
        // upload file on OCI Object Storage

        try {
          const request = {};
          const response = await client.getNamespace(request);
          const namespace = response.value;

          const uploadRequest = {
            content: {
              stream: file.stream || Buffer.from(file.buffer)
            },
            requestDetails : {
              namespaceName: namespace,
              bucketName: bucket,
              objectName: file.name,
              contentType: file.mime,
              ...customParams
            }
          }
          
          await uploadManager.upload(uploadRequest);

          const ociUrlFile = `https://objectstorage.${region}.oraclecloud.com/n/${namespace}/b/${bucket}/o/${file.name}`

          // set the bucket file url
          file.url = ociUrlFile;

          resolve();

        } catch (err) {
          return reject(err)
        }
      })
    }

    return {
      uploadStream(file, customConfig = {}) {
        return upload(file, customConfig)
      },
      upload(file, customParams = {}) {
        return upload(file, customParams)
      },
      delete(file, customParams = {}) {
        return new Promise(async (resolve, reject) => {
          try {
            // delete file on OCI Object Storage
            const request = {};
            const response = await client.getNamespace(request);
            const namespace = response.value;

            const getBucketRequest = {
              namespaceName: namespace,
              bucketName: bucket
            }

            await client.getBucket(getBucketRequest);

            const deleteObjectRequest = {
              namespaceName: namespace,
              bucketName: bucket,
              objectName: file.name,
              ...customParams
            }

            await client.deleteObject(deleteObjectRequest);

            resolve();

          } catch (err) {
            return reject(err)
          }
        })
      }
    }

  }
}
