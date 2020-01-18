import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import SidebarItem, { DefaultCollection } from 'Root/Components/library/SidebarItem'

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
    user-select: none;

    &:hover {
        background-color: ${p => p.theme.colors.secondary.dark};
    }
`

interface SideBarProps {
    collections: Collection[],
    selectedCollection: Collection,
    onSelectCollection: (id: string) => void,
    onCreateCollection: () => void,
    onDeleteCollection: (id: string) => void
}

export default React.memo(({ collections, selectedCollection, onSelectCollection, onCreateCollection, onDeleteCollection }: SideBarProps) => {

    return (
        <Wrapper>
            <CreateCollectionButton onClick={onCreateCollection}>
                + Create a collection
            </CreateCollectionButton>
            <List>
                <DefaultCollection
                    onSelect={() => onSelectCollection(null)}
                    isActive={!selectedCollection} />
                {collections.map(c => (
                    <SidebarItem
                        key={c.id}
                        name={c.name}
                        /*itemCount={c.items.length}*/
                        isActive={c === selectedCollection}
                        onSelect={() => onSelectCollection(c.id)}
                        onDelete={() => onDeleteCollection(c.id)} />
                ))}
            </List>
        </Wrapper>
    )
})