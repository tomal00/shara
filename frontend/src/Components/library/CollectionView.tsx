import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import { NameInput } from 'Components/Common'
import { Image } from 'Types/file'
import CollectionItem from 'Components/library/CollectionItem'
import { StateSetter } from 'Types/etc'
import { Link } from 'react-router-dom'

const StyledLink = styled(Link)`
    text-decoration: underline;
    color: inherit;
`

const Wrapper = styled.div`
    position: relative;

    &:not(.reduced) {
        width: calc(100% - 250px);
        left: 250px;
    }
    &.reduced {
        width: 100%;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
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

    ${Wrapper}.reduced & {
        text-align: center;
    }
`

const CollectionWrapper = styled.div`
    padding: 0 20px;

    ${Wrapper}.reduced & {
        padding: 0;
        display: flex;
        flex-direction: column;
    }    
`

const InfoText = styled.div<{ isReduced: boolean }>`
    ${p => p.isReduced ? `margin: 0 50px;` : `margin: 0 25px;`}
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

    return <Wrapper className={isReduced ? 'reduced' : ''} >
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
            {
                images.length ? images.map((item: Image) => (
                    <CollectionItem image={item} key={item.id} />
                )) : <InfoText isReduced={isReduced}>
                        <span>You don't have any uploaded images at the moment. You can upload images </span>
                        <StyledLink to='upload'>
                            here
                        </StyledLink>
                    </InfoText>
            }
        </CollectionWrapper>
    </Wrapper>
})