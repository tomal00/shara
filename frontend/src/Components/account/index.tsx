import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

const Wrapper = styled.div`
    height: calc(100% - 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

const AccountCard = styled.div`
    padding: 20px;
    width: 400px;
    height: 600px;
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

const Input = styled.input`
    border: none;
    margin: 0;
    height: 30px;
    width: 100%;
    background-color: ${p => p.theme.colors.secondary.light};
    border: 2px solid;
    border-color: ${p => p.theme.colors.secondary.dark};
    transition: border-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    padding: 0 5px;
    text-overflow: ellipsis;

    &:hover:not(:focus) {
        border-color: ${p => p.theme.colors.primary.light};
    }

    &:focus {
        outline-width: 0;
        border-color: ${p => p.theme.colors.primary.base};
    }
`

const Button = styled.button`
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    align-self: stretch;
    background-color: ${p => p.theme.colors.secondary.dark};
    border-radius: ${p => p.theme.borderRadius}px;
    transition: background-color 0.2s ease-out, color 0.2s ease-out;
    cursor: pointer;
    grid-column-start: 2;
    grid-column-end: 3;

    &:hover {
        background-color: ${p => p.theme.colors.primary.base};
        color: ${p => p.theme.colors.primary.text};
    }

    &:focus {
        outline-width: 0;
    }
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

const NameInput = styled.input`
    border: none;
    margin: 0;
    height: 50px;
    font-size: 20px;
    font-weight: bold;
    justify-self: center;
    text-align: center;
    transition: border-color 0.2s ease-out;
    padding: 0 5px;
    text-overflow: ellipsis;
    grid-column: span 2;
    background: transparent;
    border-bottom: 2px solid transparent;

    &:hover:not(:focus) {
        border-color: ${p => p.theme.colors.primary.light};
    }

    &:focus {
        outline-width: 0;
        border-color: ${p => p.theme.colors.primary.base};
    }
`

export default () => (
    <Wrapper>
        <AccountCard>
            <NameInput />
            <Avatar />
            <Input />
            <Button>Verify</Button>
            <Button>Send to e-mail</Button>
            <Button>Generate new</Button>
        </AccountCard>
    </Wrapper>
)