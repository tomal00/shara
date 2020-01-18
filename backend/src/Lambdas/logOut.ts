import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import '@babel/polyfill';
import { config as awsConfig } from 'aws-sdk';
import { withCors } from '../helpers'

awsConfig.update({ region: 'eu-central-1' });

export const handler: APIGatewayProxyHandler = async () => {
    return withCors({
        headers: {
            'Set-Cookie': `accountHash=${null}`, //Bylo by fajn nastavit picoviny jako kdy expirene atd
        },
        statusCode: 200,
        body: JSON.stringify({ message: 'success' })
    })
}
