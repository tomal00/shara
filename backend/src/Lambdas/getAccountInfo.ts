import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { getCookies, accountExists, getAccountInfo, withCors } from '../helpers'
import { config as awsConfig } from 'aws-sdk';

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const accountHash = getCookies(event).accountHash

    if (!(await accountExists(accountHash))) {
        return withCors({
            statusCode: 401,
            body: JSON.stringify({
                message: 'You are not logged in!'
            })
        })
    }

    try {
        const info = await getAccountInfo(accountHash)

        return withCors({
            statusCode: 200,
            body: JSON.stringify({ message: 'success', data: info }),
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
