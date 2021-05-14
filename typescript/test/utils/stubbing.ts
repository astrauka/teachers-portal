import * as sinon from 'sinon';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fn = (...args: any) => any;

export type Stub<T> = T & sinon.SinonStubbedInstance<T>;

export function stubType<T>(initStub?: (stub: sinon.SinonStubbedInstance<T>) => void) {
  const stub = new Proxy({} as Stub<T>, {
    get(obj, prop) {
      // If `then` gets stubbed, our object might be interpreted as a Promise. We don't want that.
      if (prop !== 'then' && !(prop in obj)) {
        // This is the first time this method is mentioned. Let's stub it.
        obj[prop] = sinon.stub();
      }

      return obj[prop];
    },
  });
  if (initStub) {
    initStub(stub);
  }
  return stub;
}

export function stubFn<F extends Fn>() {
  return sinon.stub<Parameters<F>, ReturnType<F>>();
}
