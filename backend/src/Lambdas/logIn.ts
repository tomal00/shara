import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { withCors, accountExists } from '../helpers'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const accountHash = JSON.parse(event.body).hash

        if (!accountHash) {
            return withCors({
                statusCode: 400,
                body: JSON.stringify({
                    message: `No hash specified`,
                })
            })
        }

        if (!(await accountExists(accountHash))) {
            return withCors({
                statusCode: 401,
                body: JSON.stringify({
                    message: `No account matches this hash: ${accountHash}`,
                })
            })
        }

        return withCors({
            headers: {
                'Set-Cookie': `accountHash=${accountHash}; SameSite=Strict; HttpOnly; Max-Age=2147483647`
            },
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
