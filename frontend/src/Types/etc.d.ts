import * as React from 'react'
import * as NotificationSystem from 'react-notification-system'

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>
export type NotificationSetter = ({ clearPrevious, notification }: {
    clearPrevious: boolean,
    notification: NotificationSystem.Notification
}) => void
