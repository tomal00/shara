import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, mapDataTypesToAttrValues, getFileInfo, extractProperties, withCors } from '../helpers'
import due from 'dynamo-update-expression'
import { imagesTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = new DynamoDB()
    const hash = getCookies(event).accountHash

    try {
        if (!(await accountExists(hash))) {
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

            if (ownerHash !== hash) {
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
