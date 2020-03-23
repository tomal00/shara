import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { getCookies, verifySession, withCors, getDynamo } from '../helpers'
import { collectionsTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const sessionId = getCookies(event).sessionId
    const collectionId = `${Date.now()}${Math.floor(Math.random() * 10000)}`

    try {
        const ownerHash = await verifySession(sessionId)

        if (!ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { collectionName } = JSON.parse(event.body)

        if (!collectionName) {
            return withCors({
                statusCode: 400,
                body: JSON.stringify({ message: "Collection name was not specified!" })
            })
        }

        await dynamo.putItem({
            TableName: collectionsTableName,
            Item: {
                collectionId: {
                    S: collectionId
                },
                name: {
                    S: collectionName
                },
                ownerHash: {
                    S: ownerHash
                }
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
                data: e
            })
        });
    }
}
