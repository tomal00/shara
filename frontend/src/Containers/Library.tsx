import * as React from 'react'
import { AppContext } from 'Root/AppContext'
import { useCancelable, } from 'Root/hooks'
import { Redirect } from 'react-router-dom'
import Library from 'Components/library'
import { Image } from 'Types/file'
import { Collection } from 'Types/collection'

interface State {
    selectedCollectionId: string | null,
    collections: Collection[] | null,
    images: Image[] | null
}

interface UnmergedState {
    selectedCollectionId?: string | null,
    collections?: Collection[] | null,
    images?: Image[] | null
}

export default () => {
    const { api, accountHash, logOut, openPrompt } = React.useContext(AppContext)

    if (!accountHash) {
        return <Redirect to='/account' />
    }

    const { createCancelable } = useCancelable()
    const [state, setState] = React.useReducer<React.Reducer<State, UnmergedState>>(
        (state: State, newState: UnmergedState): State => ({ ...state, ...newState }),
        { selectedCollectionId: null, collections: null, images: null }
    )
    const { selectedCollectionId, collections, images } = state
    const selectedCollection = collections && collections.find(c => c.id === selectedCollectionId) || null

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

    const handleSelectCollection = (id: string | null): void => setState({ selectedCollectionId: id })
    const handleCreateCollection = (): void => {
        createCancelable(
            openPrompt({
                type: 'input',
                title: 'Create a new collection',
                inputPlaceholder: 'Enter the collection\'s name',
                stornoText: 'Cancel',
                confirmText: 'Create'
            })
                .then((val: string) => api.createCollection(val))
                .then(api.getCollections)
        )
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
    }
    const handleDeleteCollection = (id: string): void => {
        const collection = collections?.find(c => c.id === id)

        createCancelable(
            openPrompt({
                type: 'confirm',
                title: 'Delete collection',
                text: `Do you really want to delete the "${collection?.name}" collection? This action is irreversible.`,
                stornoText: 'Cancel',
                confirmText: 'Delete'
            })
                .then(() => api.deleteCollection(id))
                .then(api.getCollections)
        )
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
    }
    const handleChangeCollectionName = (newName: string, id: string) => {
        createCancelable(api.renameCollection(newName, id).then(api.getCollections))
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
    }

    return <Library
        selectedCollection={selectedCollection}
        collections={collections}
        images={images}
        onSelectCollection={handleSelectCollection}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
        onUpdateCollectionName={handleChangeCollectionName}
    />
}