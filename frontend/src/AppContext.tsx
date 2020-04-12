import * as React from 'react'
import { Api } from 'Root/api'
import { NotificationSetter } from 'Types/etc'

interface InitialContext {
    api: Api,
    accountHash: string | null,
    setAccountHash: (hash: string | null) => void,
    logOut: () => void,
    addNotification: NotificationSetter
}

const InitialContext: InitialContext = {
    setAccountHash: () => { },
    addNotification: () => { },
    logOut: () => { },
    accountHash: null,
    api: {} as Api
}

export const AppContext = React.createContext(InitialContext)

export const Provider = (
    {
        children,
        api,
        accountHash,
        addNotification,
    }: {
        children: React.ReactNode,
        api: Api,
        accountHash: string | null,
        addNotification: NotificationSetter,
    }) => {
    const [hash, setAccountHash] = React.useState<string | null>(accountHash)
    const logOut = () => {
        setAccountHash('')
        addNotification({
            clearPrevious: true,
            notification: {
                level: 'error',
                message: 'You have been logged out due to an unexpected error.',
                autoDismiss: 10,
                title: 'Unexpected unauthorized error'
            }
        })
    }

    return <AppContext.Provider value={{
        api,
        accountHash: hash || null,
        setAccountHash,
        addNotification,
        logOut
    }}>
        {children}
    </AppContext.Provider>
}