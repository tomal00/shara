import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig, S3 } from 'aws-sdk';
import { withCors, getCookies, verifySession } from '../helpers'
import { S3fileBucketName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event) => {
    const sessionId = getCookies(event).sessionId
    const ownerHash = await verifySession(sessionId)

    if (!ownerHash) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({ message: "You are not logged in!" })
        })
    }

    try {
        const s3 = new S3({ signatureVersion: 'v4', })
        const imageId = `${Date.now()}${Math.floor(Math.random() * 10000)}`

        const { mime } = JSON.parse(event.body)

        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: S3fileBucketName,
            Key: `${ownerHash}/images/${imageId}`,
            Expires: 60,
            ContentType: mime
        })

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success', postUrl: url, imageId })
        })
    }
    catch (e) {
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: 'Something went horribly wrong',
                data: e.message || e
            })
        })
    }
}
