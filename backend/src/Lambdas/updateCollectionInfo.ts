import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getDynamo, getCookies, verifySession, getCollectionInfo, mapDataTypesToAttrValues, withCors, extractProperties } from '../helpers'
import { config as awsConfig } from 'aws-sdk';
import due from 'dynamo-update-expression'
import { collectionsTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const sessionId = getCookies(event).sessionId
    const ownerHash = await verifySession(sessionId)

    if (!ownerHash) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({ message: "You are not logged in!" })
        })
    }

    try {
        const { name, collectionId } = JSON.parse(event.body)
        const info = { name }

        if (!name || !collectionId) {
            return withCors({
                statusCode: 400,
                body: JSON.stringify({ message: "Some mandatory collection info is missing" })
            })
        }

        const currentCollectionInfo = await getCollectionInfo(collectionId)

        if (currentCollectionInfo.ownerHash !== ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not the owner of this collection!" })
            })
        }

        const {
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        } = due.getUpdateExpression({ original: extractProperties(['name'], currentCollectionInfo), modified: info })

        const mappedValues = mapDataTypesToAttrValues([{ attributeName: 'name', dataType: 'S' }], ExpressionAttributeValues)

        await dynamo.updateItem({
            Key: {
                "collectionId": {
                    S: collectionId
                }
            },
            ReturnValues: "NONE",
            TableName: collectionsTableName,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues: Object.keys(mappedValues).length ? mappedValues : undefined
        }).promise()

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: "Success" })
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
