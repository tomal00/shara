import * as React from 'react'
import styled from 'styled-components'
import * as autosize from 'autosize'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { RotateProp } from '@fortawesome/fontawesome-svg-core'
import { useCallbackOnOutsideClick } from 'Root/hooks'
import ReactTooltip from 'react-tooltip'

const { useEffect, useRef } = React

export const DesktopOnlyTooltip = styled(ReactTooltip)`
    display: none!important;

    @media (hover: hover) and (pointer: fine) {
        display: block!important;
    }
`

export const StyledTooltip = styled(({ className, tooltipProps = {} }: { className?: string, isPrimaryColor?: boolean, tooltipProps?: ReactTooltip.Props }) => {

    return <DesktopOnlyTooltip className={className} {...tooltipProps} />
})`
    background-color: ${p => p.isPrimaryColor ? p.theme.colors.primary.base : p.theme.colors.secondary.base}!important;
    border: 2px solid ${p => p.isPrimaryColor ? p.theme.colors.secondary.base : p.theme.colors.primary.base}!important;
    padding: 5px 10px!important;
    font-size: 14px!important;

    &::after {
        border-${
    p => p.tooltipProps && p.tooltipProps.place ? p.tooltipProps.place : 'top'
    }-color: ${
    p => p.isPrimaryColor ? p.theme.colors.secondary.base : p.theme.colors.primary.base
    }!important;
    }
`

export const Button = styled.button`
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    align-self: stretch;
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
    height: 30px;
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

export const ExpandableTextArea = (props: any) => {
    const textAreaRef = useRef<Element>(null)
    useEffect(() => {
        if (textAreaRef.current) autosize(textAreaRef.current)

        return () => { textAreaRef.current && autosize.destroy(textAreaRef.current) }
    }, [])
    useEffect(() => {
        if (textAreaRef.current) autosize.update(textAreaRef.current)
    }, [props.value])

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
    background-color: ${p => p.theme.colors.white.base};
    border: 2px solid;
    border-color: ${p => p.theme.colors.grey.dark};
    transition: border-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    max-height: 176px;
    font-size: 16px;
    box-sizing: content-box;

    @media (hover: hover) and (pointer: fine) {
        &:hover:not(:focus) {
            border-color: ${p => p.theme.colors.primary.base};
        }
        ${p => p.readOnly ? `
            &:hover {
                border-color: ${p.theme.colors.primary.base};
            }
        ` : ``}
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

const DropdownWrapper = styled.div`
    position: relative;
    width: 100%;
    margin-top: 10px;
`

const DropdownIcon = styled(FontAwesomeIcon) <FontAwesomeIconProps>`
    font-size: 12px;
    margin-left: 5px;
    transition: all 0.2s ease-out;
`

const DropdownTitle = styled.div`
    font-size: 18px;
    padding: 10px 0;
    user-select: none;

    & > span {
        cursor: pointer;
    }

    &.with-placeholder {
        
    }
`

const DropdownItems = styled.ul`
    position: absolute;
    list-style-type: none;
    margin: 0;
    background-color: ${p => p.theme.colors.white.base};
    border: 2px solid ${p => p.theme.colors.grey.dark};
    border-radius: ${p => p.theme.borderRadius}px;
    width: calc(100% - 4px);
    padding: 0;
    transition: background-color 0.2s ease-out;
    box-shadow: 
        rgba(51, 51, 51, 0.2) 2.5px 2.5px 7.5px, 
        rgba(51, 51, 51, 0.2) 2.5px -2.5px 7.5px, 
        rgba(51, 51, 51, 0.2) -2.5px 2.5px 7.5px, 
        rgba(51, 51, 51, 0.2) -2.5px -2.5px 7.5px;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            border-color: ${p => p.theme.colors.primary.base};
        }
    }
`

const DropdownItem = styled.li`
    transition: background-color 0.2s ease-out;
    cursor: pointer;
    padding: 5px 10px;

    &:first-child {
        padding-top: 10px;
    }

    &:last-child {
        padding-bottom: 10px;
    }

    @media (hover: hover) and (pointer: fine) {
        &:hover:not(.empty) {
            background-color: ${p => p.theme.colors.grey.base};
        }
    }
`

interface DropdownItemType {
    name: string,
    value: any,
    key?: any
}

interface DropdownState {
    selectedItem?: DropdownItemType,
    isExpanded: boolean
}

interface UnmergedState {
    selectedItem?: DropdownItemType,
    isExpanded?: boolean
}

export const Dropdown = (
    {
        placeholder,
        items,
        onSelect,
        initiallySelectedItem,
        emptyDropdownText,
        className
    }: {
        placeholder: string,
        items: DropdownItemType[],
        initiallySelectedItem?: DropdownItemType,
        onSelect: (item: DropdownItemType) => void,
        emptyDropdownText: string,
        className?: string
    }
) => {
    const [state, setState] = React.useReducer(
        (state: DropdownState, newState: UnmergedState): DropdownState => ({ ...state, ...newState }),
        { selectedItem: initiallySelectedItem, isExpanded: false }
    )
    const { selectedItem, isExpanded } = state
    const ref = useRef(null)
    useCallbackOnOutsideClick(() => { setState({ isExpanded: false }) }, ref)

    return <DropdownWrapper className={className} ref={ref}>
        <DropdownTitle
            className={!initiallySelectedItem ? 'with-placeholder' : ''} >
            <span onClick={() => setState({ isExpanded: !isExpanded })}>
                {selectedItem ? selectedItem.name : placeholder}
                <DropdownIcon icon='chevron-down' rotation={isExpanded ? 180 as RotateProp : undefined} />
            </span>
        </DropdownTitle>
        {
            isExpanded && <DropdownItems>
                {
                    items.length ? (items.map((i) => (
                        <DropdownItem
                            key={i.key || i.value}
                            onClick={() => {
                                setState({ ...state, selectedItem: i, isExpanded: false })
                                onSelect(i)
                            }}>
                            {i.name}
                        </DropdownItem>
                    ))) : (
                            <DropdownItem className='empty' style={{ color: 'inherit', cursor: 'unset' }} >
                                {emptyDropdownText}
                            </DropdownItem>
                        )
                }
            </DropdownItems>
        }
    </DropdownWrapper>
}