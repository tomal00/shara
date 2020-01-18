import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createHash } from 'crypto';
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import '@babel/polyfill';
import { withCors } from '../helpers'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (_, _context) => {
    const accountHash = createHash('sha512')
    const dynamo = new DynamoDB()

    try {
        await accountHash.write(`${Date.now()}${Math.random()}`)
        accountHash.end()
        const hashString = accountHash.read().toString('hex')

        await new Promise((res, rej) => {
            dynamo.putItem({
                TableName: 'Accounts-screenshot-app',
                Item: {
                    hash: {
                        S: hashString
                    }
                }
            }, (err) => {
                if (err) rej(err)
                else res()
            })
        })

        return withCors({
            statusCode: 200,
            headers: {
                'Set-Cookie': `accountHash=${hashString}`, //Bylo by fajn nastavit picoviny jako kdy expirene atd
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ message: 'success', accountHash: hashString }),
        });
    }
    catch (e) {
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: `Something went horribly wrong`,
                data: e
            })
        });
    }
}