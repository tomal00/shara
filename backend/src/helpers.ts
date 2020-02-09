import { APIGatewayProxyEvent } from 'aws-lambda';
import { AccountInfo } from './Types/account'
import { DynamoDB } from 'aws-sdk';
import { FullFileInfo } from './Types/file'
import { CollectionInfo } from './Types/collection'
import { websiteUrl, accountsTableName, imagesTableName, collectionsTableName } from '../config.json'

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

    return dynamo.getItem({
        TableName: accountsTableName,
        Key: {
            hash: {
                S: hash
            }
        }
    }).promise().then(data => data && !!data.Item)
}

export const getAccountInfo = async (hash: string): Promise<AccountInfo> => {
    const dynamo = new DynamoDB()

    return dynamo.getItem({
        TableName: accountsTableName,
        Key: {
            hash: {
                S: hash
            }
        }
    }).promise()
        .then(data => ({
            name: data.Item.name ? data.Item.name.S : ''
        }))
}

export const getCollectionInfo = async (collectionId: string): Promise<CollectionInfo> => {
    const dynamo = new DynamoDB()

    return dynamo.getItem({
        TableName: collectionsTableName,
        Key: {
            collectionId: {
                S: collectionId
            }
        }
    }).promise()
        .then(data => ({
            name: data.Item.name.S,
            collectionId: data.Item.collectionId.S,
            ownerHash: data.Item.ownerHash.S
        }))
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

    return dynamo.getItem({
        TableName: imagesTableName,
        Key: {
            imageId: {
                S: `${imageId}`
            }
        }
    }).promise()
        .then(data => {
            if (!data || !data.Item) throw new Error(`The file does not exist! ${imageId}`)

            const fileInfo = {}
            for (let key in data.Item) {
                const dataType = Object.keys(data.Item[key])[0]
                fileInfo[key] = data.Item[key][dataType]
            }

            return fileInfo as FullFileInfo
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
        "Access-Control-Allow-Origin": websiteUrl,
        "Access-Control-Allow-Credentials": true
    }
})