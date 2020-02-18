import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getFileInfo, withCors, getCookies } from '../helpers'
import { config as awsConfig, S3 } from 'aws-sdk';
import { S3fileBucketName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const { imageId } = event.pathParameters

    try {
        const s3 = new S3()
        const { ownerHash, isPrivate } = await getFileInfo(imageId)

        if (isPrivate) {
            const hash = getCookies(event).accountHash

            if (hash !== ownerHash) {
                return withCors({
                    statusCode: 401,
                    body: JSON.stringify({
                        message: 'This file is private!'
                    })
                })
            }
        }

        const url = await s3.getSignedUrlPromise('getObject', { Bucket: S3fileBucketName, Key: `${ownerHash}/images/${imageId}` });

        return withCors({
            statusCode: 302,
            body: JSON.stringify({ message: 'success' }),
            headers: {
                location: url,
                origin: 'https://shara.pictures'
            },
        });
    }
    catch (e) {
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: `Something went horribly wrong`,
                data: e
            })
        })
    }
}
