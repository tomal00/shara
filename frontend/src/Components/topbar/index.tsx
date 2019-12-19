import styled from 'styled-components'
import * as React from 'react'

import Navigation from 'Components/topbar/Navigation'
import SearchInput from 'Components/topbar/SearchInput'
import Logo from 'Components/topbar/Logo'

const TopbarWrapper = styled.div`
    position: relative;
    height: 50px;
    background-color: ${p => p.theme.colors.primary.base};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 20px;
`

const SearchInputAbsoluteWrapper = styled.div`
    position: absolute;
    width: 400px;
    left: calc(50% - 200px);
    height: 100%;
`

export default () => <TopbarWrapper>
    <Logo />
    <SearchInputAbsoluteWrapper>
        <SearchInput />
    </SearchInputAbsoluteWrapper>
    <Navigation />
</TopbarWrapper>