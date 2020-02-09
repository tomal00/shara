import { Cancelable } from 'Root/Types/cancelable'

export const makeCancelable = <T>(promise: Promise<T>): Cancelable<T> => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise.then(
            val => {
                return hasCanceled_ ? reject({ isCanceled: true, name: 'PROMISE_CANCELED', message: 'The promise was canceled before it was resolved' }) : resolve(val)
            },
            error => {
                return hasCanceled_ ? reject({ isCanceled: true, name: 'PROMISE_CANCELED', message: 'The promise was canceled before it was resolved' }) : reject(error)
            }
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};