import * as React from 'react'
import styled from 'styled-components'
import { Button, Input, NameInput } from 'Components/Common'

const AccountCard = styled.div`
    padding: 20px;
    width: 400px;
    height: 300px;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.secondary.base};
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 25px 120px 30px 30px 30px;
    grid-row-gap: 15px;
    align-items: center;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
`

const CustomInput = styled(Input)`
width: 100%;
`

const Avatar = styled.div`
    box-sizing: border-box;
    height: 100px;
    width: 100px;
    justify-self: center;
    border-radius: 50%;
    grid-column: span 2;
    border: 3px solid ${p => p.theme.colors.primary.base};
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease-out;
    align-self: start;

    &:hover {
        border-color: ${p => p.theme.colors.primary.dark};

        &::after {
            opacity: 0.5;
        }
    }

    &::after {
        cursor: pointer;
        transition: opacity 0.2s ease-out;
        content: "";
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        background-color: white;
        background-position: center;
        background-size: cover;
        background-image: url(https://images-na.ssl-images-amazon.com/images/I/51GfWevWFiL._SX425_.jpg);
    }
`

export default () => (
    <AccountCard>
        <NameInput placeholder='Nickname' />
        <Avatar />
        <CustomInput value='some hash' readOnly />
        <Button>Logout</Button>
        <CustomInput placeholder='Enter e-mail address here...' />
        <Button>Send hash</Button>
    </AccountCard>
)