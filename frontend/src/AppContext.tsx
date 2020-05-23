import * as React from 'react'
import { Api } from 'Root/api'
import { NotificationSetter, PromptData } from 'Types/etc'

interface InitialContext {
    api: Api,
    accountHash: string | null,
    prompt: PromptData | null,
    setAccountHash: (hash: string | null) => void,
    logOut: () => void,
    addNotification: NotificationSetter,
    openPrompt: (data: PromptData) => Promise<string | void>
}

const InitialContext: InitialContext = {
    setAccountHash: () => { },
    addNotification: () => { },
    logOut: () => { },
    openPrompt: async () => { },
    accountHash: null,
    api: {} as Api,
    prompt: null
}

export const AppContext = React.createContext(InitialContext)

export const Provider = (
    {
        children,
        api,
        accountHash,
        addNotification,
        prompt,
        openPrompt

    }: {
        children: React.ReactNode,
        api: Api,
        accountHash: string | null,
        addNotification: NotificationSetter,
        openPrompt: (data: PromptData) => Promise<void | string>,
        prompt: PromptData | null
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
        prompt,
        openPrompt,
        setAccountHash,
        addNotification,
        logOut,
    }}>
        {children}
    </AppContext.Provider>
}