export async function withLogger(namespaceOrLogger, promiseOrFn) {
    const logger = typeof namespaceOrLogger === 'string' ? getLogger(namespaceOrLogger) : namespaceOrLogger;
    try {
        return typeof promiseOrFn === 'function' ? await promiseOrFn() : await promiseOrFn;
    }
    catch (err) {
        logger.error('failed', err.message);
        throw err;
    }
}
// tslint:disable:no-console
export function getLogger(namespace) {
    return {
        info: (...args) => console.info(namespace, ...args),
        warn: (...args) => console.warn(namespace, ...args),
        error: (...args) => console.error(namespace, ...args),
    };
}
export function prettyJSON(value, { singleLine = false } = {}) {
    return JSON.stringify(value, null, singleLine ? '' : 2);
}
