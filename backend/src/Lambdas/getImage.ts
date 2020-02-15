import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { withCors, getFileInfo, extractProperties, getCookies } from '../helpers'
import { config as awsConfig } from 'aws-sdk';

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const { imageId } = event.queryStringParameters || {}

    if (!imageId) return withCors({
        statusCode: 400,
        body: JSON.stringify({
            message: 'ImageId not specified!'
        })
    })

    try {
        const hash = getCookies(event).accountHash
        const image = await getFileInfo(imageId)

        if (image.isPrivate && hash !== image.ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({
                    message: 'This file is private!'
                })
            })
        }

        return withCors({
            statusCode: 200,
            body: JSON.stringify({
                message: 'success',
                data: {
                    ...extractProperties(['imageName', 'description', 'imageId', 'collectionId', 'isPrivate'], image),
                    isOwner: hash === image.ownerHash
                },
            })
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
