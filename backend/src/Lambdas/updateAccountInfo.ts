import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, verifySession, getAccountInfo, mapDataTypesToAttrValues, withCors, getDynamo } from '../helpers'
import { config as awsConfig } from 'aws-sdk';
import due from 'dynamo-update-expression'
import { accountsTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const cookies = getCookies(event)
    const sessionId = cookies.sessionId
    const ownerHash = await verifySession(sessionId)

    if (!ownerHash) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({ message: "You are not logged in!" })
        })
    }

    try {
        const { name } = JSON.parse(event.body)
        const info = { name }
        const currentAccountInfo = await getAccountInfo(ownerHash)
        const {
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        } = due.getUpdateExpression({ original: currentAccountInfo, modified: info })

        const mappedValues = mapDataTypesToAttrValues([{ attributeName: 'name', dataType: 'S' }], ExpressionAttributeValues)

        await dynamo.updateItem({
            Key: {
                "hash": {
                    S: ownerHash
                }
            },
            ReturnValues: "NONE",
            TableName: accountsTableName,
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
