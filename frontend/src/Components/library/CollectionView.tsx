import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import { NameInput } from 'Components/Common'
import { Image } from 'Types/file'
import CollectionItem from 'Components/library/CollectionItem'
import { StateSetter } from 'Types/etc'

const Wrapper = styled.div`
    ${(p: { isReduced: boolean }) => p.isReduced ? `
    width: 100%;
    ` :
        `
    width: calc(100% - 250px);
    position: relative;
    left: 250px;
    `
    }
`

const CollectionTitle = styled.div`
    width: calc(100% - 80px);
    margin: 40px 40px 20px 40px;
    display: flex;
    justify-content: flex-start;
`

const StyledNameInput = styled(NameInput)`
    font-size: 25px;
    text-align: left;
    width: 100%;

    ${p => p.readOnly ? `
        border: none!important;
    ` : ``}
`

const CollectionWrapper = styled.div`
    padding: 0 20px;
`

interface CollectionViewProps {
    selectedCollection: Collection,
    images: Image[],
    onChangeCollectionName: (name: string, collectionId: string) => void,
    isReduced: boolean
}

export default React.memo(({ selectedCollection, images, onChangeCollectionName, isReduced }: CollectionViewProps) => {
    const [collectionName, setCollectionName]: [string, StateSetter<string>]
        = React.useState(!!selectedCollection ? selectedCollection.name : 'All images')

    React.useEffect(() => {
        setCollectionName(!!selectedCollection ? selectedCollection.name : 'All images')
    }, [selectedCollection && selectedCollection.id])

    return <Wrapper isReduced={isReduced} >
        <CollectionTitle>
            <StyledNameInput
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                readOnly={!selectedCollection}
                onBlur={() => {
                    if (!selectedCollection) return
                    if (collectionName && collectionName !== selectedCollection.name) {
                        onChangeCollectionName(collectionName, selectedCollection.id)
                    }
                    else setCollectionName(selectedCollection.name)
                }} />
        </CollectionTitle>
        <CollectionWrapper>
            {images.map((item: Image) => (
                <CollectionItem image={item} key={item.id} />
            ))}
        </CollectionWrapper>
    </Wrapper>
})