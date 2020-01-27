import styled from 'styled-components'
import * as React from 'react'

const FooterWrapper = styled.div`
    height: 50px;
    background: ${p => p.theme.colors.primary.base};
    position: relative;
    top: 50px;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: ${p => p.theme.colors.secondary.text};
`


export default () => {

    return <FooterWrapper>
        2020, Made by Tomáš Malec
    </FooterWrapper>
}