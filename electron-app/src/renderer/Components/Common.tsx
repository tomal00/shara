import styled from 'styled-components'

export const Button = styled.button`
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    background-color: ${p => p.theme.colors.primary.base};
    color: ${p => p.theme.colors.primary.text};
    border-radius: ${p => p.theme.borderRadius}px;
    transition: background-color 0.2s ease-out, color 0.2s ease-out, opacity 0.2s ease-out;
    cursor: pointer;
    outline: none!important;
    height: 43px;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            background-color: ${p => p.theme.colors.primary.dark};
        }
    }

    &:focus {
        outline-width: 0;
    }
`

export const Input = styled.input`
    border: none;
    margin: 0;
    height: 43px;
    background-color: ${p => p.theme.colors.white.base};
    border: 2px solid;
    border-color: ${p => p.theme.colors.grey.dark};
    transition: border-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    padding: 0 5px;
    text-overflow: ellipsis;
    outline: none!important;

    @media (hover: hover) and (pointer: fine) {
        &:hover:not(:focus) {
            border-color: ${p => p.theme.colors.primary.base};
        }
        ${p => p.readOnly ? `
            &:hover {
                    border-color: ${p.theme.colors.primary.base};
                }
            ` : `
        `}
    }

    &:focus {
        outline-width: 0;
    }

    ${p => p.readOnly ? `
    ` : `
        &:focus {
            border-color: ${p.theme.colors.primary.dark};
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
    background: transparent;
    border-bottom: 2px solid transparent;
    outline: none!important;
    min-width: 0;

    ${p => p.readOnly ? `

    ` : `
        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:focus) {
                border-color: ${p.theme.colors.primary.base};
            }
        }

        &:focus {
            outline-width: 0;
            border-color: ${p.theme.colors.primary.dark};
        }
    `}
`