import { APIGatewayProxyEvent } from 'aws-lambda';
import { AccountInfo } from './Types/account'
import { DynamoDB } from 'aws-sdk';
import { FullFileInfo } from './Types/file'
import { CollectionInfo } from './Types/collection'

export const getCookies = ({ headers }: APIGatewayProxyEvent): any => {
    if (!headers.Cookie) return {}

    const cookiesArr = headers.Cookie.replace(/ /g, '').split(';')
    const cookies = {}

    for (let c of cookiesArr) {
        const splitted = c.split('=')

        if (splitted.length === 1) cookies[splitted[0]] = true
        else cookies[splitted[0]] = splitted[1]
    }

    return cookies
}

export const accountExists = async (hash: string): Promise<boolean> => {
    const dynamo = new DynamoDB()

    if (!hash) return false

    return new Promise((res, rej) => {
        dynamo.getItem({
            TableName: 'Accounts-screenshot-app',
            Key: {
                hash: {
                    S: hash
                }
            }
        }, (err, data) => {
            if (err) rej(err)
            else res(data && !!data.Item)
        })
    })
}

export const getAccountInfo = async (hash: string): Promise<AccountInfo> => {
    const dynamo = new DynamoDB()

    return new Promise((res, rej) => {
        dynamo.getItem({
            TableName: 'Accounts-screenshot-app',
            Key: {
                hash: {
                    S: hash
                }
            }
        }, (err, data) => {
            if (err) rej(err)
            else res({
                name: data.Item.name ? data.Item.name.S : ''
            } as AccountInfo)
        })
    })
}
/*
    name: string,
    id: string,
    ownerHash: string
*/
export const getCollectionInfo = async (collectionId: string): Promise<CollectionInfo> => {
    const dynamo = new DynamoDB()

    return new Promise((res, rej) => {
        dynamo.getItem({
            TableName: 'Collections-screenshot-app',
            Key: {
                collectionId: {
                    S: collectionId
                }
            }
        }, (err, data) => {
            if (err) rej(err)
            else res({
                name: data.Item.name.S,
                collectionId: data.Item.collectionId.S,
                ownerHash: data.Item.ownerHash.S
            } as CollectionInfo)
        })
    })
}

export const extractProperties = (propNames: string[], from: any): any => {
    const extracted = {}
    for (let propName of propNames) {
        extracted[propName] = from[propName]
    }

    return extracted
}

export const getFileInfo = async (imageId: string): Promise<FullFileInfo> => {
    const dynamo = new DynamoDB()

    return new Promise<FullFileInfo>((res, rej) => {
        dynamo.getItem({
            TableName: 'Images-screenshot-app',
            Key: {
                imageId: {
                    S: `${imageId}`
                }
            }
        }, (err, data) => {
            if (err) rej(err)
            else if (!data || !data.Item) rej({ message: 'The file does not exist!', data: imageId })

            if (err || !data || !data.Item) return

            const fileInfo = {}
            for (let key in data.Item) {
                const dataType = Object.keys(data.Item[key])[0]
                fileInfo[key] = data.Item[key][dataType]
            }

            res(fileInfo as FullFileInfo)
        })
    })
}

interface Attribute {
    dataType: 'S' | 'N' | 'SS' | 'NULL' | 'NS' | 'M' | 'L' | 'BS' | 'BOOL' | 'B'
    attributeName: string
}
export const mapDataTypesToAttrValues = (attributes: Attribute[], expressionAttributeValues: any) => {
    const mapped = { ...expressionAttributeValues }

    for (let key in expressionAttributeValues) {
        const attribute = attributes.find(a => `:${a.attributeName}` === key)

        mapped[key] = {
            [attribute.dataType]: `${expressionAttributeValues[key]}`
        }
    }

    return mapped
}

export const withCors = (result: any): any => ({
    ...result,
    headers: {
        ...(result.headers ? result.headers : {}),
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Credentials": true
    }
})