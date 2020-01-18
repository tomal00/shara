import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, withCors } from '../helpers'

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

        const { collectionId } = JSON.parse(event.body)

        await new Promise((res, rej) => {
            dynamo.deleteItem({
                TableName: 'Collections-screenshot-app',
                Key: {
                    collectionId: {
                        S: `${collectionId}`
                    }
                },
                ReturnValues: 'NONE',
                ConditionExpression: '#H = :h',
                ExpressionAttributeNames: {
                    '#H': 'ownerHash'
                },
                ExpressionAttributeValues: {
                    ':h': {
                        S: hash
                    }
                }
            }, (err) => {
                if (err) {
                    if (err.code === 'ConditionalCheckFailedException') rej('You are not the owner of this collection!')
                    rej(err)

                    return
                }
                res()
            })
        })

        const imageIdsOfCollection: string[] = await new Promise((res, rej) => {
            dynamo.query({
                TableName: 'Images-screenshot-app',
                ExpressionAttributeValues: {
                    ":c": {
                        S: collectionId
                    },
                },
                IndexName: 'collectionId-imageId',
                KeyConditionExpression: `collectionId = :c`,
                Select: 'SPECIFIC_ATTRIBUTES',
                ProjectionExpression: 'imageId'
            }, (err, data) => {
                if (err) rej(err)
                else {
                    res(data.Items.map(i => i.imageId.S))
                }
            })
        })

        await Promise.all(imageIdsOfCollection.map(i => new Promise((res, rej) => {
            dynamo.updateItem({
                TableName: 'Images-screenshot-app',
                ReturnValues: "NONE",
                Key: {
                    imageId: {
                        S: i
                    }
                },
                ExpressionAttributeNames: {
                    '#C': 'collectionId'
                },
                UpdateExpression: 'REMOVE #C'
            }, (err) => {
                if (err) rej(err)
                else res()
            })
        })))

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
