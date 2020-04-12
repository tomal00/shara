import * as React from 'react'
import styled from 'styled-components'
import { AppContext } from 'Root/AppContext'
import { StateSetter } from 'Types/etc'
import Loading from 'Components/Loading'
import AccountMenu from 'Containers/AccountMenu'
import LogInMenu from 'Containers/LogIn'

const Wrapper = styled.div`
    min-height: calc(100% - 100px);
    top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: ${p => p.theme.colors.grey.light};
`

export default () => {
    const { accountHash } = React.useContext(AppContext)
    const [isLoaded, setIsLoaded]: [boolean, StateSetter<boolean>] = React.useState(!accountHash)

    return (
        <Wrapper>
            {
                !isLoaded && <Loading />
            }
            {
                !!accountHash ?
                    <AccountMenu onLoad={() => setIsLoaded(true)} /> :
                    <LogInMenu />
            }
        </Wrapper>
    )
}