import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import { withCors } from '../helpers'
import { accountsTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = new DynamoDB()

    try {
        const accountHash = JSON.parse(event.body).hash

        if (!accountHash) throw 'No hash specified'

        await new Promise((res, rej) => {
            dynamo.getItem({
                TableName: accountsTableName,
                Key: {
                    hash: {
                        S: accountHash
                    }
                }
            }, (err, data) => {
                if (err) rej(err)
                else if (!data.Item) rej(`No account matches this hash: ${accountHash}`) //HÁZÍ 500, ZMĚNIT
                else res()
            })
        })
        return withCors({
            headers: {
                'Set-Cookie': `accountHash=${accountHash}`, //Bylo by fajn nastavit picoviny jako kdy expirene atd
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
