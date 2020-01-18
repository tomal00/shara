import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, S3, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, withCors } from '../helpers'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = new DynamoDB()
    const s3 = new S3({})
    const hash = getCookies(event).accountHash

    try {
        if (!(await accountExists(hash))) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const { imageId } = JSON.parse(event.body)

        await new Promise((res, rej) => {
            dynamo.deleteItem({
                TableName: 'Images-screenshot-app',
                Key: {
                    imageId: {
                        S: `${imageId}`
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
                    if (err.code === 'ConditionalCheckFailedException') rej('You are not the owner of this file!')
                    rej(err)

                    return
                }
                res()
            })
        })

        await new Promise((res, rej) => {
            s3.deleteObject({
                Bucket: 'screenshot-app-files',
                Key: `${hash}/images/${imageId}`,
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
        })
    }
}
