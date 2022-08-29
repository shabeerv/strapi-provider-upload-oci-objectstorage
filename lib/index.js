'use strict';

const common = require('oci-common');
const os = require('oci-objectstorage');
const { Region } = require('oci-common');
const { readFileSync } = require('fs')
const { Readable } = require('node:stream');

module.exports = {
  
  init(config) {
    const {
      tenancy,
      user,
      fingerprint,
      privateKeyFilePath,
      passphrase,
      region,
      bucket
    } = config;

    const privateKey = readFileSync(privateKeyFilePath).toString('utf-8');

    const provider = new common.SimpleAuthenticationDetailsProvider(
      tenancy,
      user,
      fingerprint,
      privateKey,
      passphrase === 'null' ? null : passphrase,
      Region.fromRegionId(region)
    );

    const client = new os.ObjectStorageClient({ authenticationDetailsProvider: provider });

    const upload = (file, customParams = {}) => {
      return new Promise(async (resolve, reject) => {
        // upload file on OCI Object Storage

        try {
          let itemChunk;

          await file.stream.on('data', chunk => {
            itemChunk = chunk;
          })

          const request = {};
          const response = await client.getNamespace(request);
          const namespace = response.value;

          // const getBucketRequest = {
          //   namespaceName: namespace,
          //   bucketName: bucket
          // }

          // await client.getBucket(getBucketRequest);

          const putObjectRequest = {
            namespaceName: namespace,
            bucketName: bucket,
            putObjectBody: itemChunk || Buffer.from(file.buffer, 'binary'),
            objectName: file.name,
            contentLength: file.size,
            contentType: file.mime,
            ...customParams
          }

          await client.putObject(putObjectRequest);

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
