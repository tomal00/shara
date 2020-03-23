import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, verifySession, withCors } from '../helpers'
import { config as awsConfig } from 'aws-sdk';

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const sessionId = getCookies(event).sessionId
    const accountHash = await verifySession(sessionId)

    try {
        return withCors({
            statusCode: 200,
            body: JSON.stringify({
                accountHash,
                isValid: !!accountHash
            })
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
