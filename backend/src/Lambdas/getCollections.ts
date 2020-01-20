import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, accountExists, withCors, extractProperties } from '../helpers'
import { config as awsConfig, DynamoDB } from 'aws-sdk';
import { CollectionInfo } from '../Types/collection'
import { collectionsTableName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const accountHash = getCookies(event).accountHash
    const dynamo = new DynamoDB()

    if (!(await accountExists(accountHash))) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({
                message: 'You are not logged in!'
            })
        })
    }

    try {
        const collections: CollectionInfo[] = await new Promise<CollectionInfo[]>((res, rej) => {
            dynamo.query({
                TableName: collectionsTableName,
                ExpressionAttributeValues: {
                    ":h": {
                        S: accountHash
                    }
                },
                IndexName: 'ownerHash-collectionId',
                KeyConditionExpression: "ownerHash = :h",
                Select: 'ALL_ATTRIBUTES'
            }, (err, data) => {
                if (err) rej(err)
                else {
                    res(data.Items.map(i => ({
                        name: i.name.S,
                        collectionId: i.collectionId.S,
                        ownerHash: i.ownerHash.S
                    })))
                }
            })
        })

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success', data: collections.map(c => extractProperties(['name', 'collectionId'], c)) }),
        })
    }
    catch (e) {
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: `Something went horribly wrong`,
                data: e
            })
        })
    }
}
