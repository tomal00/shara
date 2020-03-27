import * as React from 'react'
import styled from 'styled-components'
import { Button, Input } from 'Components/Common'
import { shell } from 'electron'
import { websiteUrl } from '../../../config.json'

const { useState } = React

const Wrapper = styled.div`
    background: ${p => p.theme.colors.grey.light};
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 50% 25% 25%;
    justify-items: stretch;
    align-items: center;
    padding: 20px;
    height: 100vh;
`

const Message = styled.div`
    
`

const StyledLink = styled.a`
    color: inherit;
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
        color: ${p => p.theme.colors.primary.base};
    }
`

interface MenuProps {
    onLogIn: (hash: string) => void
}

export default ({ onLogIn }: MenuProps) => {
    const [logInHash, setLogInHash] = useState('')

    return <Wrapper>
        <Message>
            {`
                    You are currently not logged in. Log in by entering your account's hash.
                    You can generate an account 
                    `}
            <StyledLink onClick={() => {
                shell.openExternal(`${websiteUrl}/account`)
            }}>
                {'here'}
            </StyledLink>
            {` if you don't have one yet.`}
        </Message>
        <Input value={logInHash} onChange={e => setLogInHash(e.target.value)} />
        <Button onClick={() => onLogIn(logInHash)}>Log in</Button>
    </Wrapper>

}