import styled from 'styled-components'
import * as React from 'react'
import Navigation from 'Components/topbar/Navigation'
import SearchInput from 'Root/Components/topbar/SearchBar'
import Logo from 'Components/topbar/Logo'
import { AppContext } from 'Root/AppContext'
import { useWidth } from 'Root/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StateSetter } from 'Types/etc'

const TopbarWrapper = styled.div`
    height: 48px;
    background-color: ${p => p.theme.colors.white.base};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 20px;
    position: fixed;
    width: calc(100% - 30px);
    min-width: 270px;
    z-index: 999;
    border-bottom: 2px solid ${p => p.theme.colors.grey.base}; 
`

const SearchInputWrapper = styled.div`
    position: absolute;
    width: 400px;
    left: calc(50% - 200px);
    height: 100%;

    @media (max-width: 768px) {
        position: relative;
        left: 0;
    }
`

const MobileSearchInputWrapper = styled.div`
    margin-left: 20px;
    width: inherit;
`

const SearchToggler = styled.a`
    color: ${p => p.theme.colors.primary.base};
    text-decoration: none;
    font-weight: bold;
    font-size: 24px;
    padding: 10px;
    transition: color 0.2s ease-out;
    cursor: pointer;
    user-select: none;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            color:  ${p => p.theme.colors.primary.dark};
        }
    }

`

export default () => {
    const { accountHash } = React.useContext(AppContext)
    const width = useWidth()
    const [isMobileSearchActive, setMobileSearchActive]: [boolean, StateSetter<boolean>] = React.useState(false)

    if (width < 600) {
        return <TopbarWrapper>
            <SearchToggler onClick={() => setMobileSearchActive(!isMobileSearchActive)} >
                <FontAwesomeIcon icon={isMobileSearchActive ? 'bars' : 'search'} />
            </SearchToggler>
            {isMobileSearchActive ? (
                <MobileSearchInputWrapper>
                    <SearchInput />
                </MobileSearchInputWrapper>
            ) : <Navigation />}
        </TopbarWrapper>
    }

    return <TopbarWrapper>
        {(width > 768) && <Logo />}
        {accountHash && <SearchInputWrapper>
            <SearchInput />
        </SearchInputWrapper>}
        <Navigation />
    </TopbarWrapper>
}