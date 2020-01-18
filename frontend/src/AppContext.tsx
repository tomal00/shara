import * as React from 'react'
import { Api } from 'Root/api'


interface InitialContext {
    api?: Api,
    accountHash?: string,
    setAccountHash: any
}

const InitialContext: InitialContext = {
    setAccountHash: () => { }
}

export const AppContext = React.createContext(InitialContext)

export const Provider = ({ children, api, accountHash }: { children: React.ReactNode, api: Api, accountHash?: string }) => {
    const [hash, setAccountHash] = React.useState(accountHash)

    return <AppContext.Provider value={{
        api,
        accountHash: hash,
        setAccountHash
    }}>
        {children}
    </AppContext.Provider>
}