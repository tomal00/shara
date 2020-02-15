import styled from 'styled-components'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FooterWrapper = styled.div`
    height: 50px;
    background: ${p => p.theme.colors.primary.base};
    position: relative;
    top: 50px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    color: ${p => p.theme.colors.secondary.text};
`

const References = styled.div`
    font-size: 22px;
`

const StyledAnchor = styled.a`
    color: white;
    padding: 3px;
`

const Icon = styled(FontAwesomeIcon)`
    color: white;
    transition: color 0.2s ease-out;

    @media (hover: hover) and (pointer: fine) {
        ${StyledAnchor}:hover & {
            color: ${p => p.theme.colors.secondary.base};
        }
    }
`

export default () => {

    return <FooterWrapper>
        <span>2020, Created by Tomáš Malec</span>
        <References>
            <StyledAnchor target='_blank' href={encodeURI('https://github.com/tomal00/shara')} >
                <Icon icon={['fab', 'github']} />
            </StyledAnchor>
        </References>
    </FooterWrapper>
}