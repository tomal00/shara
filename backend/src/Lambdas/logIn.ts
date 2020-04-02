import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { withCors, accountExists, getDynamo } from '../helpers'
import { sessionsTableName } from '../../config.json'
import { createHash } from 'crypto';

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const dynamo = getDynamo()
        const accountHash = JSON.parse(event.body).hash

        if (!accountHash) {
            return withCors({
                statusCode: 400,
                body: JSON.stringify({
                    message: `No hash specified`,
                })
            })
        }

        if (!(await accountExists(accountHash))) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({
                    message: `No account matches this hash: ${accountHash}`,
                })
            })
        }

        const sessionHash = createHash('sha512')
        await sessionHash.write(`${accountHash}${Date.now()}`)
        sessionHash.end()
        const sessionId = sessionHash.read().toString('hex')

        await dynamo.putItem({
            TableName: sessionsTableName,
            Item: {
                sessionId: {
                    S: sessionId
                },
                accountHash: {
                    S: accountHash
                }
            }
        }).promise()

        return withCors({
            headers: {
                'Set-Cookie': `sessionId=${sessionId}; Secure; SameSite=None; HttpOnly; Max-Age=2147483647`
            },
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
        })
    }
}
