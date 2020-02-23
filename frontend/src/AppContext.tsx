import * as React from 'react'
import { Api } from 'Root/api'
import { NotificationSetter } from 'Types/etc'

interface InitialContext {
    api?: Api,
    accountHash?: string,
    setAccountHash: (hash: string) => void,
    logOut: () => void,
    addNotification: NotificationSetter
}

const InitialContext: InitialContext = {
    setAccountHash: () => { },
    addNotification: () => { },
    logOut: () => { }
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
        accountHash?: string,
        addNotification: NotificationSetter,
    }) => {
    const [hash, setAccountHash] = React.useState(accountHash)
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
        accountHash: hash,
        setAccountHash,
        addNotification,
        logOut
    }}>
        {children}
    </AppContext.Provider>
}