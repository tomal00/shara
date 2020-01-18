import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { DynamoDB, S3, config as awsConfig } from 'aws-sdk';
import { getCookies, accountExists, withCors } from '../helpers'
import { UploadedFile } from '../Types/file'

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

        const parsedFile = JSON.parse(event.body).file
        const file: UploadedFile = {
            ...parsedFile,
            buffer: Buffer.from(parsedFile.uInt8Array)
        }

        const imageId = `${Date.now()}${Math.floor(Math.random() * 10000)}`

        await new Promise<string>((res, rej) => {
            s3.putObject({
                Bucket: 'screenshot-app-files',
                Key: `${hash}/images/${imageId}`,
                Body: file.buffer,
                ContentType: file.meta.mime
            }, (err) => {
                if (err) rej(err)
                res()
            })
        })

        await new Promise((res, rej) => {
            dynamo.putItem({
                TableName: 'Images-screenshot-app',
                Item: {
                    ownerHash: {
                        S: hash
                    },
                    imageName: {
                        S: file.name
                    },
                    imageId: {
                        S: imageId
                    },
                    isPrivate: {
                        BOOL: file.isPrivate
                    }
                }
            }, (err) => {
                if (err) rej(err)
                else res()
            })
        })

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
                data: e
            })
        })
    }
}