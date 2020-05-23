import * as React from 'react'
import styled from 'styled-components'
import { Input, Button } from 'Components/Common'

const LogInCard = styled.div`
    padding: 50px 70px;
    width: 540px;
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
    margin: 10px 5%;

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

interface LogInCardProps {
    onLogIn: (hash: string) => void,
    onRegister: () => void
}

export default ({ onLogIn, onRegister }: LogInCardProps) => {
    const [hash, setHash] = React.useState<string>('')

    return <LogInCard>
        <Title>Not logged in</Title>
        <TextWrapper>
            You are currently not logged into any account. You can either log into an account by
            entering it's hash and clicking the "Log in" button or you can generate a new account.
        </TextWrapper>
        <StyledInput
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            maxLength={128}
            placeholder='account hash' />
        <LogInButton
            onClick={() => onLogIn(hash)}>
            Log in
        </LogInButton>
        <RegisterButton onClick={onRegister}>
            Generate a new account
        </RegisterButton>
    </LogInCard>
}