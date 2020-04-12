import * as React from 'react'
import { AppContext } from 'Root/AppContext'
import { useCancelable } from 'Root/hooks'
import Image from 'Components/image'
import { useParams, useHistory } from 'react-router-dom'
import { Image as ImageType } from 'Types/file'
import { Collection } from 'Types/collection'

interface ImageState {
    image: ImageType | null,
    imageName: string,
    imageDescription: string,
    collections: Collection[] | null
}

interface UnmergedState {
    image?: ImageType | null,
    imageName?: string,
    imageDescription?: string,
    collections?: Collection[] | null
}

export default () => {
    const { imageId } = useParams()
    const history = useHistory()
    const { api, addNotification } = React.useContext(AppContext)
    const { createCancelable } = useCancelable()

    const [state, setState] = React.useReducer<React.Reducer<ImageState, UnmergedState>>(
        (state, newState) => ({ ...state, ...newState }),
        { image: null, imageName: '', imageDescription: '', collections: null }
    )
    const { image, imageName, imageDescription, collections } = state

    React.useEffect(() => {
        createCancelable(api.getImage(imageId))
            .promise
            .then(({ image }) => {
                setState({ image, imageName: image.name, imageDescription: image.description || '' })

                return image.isOwner
            })
            .catch(err => {
                if (err.isCanceled) return

                history.push('/account')
                addNotification({
                    clearPrevious: true,
                    notification: {
                        level: 'error',
                        title: 'Unable to show image',
                        message: 'This image is either private or doesn\'t exist',
                        autoDismiss: 10
                    }
                })
            })
            .then((shouldFetchCollections) => {
                if (shouldFetchCollections) {
                    return createCancelable(api.getCollections()).promise
                }
                return null
            })
            .then((res) => {
                res && setState({ collections: res.collections })
            })
            .catch(err => { if (!err.isCanceled) console.error(err) })
    }, [imageId])

    const handleChangeName = (value: string): void => setState({ imageName: value })
    const handleUpdateName = (): void => {
        if (!image || imageName == image.name || !image.isOwner) return

        if (!imageName) {
            setState({ imageName: image.name })
            return
        }

        createCancelable(api.updateImageInfo(image.id, imageName, image.description || '', image.collectionId, image.isPrivate))
            .promise
            .then(({ success }) => {
                if (success) {
                    setState({ image: { ...image, name: imageName } })
                }
                else setState({ imageName: image.name })
            })
            .catch(err => {
                if (!err.isCanceled) {
                    setState({ imageName: image.name })
                    console.error(err)
                }
            })
    }
    const handleToggleAccess = (): void => {
        if (!image) return

        createCancelable(api.updateImageInfo(image.id, image.name, image.description || '', image.collectionId, !image.isPrivate))
            .promise
            .then(({ success }) => {
                if (success) {
                    setState({ image: { ...image, isPrivate: !image.isPrivate } })
                }
            })
            .catch(err => {
                if (!err.isCanceled) console.error(err)
            })
    }
    const handleDelete = (): void => {
        if (!image) return

        createCancelable(api.deleteFile(image.id))
            .promise
            .then(({ success }) => {
                if (success) {
                    history.push('/library')
                }
            })
            .catch(err => {
                if (!err.isCanceled) console.error(err)
            })
    }
    const handleUpdateCollection = (collection: Collection): void => {
        if (!image) return

        api.updateImageInfo(image.id, image.name, image.description || '', collection.id, image.isPrivate)
            .catch((err: Error) => console.error(err))

    }
    const handleChangeDescription = (value: string) => setState({ imageDescription: value })
    const handleUpdateDescription = (): void => {
        if (!image) return

        if (image.description == imageDescription || !image.isOwner) return

        createCancelable(api.updateImageInfo(image.id, image.name, imageDescription, image.collectionId, image.isPrivate))
            .promise
            .then(({ success }) => {
                if (success) {
                    setState({ image: { ...image, description: imageDescription } })
                }
                else setState({ imageDescription: image.description })
            })
            .catch(err => {
                if (!err.isCanceled) {
                    setState({ imageDescription: image.description })
                    console.error(err)
                }
            })

    }

    return <Image
        image={image || undefined}
        collections={collections || undefined}
        imageDescription={imageDescription}
        imageName={imageName}
        onChangeName={handleChangeName}
        onUpdateName={handleUpdateName}
        onToggleAccess={handleToggleAccess}
        onDelete={handleDelete}
        onUpdateCollection={handleUpdateCollection}
        onChangeDescription={handleChangeDescription}
        onUpdateDescription={handleUpdateDescription} />
}