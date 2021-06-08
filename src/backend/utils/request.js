import { merge } from 'lodash';
import { forbidden, serverError } from 'wix-http-functions';
import wixSecretsBackend from 'wix-secrets-backend';
import { UnauthorizedError } from './errors';
export function getResponse(data = {}) {
    return merge({
        headers: {
            'Content-Type': 'application/json',
        },
    }, data);
}
export async function withRouteErrorHandler(fn) {
    try {
        return await fn();
    }
    catch (error) {
        if (error instanceof UnauthorizedError) {
            return forbidden(getResponse({ body: { error } }));
        }
        return serverError(getResponse({ body: error }));
    }
}
export async function ensureTestUserTokenCorrect(request) {
    const token = await wixSecretsBackend.getSecret('TEST_API_PASSWORD');
    if (token === request.headers['x-authorization']) {
        return;
    }
    throw new UnauthorizedError(`API token invalid: ${token}`);
}
