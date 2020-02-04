import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ListItem = styled.li`
    line-height: 30px;
    margin: 10px;
    background-color: inherit;
    cursor: pointer;
    position: relative;
`

const CollectionName = styled.div`
    font-size: 18px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: content-box;
    padding: 5px 20px 5px 10px;
    width: calc(100% - 34px);

    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    border: 2px solid transparent;
    
    @media (hover: hover) {
        &:hover {
            background-color: ${p => p.theme.colors.grey.base};
            border-color: ${p => p.theme.colors.grey.base};
        }
    }

    ${ListItem}.active & {
        background-color: ${p => p.theme.colors.grey.base};
        border-color: ${p => p.theme.colors.grey.dark};
        cursor: default;
    }
`

const ItemCount = styled.div`
    font-size: 14px;
`

const StyledIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    transition: color 0.2s ease-out;
    font-size: 20px;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    padding: 0 10px;

    @media (hover: hover) {
        &:hover {
            color: #e53935;
        }
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

    return <ListItem className={isActive ? 'active' : ''} >
        <CollectionName onClick={onSelect} >{name}</CollectionName>
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
    return <ListItem className={isActive ? 'active' : ''} >
        <CollectionName onClick={onSelect}>
            All images
        </CollectionName>
        {/*<ItemCount>{itemCount}</ItemCount>*/}
    </ListItem>
}