import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, S3, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, withCors } from '../helpers'
import { imagesTableName, S3fileBucketName } from '../../config.json'

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

        try {
            await dynamo.deleteItem({
                TableName: imagesTableName,
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
            }).promise()
        }
        catch (err) {
            if (err.code === 'ConditionalCheckFailedException') {
                return withCors({
                    statusCode: 401,
                    body: JSON.stringify({ message: 'You are not the owner of this file!' })
                })
            }
        }

        await s3.deleteObject({
            Bucket: S3fileBucketName,
            Key: `${hash}/images/${imageId}`,
        }).promise()

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
