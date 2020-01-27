import styled from 'styled-components'
import * as React from 'react'
const logo = require("Assets/logo_no_text.png").default

const Logo = styled.div`
    justify-self: flex-start;
    display: flex;
    height: 100%;
    position: relative;
    align-items: center;
`

const Image = styled.img`
    height: 28px;
`

const Title = styled.div`
    margin-left: 5px;
    font-size: 25px;
    font-family: 'Questrial', sans-serif;
    font-weight: bold;
`

export default () => {
    return <Logo>
        <Image src={logo} />
        <Title>Shara</Title>
    </Logo>
}