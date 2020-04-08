import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { S3, config as awsConfig } from 'aws-sdk';
import { getDynamo, getCookies, verifySession, withCors } from '../helpers'
import { imagesTableName, S3fileBucketName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const s3 = new S3({})
    const sessionId = getCookies(event).sessionId

    try {
        const ownerHash = await verifySession(sessionId)

        if (!ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { imageId } = JSON.parse(event.body)

        if (!imageId) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "Image id was not specified!" })
            })
        }

        try {
            await dynamo.deleteItem({
                TableName: imagesTableName,
                Key: {
                    imageId: {
                        S: `${imageId}`
                    }
                },
                ReturnValues: 'NONE',
                ConditionExpression: '#H = :h',
                ExpressionAttributeNames: {
                    '#H': 'ownerHash'
                },
                ExpressionAttributeValues: {
                    ':h': {
                        S: ownerHash
                    }
                }
            }).promise()
        }
        catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                return withCors({
                    statusCode: 401,
                    body: JSON.stringify({ message: 'You are not the owner of this file!' })
                })
            }
        }

        await s3.deleteObject({
            Bucket: S3fileBucketName,
            Key: `${ownerHash}/images/${imageId}`,
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
