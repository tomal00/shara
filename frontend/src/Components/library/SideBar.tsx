import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import SidebarItem from 'Root/Components/library/SidebarItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
    height: 100%;
    width: 250px;
    background-color: ${p => p.theme.colors.secondary.base};
    display: inline-block;
    position: fixed;
`

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
`

const CreateCollectionButton = styled.div`
    line-height: 30px;
    padding: 5px 10px;
    margin: 10px;
    cursor: pointer;
    background-color: inherit;
    transition: background-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    font-size: 20px;

    &:hover {
        background-color: ${p => p.theme.colors.secondary.dark};
    }
`

export default () => {
    const collections: Collection[] = [
        { name: 'Collection 1', id: 1, items: [] }, { name: 'Collection 2', id: 2, items: [] }, { name: 'Collection 3', id: 3, items: [] }
    ]

    return (
        <Wrapper>
            <CreateCollectionButton>
                + Create a collection
            </CreateCollectionButton>
            <List>
                {collections.map(c => (
                    <SidebarItem
                        key={c.id}
                        name={c.name}
                        itemCount={c.items.length}
                        isActive={c.id === 1} />
                ))}
            </List>
        </Wrapper>
    )
}