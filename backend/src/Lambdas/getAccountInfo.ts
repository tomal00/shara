import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, accountExists, getAccountInfo, withCors } from '../helpers'
import { config as awsConfig, S3 } from 'aws-sdk';
import { S3fileBucketName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const accountHash = getCookies(event).accountHash

    if (!(await accountExists(accountHash))) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({
                message: 'You are not logged in!'
            })
        })
    }

    try {
        const s3 = new S3()
        const info = await getAccountInfo(accountHash)
        let avatarUrl = null

        try {
            await s3.headObject({
                Bucket: S3fileBucketName,
                Key: `${accountHash}/avatar`
            }).promise();

            avatarUrl = await s3.getSignedUrlPromise('getObject', { Bucket: S3fileBucketName, Key: `${accountHash}/avatar` });
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
