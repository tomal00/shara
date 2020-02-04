import * as React from 'react'
import styled from 'styled-components'
import { Input, Button } from 'Components/Common'
import { AppContext } from 'Root/AppContext'
import { makeCancelable } from 'Root/helpers'
import { Cancelable } from 'Root/Types/cancelable'
import { useCancelableCleanup } from 'Root/hooks'
import { StateSetter } from 'Types/etc'

const LogInCard = styled.div`
    padding: 50px 70px;
    width: 540px;
    max-width: 90%;
    box-sizing: border-box;
    height: fit-content;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.white.base};
    border: 1px solid ${p => p.theme.colors.grey.base};
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto 43px auto auto;
    grid-row-gap: 15px;
    align-items: center;
    grid-row-gap: 20px;
    grid-column-gap: 20px;

    @media (max-width: 450px) {
        padding: 30px 30px;
    }
`

const RegisterButton = styled(Button)`
    grid-column: span 2;
    padding: 10px 15px;
    justify-self: stretch;
`

const LogInButton = styled(Button)`
    grid-column: span 2;
    padding: 10px 15px;
    justify-self: stretch;
    margin-bottom: 15px;
`

const TextWrapper = styled.div`
    grid-column: span 2;
`

const StyledInput = styled(Input)`
    height: 100%;
    grid-column: span 2;
    justify-self: stretch;
`

const Title = styled.div`
    grid-column: span 2;
    font-size: 26px;
    text-align: center;
`

const activePromises: Cancelable<any>[] = []

export default () => {
    const { api, setAccountHash } = React.useContext(AppContext)
    const [hash, setHash]: [string, StateSetter<string>] = React.useState('')

    useCancelableCleanup(activePromises)

    return <LogInCard>
        <Title>Not logged in</Title>
        <TextWrapper>
            You are currently not logged into any account. You can either log into an account by
            entering it's hash and clicking the "Log in" button or you can generate a new account.
        </TextWrapper>
        <StyledInput
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder='account hash' />
        <LogInButton
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
        </LogInButton>
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