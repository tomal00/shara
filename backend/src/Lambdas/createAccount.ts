import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createHash } from 'crypto';
import { config as awsConfig } from 'aws-sdk';
import '@babel/polyfill';
import { withCors, getDynamo } from '../helpers'
import { accountsTableName, sessionsTableName, awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (_, _context) => {
    const accountHash = createHash('sha512')
    const sessionHash = createHash('sha512')
    const dynamo = getDynamo()
    const now = Date.now()

    try {
        await accountHash.write(`${now}${Math.random()}`)
        accountHash.end()
        const hashString = accountHash.read().toString('hex')

        await sessionHash.write(`${hashString}${now}`)
        sessionHash.end()
        const sessionId = sessionHash.read().toString('hex')

        await dynamo.putItem({
            TableName: accountsTableName,
            Item: {
                hash: {
                    S: hashString
                }
            }
        }).promise()

        await dynamo.putItem({
            TableName: sessionsTableName,
            Item: {
                sessionId: {
                    S: sessionId
                },
                accountHash: {
                    S: hashString
                }
            }
        }).promise()

        return withCors({
            statusCode: 200,
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Secure; SameSite=None; Max-Age=2147483647`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ message: 'success', accountHash: hashString }),
        });
    }
    catch (e) {
        console.error(e)
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: `Something went horribly wrong`,
                data: e.message
            })
        });
    }
}
