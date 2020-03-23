import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { getCookies, verifySession, withCors, getDynamo } from '../helpers'
import { collectionsTableName, imagesTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const sessionId = getCookies(event).sessionId

    try {
        const ownerHash = await verifySession(sessionId)

        if (!ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { collectionId } = JSON.parse(event.body)

        if (!collectionId) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "Collection id was not specified!" })
            })
        }

        try {
            await dynamo.deleteItem({
                TableName: collectionsTableName,
                Key: {
                    collectionId: {
                        S: `${collectionId}`
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
                    body: JSON.stringify({ message: 'You are not the owner of this collection!' })
                })
            }
            else throw err
        }

        const imageIdsOfCollection: string[] = await dynamo.query({
            TableName: imagesTableName,
            ExpressionAttributeValues: {
                ":c": {
                    S: collectionId
                },
            },
            IndexName: 'collectionId-imageId',
            KeyConditionExpression: `collectionId = :c`,
            Select: 'SPECIFIC_ATTRIBUTES',
            ProjectionExpression: 'imageId'
        }).promise()
            .then(data => data.Items.map(i => i.imageId.S))


        await Promise.all(imageIdsOfCollection.map(
            i => dynamo.updateItem({
                TableName: imagesTableName,
                ReturnValues: "NONE",
                Key: {
                    imageId: {
                        S: i
                    }
                },
                ExpressionAttributeNames: {
                    '#C': 'collectionId'
                },
                UpdateExpression: 'REMOVE #C'
            }).promise()
        ))

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
        });
    }
}
