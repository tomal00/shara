import styled from 'styled-components'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const { useState } = React

const Input = styled.input`
    padding: 0 5px 0 33px;
    height: 100%;
    border: none;
    background-color: ${p => p.theme.colors.secondary.light};
    color: ${p => p.theme.colors.secondary.text};
    border-radius: ${p => p.theme.borderRadius}px;
    text-overflow: ellipsis;
    width: inherit;

    &:focus {
        outline-width: 0;
    }

    &::placeholder {
        font-size: 15px;
        color: ${p => p.theme.colors.secondary.text};
    }
`

const InputWrapper = styled.div`
    height: 100%;
    position: relative;
    padding: 8px 0;
    box-sizing: border-box;
    font-size: 18px;
    margin-right: 20px;
    width: inherit;
`

const StyledIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: calc(50% - 9px);
    left: 10px;
    color: ${p => p.theme.colors.secondary.text};
    transition: color 0.2s ease-out;

    ${InputWrapper}.input-focused & {
        color: ${p => p.theme.colors.secondary.dark};
    }
`

export default () => {
    const [isInputFocused, setInputFocused] = useState(false)

    return (
        <InputWrapper className={`${isInputFocused ? 'input-focused' : ''}`}>
            <StyledIcon icon='search' />
            <Input
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder='search through your images...' />
        </InputWrapper>
    )
}
