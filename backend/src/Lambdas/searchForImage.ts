import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, accountExists, withCors, extractProperties } from '../helpers'
import { DynamoDB, config as awsConfig } from 'aws-sdk';
import { FullFileInfo } from '../Types/file'
import * as Fuse from 'fuse.js'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const hash = getCookies(event).accountHash

    if (!(await accountExists(hash))) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({ message: "You are not logged in!" })
        })
    }

    const dynamo = new DynamoDB()
    const { searchValue } = event.queryStringParameters

    if (!searchValue) {
        return withCors({
            statusCode: 400,
            body: JSON.stringify({ message: "You must specify the name of the image you are searching for" })
        })
    }

    try {
        const results = await new Promise<FullFileInfo[]>((res, rej) => {
            dynamo.query({
                TableName: 'Images-screenshot-app',
                ExpressionAttributeValues: {
                    ":h": {
                        S: hash
                    }
                },
                IndexName: 'ownerHash-imageId',
                KeyConditionExpression: "ownerHash = :h",
                Select: 'ALL_ATTRIBUTES'
            }, (err, data) => {

                if (err) rej(err)
                else res(data.Items.map(i => {
                    return {
                        imageName: i.imageName.S,
                        imageId: i.imageId.S,
                        collectionId: i.collectionId ? i.collectionId.S : undefined,
                        ownerHash: i.ownerHash.S,
                        description: i.description ? i.description.S : undefined,
                        isPrivate: i.isPrivate.BOOL
                    }
                }))
            })
        })

        const fuse = new Fuse(results, {
            shouldSort: true,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: Math.ceil(searchValue.length / 2),
            keys: ['imageName']
        })

        const possibleMatches = fuse.search(searchValue).slice(0, 10)

        return withCors({
            statusCode: 200,
            body: JSON.stringify({
                message: 'success',
                results: possibleMatches.map(p => extractProperties(['collectionId', 'imageId', 'imageName', 'description'], p))
            }),
        });
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
