import styled from 'styled-components'
import * as React from 'react'
import Navigation from 'Components/topbar/Navigation'
import SearchInput from 'Root/Components/topbar/SearchBar'
import Logo from 'Components/topbar/Logo'
import { AppContext } from 'Root/AppContext'
import { useWidth } from 'Root/hooks'

const TopbarWrapper = styled.div`
    height: 50px;
    background-color: ${p => p.theme.colors.primary.base};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 20px;
    position: fixed;
    width: calc(100% - 30px);
    min-width: 270px;
    z-index: 999;
`

const SearchInputAbsoluteWrapper = styled.div`
    position: absolute;
    width: 400px;
    left: calc(50% - 200px);
    height: 100%;
`

export default () => {
    const { accountHash } = React.useContext(AppContext)
    const width = useWidth()

    return <TopbarWrapper>
        <Logo />
        {
            (width > 768 && accountHash) && <SearchInputAbsoluteWrapper>
                <SearchInput />
            </SearchInputAbsoluteWrapper>
        }
        <Navigation />
    </TopbarWrapper>
}