import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getFileInfo, withCors } from '../helpers'
import { config as awsConfig, S3 } from 'aws-sdk';

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const { imageId } = event.pathParameters

    try {
        const s3 = new S3()
        const { ownerHash } = await getFileInfo(imageId)

        const url = await s3.getSignedUrlPromise('getObject', { Bucket: 'screenshot-app-files', Key: `${ownerHash}/images/${imageId}` });

        return withCors({
            statusCode: 302,
            body: JSON.stringify({ message: 'success' }),
            headers: {
                location: url,
                origin: 'http://localhost:8080'
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
