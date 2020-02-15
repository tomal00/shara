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

export const copyToClipboard = (value: string): void => {
    window.getSelection().removeAllRanges()

    const el = document.createElement('textarea');  // 
    el.value = value;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
}
