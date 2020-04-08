import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, verifySession, withCors } from '../helpers'
import { config as awsConfig } from 'aws-sdk';
import { awsRegion } from '../../config.json'

awsConfig.update({ region: awsRegion });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const sessionId = getCookies(event).sessionId
    const accountHash = await verifySession(sessionId)

    try {
        if (!!accountHash) {
            return withCors({
                statusCode: 200,
                body: JSON.stringify({
                    accountHash,
                    isValid: true
                })
            })
        }
        else {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({
                    message: 'Invalid session',
                    data: sessionId,
                    isValid: false
                })
            })
        }
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
