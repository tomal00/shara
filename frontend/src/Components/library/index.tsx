import * as React from 'react'
import styled from 'styled-components'
import CollectionView from 'Root/Components/library/CollectionView'
import SideBar from 'Components/library/SideBar'
import { Collection } from 'Types/collection'
import { useWidth } from 'Root/hooks'
import { Image } from 'Types/file'
import Loading from 'Components/Loading'

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: stretch;
    top: 50px;
    min-height: calc(100% - 50px);
    background: ${p => p.theme.colors.grey.light};
`

interface LibraryProps {
    selectedCollection: Collection | null,
    collections: Collection[] | null,
    images: Image[] | null,
    onSelectCollection: (id: string | null) => void,
    onCreateCollection: () => void,
    onDeleteCollection: (id: string) => void,
    onUpdateCollectionName: (name: string, id: string) => void
}

export default ({
    selectedCollection, collections, images, onSelectCollection, onCreateCollection,
    onDeleteCollection, onUpdateCollectionName
}: LibraryProps) => {
    const width = useWidth()
    const isReduced = width < 512

    if (!images || !collections) {
        return <Wrapper>
            <Loading />
        </Wrapper>
    }

    const currentCollectionImages = selectedCollection ?
        images.filter(i => i.collectionId === selectedCollection.id) : images


    return (
        <Wrapper>
            {<SideBar
                isReduced={isReduced}
                collections={collections}
                selectedCollection={selectedCollection}
                onSelectCollection={(id: string | null) => onSelectCollection(id)}
                onCreateCollection={onCreateCollection}
                onDeleteCollection={(id: string) => onDeleteCollection(id)} />}
            {<CollectionView
                isReduced={isReduced}
                selectedCollection={selectedCollection}
                images={currentCollectionImages}
                onChangeCollectionName={(newName, collectionId) => {
                    onUpdateCollectionName(newName, collectionId)
                }} />}
        </Wrapper>
    )
}