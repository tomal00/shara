import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, withCors } from '../helpers'
import { collectionsTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = new DynamoDB()
    const hash = getCookies(event).accountHash
    const collectionId = `${Date.now()}${Math.floor(Math.random() * 10000)}`

    try {
        if (!(await accountExists(hash))) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { collectionName } = JSON.parse(event.body)

        await new Promise((res, rej) => {
            dynamo.putItem({
                TableName: collectionsTableName,
                Item: {
                    collectionId: {
                        S: collectionId
                    },
                    name: {
                        S: collectionName
                    },
                    ownerHash: {
                        S: hash
                    }
                }
            }, (err) => {
                if (err) rej(err)
                else res()
            })
        })

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
                data: e
            })
        });
    }
}
