import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ListItem = styled.li`
    line-height: 30px;
    padding: 5px 10px;
    margin: 10px;
    background-color: inherit;
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: ${p => p.theme.borderRadius}px;
    border: 2px solid transparent;
    cursor: pointer;

    &:hover {
        background-color: ${p => p.theme.colors.grey.base};
        border-color: ${p => p.theme.colors.grey.base};
    }

    &.active {
        background-color: ${p => p.theme.colors.grey.base};
        border-color: ${p => p.theme.colors.grey.dark};
        cursor: default;
    }
`

const CollectionName = styled.div`
    font-size: 18px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 15px;
`

const ItemCount = styled.div`
    font-size: 14px;
`

const StyledIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    transition: color 0.2s ease-out;
    font-size: 20px;

    &:hover {
        color: #e53935;
    }
`

interface CollectionItemProps {
    name: string,
    type?: string,
    key?: any,
    /*itemCount: number,*/
    isActive: boolean,
    onSelect: () => void,
    onDelete: () => void
}

export default ({ name, /*itemCount,*/ isActive, onSelect, onDelete }: CollectionItemProps) => {

    return <ListItem onClick={onSelect} className={isActive ? 'active' : ''} >
        <CollectionName>{name}</CollectionName>
        <StyledIcon icon='trash-alt' onClick={onDelete} />
        {/*<ItemCount>{itemCount}</ItemCount>*/}
    </ListItem>
}

interface DefaultCollectionProps {
    onSelect: () => void,
    isActive: boolean,
    style?: any
    /*itemCount: number,*/
}

export const DefaultCollection = ({ onSelect, isActive }: DefaultCollectionProps) => {
    return <ListItem onClick={onSelect} className={isActive ? 'active' : ''} >
        <CollectionName>All images</CollectionName>
        {/*<ItemCount>{itemCount}</ItemCount>*/}
    </ListItem>
}