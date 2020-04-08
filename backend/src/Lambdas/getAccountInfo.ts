import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, verifySession, getAccountInfo, withCors } from '../helpers'
import { config as awsConfig, S3 } from 'aws-sdk';
import { S3fileBucketName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const sessionId = getCookies(event).sessionId
    const ownerHash = await verifySession(sessionId)

    if (!ownerHash) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({
                message: 'You are not logged in!'
            })
        })
    }

    try {
        const s3 = new S3()
        const info = await getAccountInfo(ownerHash)
        let avatarUrl = null

        try {
            await s3.headObject({
                Bucket: S3fileBucketName,
                Key: `${ownerHash}/avatar`
            }).promise();

            avatarUrl = await s3.getSignedUrlPromise('getObject', { Bucket: S3fileBucketName, Key: `${ownerHash}/avatar` });
        }
        catch (e) { }

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success', data: { ...info, avatarUrl } }),
        })
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
