import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { S3, config as awsConfig } from 'aws-sdk';
import { getCookies, verifySession, withCors } from '../helpers'
import { S3fileBucketName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const s3 = new S3({})
    const sessionId = getCookies(event).sessionId
    const ownerHash = await verifySession(sessionId)

    try {
        if (!sessionId) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { fileArray, mime } = JSON.parse(event.body)

        if (!mime.match(/image/)) {
            return withCors({
                statusCode: 400,
                body: JSON.stringify({ message: "The file is not of an image type" })
            })
        }

        const buffer = Buffer.from(fileArray)

        await s3.putObject({
            Bucket: S3fileBucketName,
            Key: `${ownerHash}/avatar`,
            Body: buffer,
            ContentType: mime
        }).promise()

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success' })
        })
    }
    catch (e) {
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: 'Something went horribly wrong',
                data: e
            })
        })
    }
}
