import * as React from 'react'
import styled from 'styled-components'
import CollectionView from 'Root/Components/library/CollectionView'
import SideBar from 'Components/library/SideBar'
import { AppContext } from 'Root/AppContext'
import { Collection } from 'Types/collection'
import { useCancelable, useWidth } from 'Root/hooks'
import { Image } from 'Types/file'
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

interface State {
    selectedCollectionId: string,
    collections: Collection[],
    images: Image[]
}

interface UnmergedState {
    selectedCollectionId?: string,
    collections?: Collection[],
    images?: Image[]
}

export default () => {
    const { api, accountHash, logOut } = React.useContext(AppContext)
    const width = useWidth()
    const isReduced = width < 512

    if (!accountHash) {
        return <Redirect to='/account' />
    }

    //const [state, setState]: [State, StateSetter<State>] = React.useState({ selectedCollectionId: null, collections: null, images: null })
    const [state, setState] = React.useReducer(
        (state: State, newState: UnmergedState): State => ({ ...state, ...newState }),
        { selectedCollectionId: null, collections: null, images: null }
    )
    const { selectedCollectionId, collections, images } = state
    const selectedCollection = collections && collections.find(c => c.id === selectedCollectionId)
    const { createCancelable } = useCancelable()

    React.useEffect(() => {
        createCancelable(api.getCollections())
            .promise
            .then(({ success, collections }) => {
                if (success) setState({ collections })
            })
            .catch(err => {
                if (!err.isCanceled) {
                    console.error(err)
                    if (err.statusCode === 401) { logOut() }
                }
            })

        createCancelable(api.getImages())
            .promise
            .then(({ success, images }) => {
                if (success) {
                    setState({ images })
                }
            })
            .catch(err => {
                if (!err.isCanceled) {
                    console.error(err)
                    if (err.statusCode === 401) { logOut() }
                }
            })
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
                onSelectCollection={(id: string) => setState({ selectedCollectionId: id })}
                onCreateCollection={() => {
                    createCancelable(api.createCollection('New collection').then(api.getCollections))
                        .promise
                        .then(({ success, collections }) => {
                            if (success) setState({ collections })
                        })
                        .catch(err => {
                            if (!err.isCanceled) {
                                console.error(err)
                                if (err.statusCode === 401) { logOut() }
                            }
                        })
                }}
                onDeleteCollection={(id: string) => {
                    createCancelable(api.deleteCollection(id).then(api.getCollections))
                        .promise
                        .then(({ success, collections }) => {
                            if (success) setState({ collections })
                        })
                        .catch(err => {
                            if (!err.isCanceled) {
                                console.error(err)
                                if (err.statusCode === 401) { logOut() }
                            }
                        })
                }} />}
            {<CollectionView
                isReduced={isReduced}
                selectedCollection={selectedCollection}
                images={currentCollectionImages}
                onChangeCollectionName={(newName, collectionId) => {
                    createCancelable(api.renameCollection(newName, collectionId).then(api.getCollections))
                        .promise
                        .then(({ success, collections }) => {
                            if (success) setState({ collections })
                        })
                        .catch(err => {
                            if (!err.isCanceled) {
                                console.error(err)
                                if (err.statusCode === 401) { logOut() }
                            }
                        })
                }} />}
        </Wrapper>
    )
}