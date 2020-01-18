import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, accountExists, getAccountInfo, mapDataTypesToAttrValues, withCors } from '../helpers'
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import due from 'dynamo-update-expression'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = new DynamoDB()
    const cookies = getCookies(event)
    const hash = cookies.accountHash

    if (!(await accountExists(hash))) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({ message: "You are not logged in!" })
        })
    }

    try {
        const { name } = JSON.parse(event.body)
        const info = { name }
        const currentAccountInfo = await getAccountInfo(hash)
        const {
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        } = due.getUpdateExpression({ original: currentAccountInfo, modified: info })

        const mappedValues = mapDataTypesToAttrValues([{ attributeName: 'name', dataType: 'S' }], ExpressionAttributeValues)

        await new Promise((res, rej) => {
            dynamo.updateItem({
                Key: {
                    "hash": {
                        S: hash
                    }
                },
                ReturnValues: "NONE",
                TableName: "Accounts-screenshot-app",
                UpdateExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues: Object.keys(mappedValues).length ? mappedValues : undefined
            }, (err, _) => {
                if (err) rej(err)
                else res()
            })
        })

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
