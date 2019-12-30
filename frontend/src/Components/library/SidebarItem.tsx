import * as React from 'react'
import styled from 'styled-components'

const ListItem = styled.li`
    line-height: 30px;
    padding: 5px 10px;
    margin: 10px;
    cursor: pointer;
    background-color: inherit;
    transition: background-color 0.2s ease-out;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-radius: ${p => p.theme.borderRadius}px;

    &:hover {
        background-color: ${p => p.theme.colors.secondary.dark};
    }

    &.active {
        background-color: ${p => p.theme.colors.primary.light};
        color: ${p => p.theme.colors.primary.text};
        cursor: default;
    }
`

const CollectionName = styled.div`
    font-size: 18px;
`

const ItemCount = styled.div`
    font-size: 14px;
`

interface CollectionItemProps {
    name: string,
    type?: string,
    key?: any,
    itemCount: number,
    isActive: boolean
}

export default ({ name, itemCount, isActive }: CollectionItemProps) => {

    return <ListItem className={isActive ? 'active' : ''} >
        <CollectionName>{name}</CollectionName>
        <ItemCount>{itemCount}</ItemCount>
    </ListItem>
}

