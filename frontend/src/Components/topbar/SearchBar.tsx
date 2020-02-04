import styled from 'styled-components'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from 'Root/AppContext'
import { StateSetter } from 'Types/etc'
import { Image } from 'Types/file'
import { useHistory } from 'react-router-dom'

const { useState, useContext } = React

const Input = styled.input`
    padding: 0 5px 0 33px;
    height: 100%;
    border: none;
    background-color: ${p => p.theme.colors.secondary.base};
    color: ${p => p.theme.colors.primary.text};
    border-radius: ${p => p.theme.borderRadius}px;
    text-overflow: ellipsis;
    width: inherit;
    transition: background-color 0.2s ease-out;
    font-size: 16px;

    &:focus {
        outline-width: 0;
        background-color: ${p => p.theme.colors.secondary.dark};

        &::placeholder {
            color: ${p => p.theme.colors.secondary.light};
        }

        &.empty {
            color: ${p => p.theme.colors.secondary.light};
        }
    }

    &::placeholder {
        font-size: 15px;
        transition: color 0.2s ease-out;
        color: ${p => p.theme.colors.white.base};
    }

    &.has-results {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
`

const InputWrapper = styled.div`
    height: 100%;
    position: relative;
    padding: 4px 0;
    box-sizing: border-box;
    font-size: 18px;
    width: inherit;
    width: 100%;
`

const StyledIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: calc(50% - 9px);
    left: 10px;
    color: ${p => p.theme.colors.white.base};
    transition: color 0.2s ease-out;

    ${InputWrapper}.input-focused & {
        color: ${p => p.theme.colors.secondary.light};
    }

    &.can-search {
        cursor: pointer;
    }
`

const ResultList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute
    background-color: ${p => p.theme.colors.white.base};
    width: calc(100% - 4px);
    border: 2px solid ${p => p.theme.colors.secondary.base};
    border-bottom-left-radius: ${p => p.theme.borderRadius}px;
    border-bottom-right-radius: ${p => p.theme.borderRadius}px;

    ${InputWrapper}.input-focused & {
        border-color: ${p => p.theme.colors.secondary.dark};
    }
`

const ResultItem = styled.li`
    font-size: medium;
    padding: 5px 10px;
    user-select: none;
    transition: background-color 0.2s ease-out, color 0.2s ease-out;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const ItemName = styled.span`
    font-weight: bold;

    @media (hover: hover) {
        ${ResultItem}:hover & {
            color: ${p => p.theme.colors.secondary.light};
        }
    }
`

const ItemDescription = styled.span`
    font-style: italic;
    margin-left: 5px;
`

export default () => {
    const [isInputFocused, setInputFocused]: [boolean, StateSetter<boolean>] = useState(false)
    const [inputValue, setInputValue]: [string, StateSetter<string>] = useState('')
    const [searchResults, setSearchResults]: [Image[], StateSetter<Image[]>] = useState([])
    const history = useHistory()
    const isInputEmpty = !inputValue
    const { api } = useContext(AppContext)

    return (
        <InputWrapper className={`${isInputFocused ? 'input-focused' : ''}`}>
            <StyledIcon
                icon='search'
                className={inputValue ? 'can-search' : ''}
                onClick={() => {
                    if (!inputValue) return

                    api.searchForImage(inputValue)
                        .then(({ success, results }) => {
                            if (success) {
                                setSearchResults(results)
                            }
                        })
                        .catch(e => console.error(e))
                }} />
            <Input
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder='search through your images...'
                value={inputValue}
                onKeyDown={(e) => {
                    if (e.keyCode === 13 && inputValue) {
                        api.searchForImage(inputValue)
                            .then(({ success, results }) => {
                                if (success) {
                                    setSearchResults(results)
                                }
                            })
                            .catch(e => console.error(e))
                    }
                }}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    if (!e.target.value) {
                        setSearchResults([])
                    }
                }}
                className={`${searchResults.length ? 'has-results' : ''} ${isInputEmpty ? 'empty' : ''}`} />
            {
                !!searchResults.length && <ResultList>
                    {
                        searchResults.map(r => (
                            <ResultItem
                                key={r.id}
                                onClick={() => {
                                    setInputValue('')
                                    setSearchResults([])
                                    history.push(`/image/${r.id}`)
                                }}>
                                <ItemName>{r.name}</ItemName>
                                <ItemDescription>- {r.description ? r.description : 'No description'}</ItemDescription>
                            </ResultItem>
                        ))
                    }
                </ResultList>
            }
        </InputWrapper>
    )
}
