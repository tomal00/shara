export type Notification = {
    type: 'error' | 'info' | 'success',
    message: string,
    autoDismiss?: number
}