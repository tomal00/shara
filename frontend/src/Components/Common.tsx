import * as React from 'react'
import styled from 'styled-components'
import * as autosize from 'autosize'

const { useEffect, useRef } = React

export const Button = styled.button`
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    align-self: stretch;
    background-color: ${p => p.theme.colors.secondary.dark};
    border-radius: ${p => p.theme.borderRadius}px;
    transition: background-color 0.2s ease-out, color 0.2s ease-out, opacity 0.2s ease-out;
    cursor: pointer;

    &:hover {
        background-color: ${p => p.theme.colors.primary.base};
        color: ${p => p.theme.colors.primary.text};
    }

    &:focus {
        outline-width: 0;
    }
`

export const Input = styled.input`
    border: none;
    margin: 0;
    height: 30px;
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
    }

    ${p => p.readOnly ? `
        &:hover {
            border-color: ${p.theme.colors.primary.light};
        }
    ` : `
        &:focus {
            border-color: ${p.theme.colors.primary.base};
        }
    `}
`

export const NameInput = styled.input`
    border: none;
    margin: 0;
    line-height: 30px;
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

export const ExpandableTextArea = (props: any) => {
    const textAreaRef = useRef(null)
    useEffect(() => {
        autosize(textAreaRef.current)
    })

    return <textarea {...props} ref={textAreaRef} />
}

export const Description = styled(ExpandableTextArea)`
    align-self: stretch;
    margin: 20px 0;
    word-wrap: break-word;
    border: 0;
    outline: none!important;
    resize: none!important;
    padding: 5px;
    background-color: ${p => p.theme.colors.secondary.light};
    border: 2px solid;
    border-color: ${p => p.theme.colors.secondary.dark};
    transition: border-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    max-height: 176px;
    font-size: 16px;

    &:hover:not(:focus) {
        border-color: ${p => p.theme.colors.primary.light};
    }

    &:focus {
        outline-width: 0;
    }

    ${p => p.readOnly ? `
        &:hover {
            border-color: ${p.theme.colors.primary.light};
        }
    ` : `
        &:focus {
            border-color: ${p.theme.colors.primary.base};
        }
    `}
`