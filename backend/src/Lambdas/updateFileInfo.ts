import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { getDynamo, getCookies, verifySession, mapDataTypesToAttrValues, getFileInfo, extractProperties, withCors } from '../helpers'
import due from 'dynamo-update-expression'
import { imagesTableName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const sessionId = getCookies(event).sessionId
    const accountHash = await verifySession(sessionId)

    try {
        if (!accountHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const parsed = JSON.parse(event.body)
        const { imageId, imageName } = parsed

        if (!imageId || !imageName) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "Some mandatory file info is missing" })
            })
        }

        const modified = extractProperties(['imageName', 'description', 'collectionId', 'isPrivate'], parsed)
        let fullFileInfo

        try {
            const { ownerHash } = fullFileInfo = await getFileInfo(imageId)

            if (ownerHash !== accountHash) {
                return withCors({
                    statusCode: 401,
                    body: JSON.stringify({
                        message: 'You are not the owner of this file!'
                    })
                })
            }
        }
        catch (e) {
            return withCors({
                statusCode: 404,
                body: JSON.stringify(e)
            })
        }

        const original = extractProperties(['imageName', 'description', 'collectionId', 'isPrivate'], fullFileInfo)

        const {
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        } = due.getUpdateExpression({ original, modified })

        const mappedValues = mapDataTypesToAttrValues([
            { attributeName: 'imageName', dataType: 'S' },
            { attributeName: 'description', dataType: 'S' },
            { attributeName: 'collectionId', dataType: 'S' },
            { attributeName: 'isPrivate', dataType: 'BOOL' }
        ], ExpressionAttributeValues)

        await dynamo.updateItem({
            Key: {
                imageId: {
                    S: `${imageId}`
                }
            },
            ReturnValues: "NONE",
            TableName: imagesTableName,
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues: Object.keys(mappedValues).length ? mappedValues : undefined
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
                data: e && (e.message || e)
            })
        })
    }
}
