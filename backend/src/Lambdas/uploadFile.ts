import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { S3, config as awsConfig } from 'aws-sdk';
import { getCookies, verifySession, withCors, getDynamo } from '../helpers'
import { UploadedFile } from '../Types/file'
import { imagesTableName, S3fileBucketName } from '../../config.json'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const dynamo = getDynamo()
    const s3 = new S3({})
    const sessionId = getCookies(event).sessionId
    const ownerHash = await verifySession(sessionId)

    try {
        if (!ownerHash) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "You are not logged in!" })
            })
        }

        const parsedFile = JSON.parse(event.body).file
        const file: UploadedFile = {
            ...parsedFile,
            buffer: Buffer.from(parsedFile.uInt8Array)
        }

        if (!file.name) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({ message: "Some mandatory file info is missing" })
            })
        }
        else if (!file.meta.mime.match(/image/)) {
            return withCors({
                statusCode: 400,
                body: JSON.stringify({ message: "The file is not of an image type" })
            })
        }

        const imageId = `${Date.now()}${Math.floor(Math.random() * 10000)}`

        await s3.putObject({
            Bucket: S3fileBucketName,
            Key: `${ownerHash}/images/${imageId}`,
            Body: file.buffer,
            ContentType: file.meta.mime
        }).promise()

        await dynamo.putItem({
            TableName: imagesTableName,
            Item: {
                ownerHash: {
                    S: ownerHash
                },
                imageName: {
                    S: file.name
                },
                imageId: {
                    S: imageId
                },
                isPrivate: {
                    BOOL: file.isPrivate
                },
                ...(file.meta.description ? {
                    description: {
                        S: file.meta.description
                    }
                } : {})
            }
        }).promise()

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success', imageId })
        })
    }
    catch (e) {
        return withCors({
            statusCode: 500,
            body: JSON.stringify({
                message: 'Something went horribly wrong',
                data: e.message || e
            })
        })
    }
}
