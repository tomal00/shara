import * as React from 'react'
import styled from 'styled-components'
import { Input, Button } from 'Components/Common'

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

export default () => (
    <LogInCard>
        <TextWrapper>
            You are currently not logged into any account. You can either log into an account by
            entering it's hash and clicking the "Log in" button or you can generate a new account.
        </TextWrapper>
        <Input placeholder='account hash' />
        <Button>Log in</Button>
        <RegisterButton>Generate a new account</RegisterButton>
    </LogInCard>
)