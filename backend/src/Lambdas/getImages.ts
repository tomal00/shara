import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, accountExists, withCors, extractProperties } from '../helpers'
import { config as awsConfig, DynamoDB } from 'aws-sdk';
import { FullFileInfo } from '../Types/file'
import { imagesTableName } from '../../config.json'

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

    const { collectionId } = event.queryStringParameters || {}

    const collectionIdAttr = collectionId ? {
        ":c": { S: collectionId }
    } : {}

    try {
        const images: FullFileInfo[] = await new Promise<FullFileInfo[]>((res, rej) => {
            dynamo.query({
                TableName: imagesTableName,
                ExpressionAttributeValues: {
                    ":h": {
                        S: accountHash
                    },
                    ...collectionIdAttr
                },
                IndexName: 'ownerHash-imageId',
                KeyConditionExpression: `ownerHash = :h`,
                FilterExpression: collectionId ? 'collectionId = :c' : undefined,
                Select: 'ALL_ATTRIBUTES'
            }, (err, data) => {
                if (err) rej(err)
                else {
                    res(data.Items.map(i => ({
                        ownerHash: i.ownerHash.S,
                        collectionId: i.collectionId ? i.collectionId.S : undefined,
                        imageId: i.imageId.S,
                        imageName: i.imageName.S,
                        description: i.description ? i.description.S : undefined,
                        isPrivate: i.isPrivate.BOOL
                    })))
                }
            })
        })

        return withCors({
            statusCode: 200,
            body: JSON.stringify({
                message: 'success',
                data: images.map(i => ({
                    ...extractProperties(['imageId', 'collectionId', 'imageName', 'description'], i),
                    isOwner: i.ownerHash === accountHash
                }))
            }),
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
