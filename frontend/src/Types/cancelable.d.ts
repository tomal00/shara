export interface Cancelable<T> {
    promise: Promise<T>,
    cancel: () => void
}