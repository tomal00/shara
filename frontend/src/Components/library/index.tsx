import * as React from 'react'
import styled from 'styled-components'
import CollectionView from 'Root/Components/library/CollectionView'
import SideBar from 'Components/library/SideBar'
import { AppContext } from 'Root/AppContext'
import { Collection } from 'Types/collection'
import { makeCancelable } from 'Root/helpers'
import { Cancelable } from 'Types/cancelable'
import { useCancelableCleanup, useWidth } from 'Root/hooks'
import { Image } from 'Types/file'
import { StateSetter } from 'Types/etc'
import { Redirect } from 'react-router-dom'
import Loading from 'Components/Loading'

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: stretch;
    top: 50px;
    min-height: calc(100% - 50px);
    background: ${p => p.theme.colors.grey.light};
`

const activePromises: Cancelable<any>[] = []

export default () => {
    const { api, accountHash } = React.useContext(AppContext)
    const width = useWidth()
    const isReduced = width < 512

    if (!accountHash) {
        return <Redirect to='/account' />
    }

    const [selectedCollectionId, selectCollection]: [string, StateSetter<string>] = React.useState(null)
    const [collections, setCollections]: [Collection[], StateSetter<Collection[]>] = React.useState(null)
    const [images, setImages]: [Image[], StateSetter<Image[]>] = React.useState(null)
    const selectedCollection = collections && collections.find(c => c.id === selectedCollectionId)

    useCancelableCleanup(activePromises)

    React.useEffect(() => {
        const cancelableCollections = makeCancelable(api.getCollections())
        cancelableCollections
            .promise
            .then(({ success, collections }) => {
                if (success) setCollections(collections)
            })
            .catch(e => { if (!e.isCanceled) console.error(e) })

        activePromises.push(cancelableCollections)

        const cancelableImages = makeCancelable(api.getImages())
        cancelableImages
            .promise
            .then(({ success, images }) => {
                if (success) setImages(images)
            })
            .catch(e => {
                if (!e.isCanceled) console.error(e)
            })

        activePromises.push(cancelableImages)
    }, [])

    const currentCollectionImages = selectedCollection ?
        images.filter(i => i.collectionId === selectedCollectionId) : images

    if (!images || !collections) {
        return <Wrapper>
            <Loading />
        </Wrapper>
    }

    return (
        <Wrapper>
            {<SideBar
                isReduced={isReduced}
                collections={collections}
                selectedCollection={selectedCollection}
                onSelectCollection={(id: string) => selectCollection(id)}
                onCreateCollection={() => {
                    const cancelable = makeCancelable(api.createCollection('New collection').then(api.getCollections))
                    cancelable
                        .promise
                        .then(({ success, collections }) => {
                            if (success) setCollections(collections)
                        })
                        .catch(e => { if (!e.isCanceled) console.error(e) })

                    activePromises.push(cancelable)
                }}
                onDeleteCollection={(id: string) => {
                    const cancelable = makeCancelable(api.deleteCollection(id).then(api.getCollections))
                    cancelable
                        .promise
                        .then(({ success, collections }) => {
                            if (success) setCollections(collections)
                        })
                        .catch(e => { if (!e.isCanceled) console.error(e) })

                    activePromises.push(cancelable)
                }} />}
            {<CollectionView
                isReduced={isReduced}
                selectedCollection={selectedCollection}
                images={currentCollectionImages}
                onChangeCollectionName={(newName, collectionId) => {
                    const cancelable = makeCancelable(api.renameCollection(newName, collectionId).then(api.getCollections))

                    cancelable
                        .promise
                        .then(({ success, collections }) => {
                            if (success) setCollections(collections)
                        })
                        .catch(e => { if (!e.isCanceled) console.error(e) })

                    activePromises.push(cancelable)
                }} />}
        </Wrapper>
    )
}