import * as React from 'react'
import { Api } from 'Root/api'
import { NotificationSetter } from 'Types/etc'

interface InitialContext {
    api?: Api,
    accountHash?: string,
    setAccountHash: (hash: string) => void,
    addNotification: NotificationSetter
}

const InitialContext: InitialContext = {
    setAccountHash: () => { },
    addNotification: () => { }
}

export const AppContext = React.createContext(InitialContext)

export const Provider = (
    {
        children,
        api,
        accountHash,
        addNotification
    }: {
        children: React.ReactNode,
        api: Api,
        accountHash?: string,
        addNotification: NotificationSetter
    }) => {
    const [hash, setAccountHash] = React.useState(accountHash)

    return <AppContext.Provider value={{
        api,
        accountHash: hash,
        setAccountHash,
        addNotification
    }}>
        {children}
    </AppContext.Provider>
}