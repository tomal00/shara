import * as React from 'react'
import { useCancelable } from 'Root/hooks'
import { AppContext } from 'Root/AppContext'
import LogInCard from 'Components/account/LogInCard'

export default () => {
    const { api, setAccountHash } = React.useContext(AppContext)
    const { createCancelable } = useCancelable()

    const handleLogIn = (hash: string): void => {
        createCancelable(api.logIn(hash))
            .promise
            .then(({ success }) => {
                if (success) setAccountHash(hash)
                else alert('Incorrect hash!')
            })
            .catch((err) => {
                if (!err.isCanceled) alert('Incorrect hash!')
            })
    }
    const handleRegister = (): void => {
        createCancelable(api.createAccount())
            .promise
            .then(({ accountHash }) => {
                setAccountHash(accountHash)
            })
            .catch((err) => {
                if (!err.isCanceled) {
                    console.error(err)
                }
            })
    }

    return <LogInCard
        onLogIn={handleLogIn}
        onRegister={handleRegister} />
}