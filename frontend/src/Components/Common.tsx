import * as React from 'react'
import styled from 'styled-components'
import * as autosize from 'autosize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StateSetter } from 'Types/etc'

const { useEffect, useRef, useState } = React

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

    &:hover {
        background-color: ${p => p.theme.colors.primary.dark};
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

    &:hover:not(:focus) {
        border-color: ${p => p.theme.colors.primary.base};
    }

    &:focus {
        outline-width: 0;
    }

    ${p => p.readOnly ? `
        &:hover {
            border-color: ${p.theme.colors.primary.base};
        }
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

    ${p => p.readOnly ? `

    ` : `
        &:hover:not(:focus) {
            border-color: ${p.theme.colors.primary.base};
        }

        &:focus {
            outline-width: 0;
            border-color: ${p.theme.colors.primary.dark};
        }
    `}
`

export const ExpandableTextArea = (props: any) => {
    const textAreaRef = useRef(null)
    useEffect(() => {
        autosize(textAreaRef.current)

        return () => autosize.destroy(textAreaRef.current)
    }, [])
    useEffect(() => {
        autosize.update(textAreaRef.current)
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

    &:hover:not(:focus) {
        border-color: ${p => p.theme.colors.primary.base};
    }

    &:focus {
        outline-width: 0;
    }

    ${p => p.readOnly ? `
        &:hover {
            border-color: ${p.theme.colors.primary.base};
        }
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

const DropdownIcon = styled(FontAwesomeIcon)`
    font-size: 12px;
    margin-left: 5px;
`

const DropdownTitle = styled.div`
    font-size: 18px;
    cursor: pointer;
    padding: 10px 0;
    user-select: none;

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

    &:hover {
        border-color: ${p => p.theme.colors.primary.base};
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

    &:hover:not(.empty) {
        background-color: ${p => p.theme.colors.grey.base};
    }
`

interface DropdownItemType {
    name: string,
    value: any,
    key?: any
}

export const Dropdown = (
    {
        placeholder,
        items,
        onSelect,
        initiallySelectedItem,
        emptyDropdownText
    }: {
        placeholder: string,
        items: DropdownItemType[],
        initiallySelectedItem?: DropdownItemType
        onSelect: (item: DropdownItemType) => void,
        emptyDropdownText: string
    }
) => {
    const [selectedItem, selectItem]: [DropdownItemType, StateSetter<DropdownItemType>] = useState(initiallySelectedItem)
    const [isExpanded, setIsExpanded]: [boolean, StateSetter<boolean>] = useState(false)

    return <DropdownWrapper>
        <DropdownTitle
            className={!initiallySelectedItem ? 'with-placeholder' : ''}
            onClick={() => setIsExpanded(!isExpanded)} >
            {selectedItem ? selectedItem.name : placeholder}
            <DropdownIcon icon='chevron-down' />
        </DropdownTitle>
        {
            isExpanded && <DropdownItems>
                {
                    items.length ? (items.map((i) => (
                        <DropdownItem
                            key={i.key || i.value}
                            onClick={() => {
                                selectItem(i)
                                setIsExpanded(false)
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