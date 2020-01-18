import * as React from 'react'
import styled from 'styled-components'
import { Input, Button } from 'Components/Common'
import { AppContext } from 'Root/AppContext'
import { makeCancelable } from 'Root/helpers'
import { Cancelable } from 'Root/Types/cancelable'
import { useCancelableCleanup } from 'Root/hooks'
import { StateSetter } from 'Types/etc'

const LogInCard = styled.div`
    padding: 20px;
    width: 400px;
    height: fit-content;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.secondary.base};
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto 30px 30px;
    grid-row-gap: 15px;
    align-items: center;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
`

const RegisterButton = styled(Button)`
    grid-column: span 2;
    justify-self: center;
    padding: 0 15px;
`

const TextWrapper = styled.div`
    grid-column: span 2;
`

const activePromises: Cancelable<any>[] = []

export default () => {
    const { api, setAccountHash } = React.useContext(AppContext)
    const [hash, setHash]: [string, StateSetter<string>] = React.useState('')

    useCancelableCleanup(activePromises)

    return <LogInCard>
        <TextWrapper>
            You are currently not logged into any account. You can either log into an account by
            entering it's hash and clicking the "Log in" button or you can generate a new account.
        </TextWrapper>
        <Input
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder='account hash' />
        <Button
            onClick={() => {
                const cancelable = makeCancelable(api.logIn(hash))
                cancelable
                    .promise
                    .then(({ success }) => {
                        if (success) setAccountHash(hash)
                        else alert('Incorrect hash!')
                    })
                    .catch((e) => {
                        if (!e.isCanceled) alert('Incorrect hash!')
                    })

                activePromises.push(cancelable)
            }}>
            Log in
        </Button>
        <RegisterButton onClick={() => {
            const cancelable = makeCancelable(api.createAccount())

            cancelable
                .promise
                .then(({ accountHash }) => {
                    setAccountHash(accountHash)
                })
                .catch(err => { if (!err.isCanceled) console.error(err) })
        }}>
            Generate a new account
        </RegisterButton>
    </LogInCard>
}