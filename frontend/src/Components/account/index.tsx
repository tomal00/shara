import * as React from 'react'
import styled from 'styled-components'
import AccountCard from 'Components/account/AccountCard'
import LogInCard from 'Components/account/LogInCard'

const Wrapper = styled.div`
    height: calc(100% - 50px);
    padding-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

export default () => {
    const isLogged = false

    return (
        <Wrapper>
            {
                isLogged ?
                    <AccountCard /> :
                    <LogInCard />
            }
        </Wrapper>
    )
}