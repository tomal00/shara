import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, verifySession, withCors, extractProperties, getDynamo } from '../helpers'
import { config as awsConfig } from 'aws-sdk';
import { CollectionInfo } from '../Types/collection'
import { collectionsTableName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const sessionId = getCookies(event).sessionId
    const dynamo = getDynamo()
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
        const collections: CollectionInfo[] = await dynamo.query({
            TableName: collectionsTableName,
            ExpressionAttributeValues: {
                ":h": {
                    S: ownerHash
                }
            },
            IndexName: 'ownerHash-collectionId',
            KeyConditionExpression: "ownerHash = :h",
            Select: 'ALL_ATTRIBUTES'
        }).promise()
            .then(data => data.Items.map(i => ({
                name: i.name.S,
                collectionId: i.collectionId.S,
                ownerHash: i.ownerHash.S
            })))

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success', data: collections.map(c => extractProperties(['name', 'collectionId'], c)) }),
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
