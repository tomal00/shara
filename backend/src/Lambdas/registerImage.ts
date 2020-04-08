import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig, S3 } from 'aws-sdk';
import { getCookies, verifySession, withCors, getDynamo } from '../helpers'
import { FullFileInfo } from '../Types/file'
import { imagesTableName, S3fileBucketName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const s3 = new S3()
    const sessionId = getCookies(event).sessionId
    const ownerHash = await verifySession(sessionId)

    try {
        if (!ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const fileInfo: FullFileInfo = JSON.parse(event.body).fileInfo

        try {
            await s3.headObject({ Bucket: S3fileBucketName, Key: `${ownerHash}/images/${fileInfo.imageId}` }).promise()
        }
        catch (e) {
            return withCors({
                statusCode: 404,
                body: JSON.stringify({ message: "The file was not found." })
            })
        }

        await dynamo.putItem({
            TableName: imagesTableName,
            Item: {
                ownerHash: {
                    S: ownerHash
                },
                imageName: {
                    S: fileInfo.imageName || 'New image'
                },
                imageId: {
                    S: fileInfo.imageId
                },
                isPrivate: {
                    BOOL: fileInfo.isPrivate
                },
                ...(fileInfo.description ? {
                    description: {
                        S: fileInfo.description
                    }
                } : {})
            }
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
                data: e.message || e
            })
        })
    }
}
