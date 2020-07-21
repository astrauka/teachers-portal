export interface Logger {
  info: (...args) => void;
  warn: (...args) => void;
  error: (...args) => void;
}

type AFunction<T> = () => Promise<T> | T;

export async function withLogger<T>(
  namespaceOrLogger: string | Logger,
  promiseOrFn: Promise<T> | AFunction<T>
): Promise<T> {
  const logger: Logger =
    typeof namespaceOrLogger === 'string' ? getLogger(namespaceOrLogger) : namespaceOrLogger;
  try {
    return typeof promiseOrFn === 'function' ? await promiseOrFn() : await promiseOrFn;
  } catch (err) {
    logger.error('failed', err.message);
    throw err;
  }
}

// tslint:disable:no-console
export function getLogger(namespace: string): Logger {
  return {
    info: (...args) => console.log(namespace, ...args),
    warn: (...args) => console.warn(namespace, ...args),
    error: (...args) => console.error(namespace, ...args),
  };
}

export function prettyJSON(value, { singleLine = false } = {}) {
  return JSON.stringify(value, null, singleLine ? '' : 2);
}
