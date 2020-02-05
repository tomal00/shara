import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { S3, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, withCors } from '../helpers'
import { S3fileBucketName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const s3 = new S3({})
    const hash = getCookies(event).accountHash

    try {
        if (!(await accountExists(hash))) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { fileArray, mime } = JSON.parse(event.body)
        const buffer = Buffer.from(fileArray)

        await s3.putObject({
            Bucket: S3fileBucketName,
            Key: `${hash}/avatar`,
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
