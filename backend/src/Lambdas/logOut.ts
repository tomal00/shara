import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { withCors, getCookies, verifySession, getDynamo } from '../helpers'
import { sessionsTableName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event) => {
    const sessionId = getCookies(event).sessionId
    const dynamo = getDynamo()

    try {
        const accountHash = await verifySession(sessionId)
        await dynamo.deleteItem({
            TableName: sessionsTableName,
            Key: {
                sessionId: {
                    S: `${sessionId}`
                }
            },
            ReturnValues: 'NONE',
            ConditionExpression: '#H = :h',
            ExpressionAttributeNames: {
                '#H': 'accountHash'
            },
            ExpressionAttributeValues: {
                ':h': {
                    S: accountHash
                }
            }
        }).promise()
    }
    catch (e) { }

    return withCors({
        headers: {
            'Set-Cookie': `sessionId=${null}`, //Bylo by fajn nastavit picoviny jako kdy expirene atd
        },
        statusCode: 200,
        body: JSON.stringify({ message: 'success' })
    })
}
