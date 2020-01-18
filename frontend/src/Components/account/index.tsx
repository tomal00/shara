import * as React from 'react'
import styled from 'styled-components'
import AccountCard from 'Components/account/AccountCard'
import LogInCard from 'Components/account/LogInCard'
import { AppContext } from 'Root/AppContext'

const Wrapper = styled.div`
    height: calc(100% - 50px);
    padding-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

export default () => {
    const { accountHash } = React.useContext(AppContext)

    return (
        <Wrapper>
            {
                !!accountHash ?
                    <AccountCard /> :
                    <LogInCard />
            }
        </Wrapper>
    )
}