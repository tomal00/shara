import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import { NameInput } from 'Components/Common'
import { UploadedFile } from 'Types/file'
import CollectionItem from 'Components/library/CollectionItem'

const Wrapper = styled.div`
    width: calc(100% - 250px);
    position: relative;
    left: 250px;
`

const CollectionTitle = styled.div`
    width: calc(100% - 80px);
    margin: 40px 40px 20px 40px;
    display: flex;
    justify-content: center;
`

const StyledNameInput = styled(NameInput)`
    font-size: 25px;
`

const CollectionWrapper = styled.div`
    padding: 0 20px;
`

export default () => {
    const chosenCollection: Collection = {
        name: 'ebin',
        id: 1,
        items: [
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            },
            {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            }, {
                name: 'haha',
                objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
                blob: new Blob(),
                meta: {
                    size: 1,
                    mime: 'image/png'
                }
            }
        ]
    }

    return <Wrapper>
        <CollectionTitle>
            <StyledNameInput value={chosenCollection.name} />
        </CollectionTitle>
        <CollectionWrapper>
            {chosenCollection.items.map((item: UploadedFile) => (
                <CollectionItem file={item} />
            ))}
        </CollectionWrapper>
    </Wrapper>
}