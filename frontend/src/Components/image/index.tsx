import * as React from 'react'
import styled from 'styled-components'
import { NameInput, Description, Dropdown } from 'Components/Common'
import { useParams, useHistory } from 'react-router-dom'
import { AppContext } from 'Root/AppContext'
import { Image as ImageType } from 'Types/file'
import { useCancelable, useWidth } from 'Root/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collection } from 'Types/collection'
import Loading from 'Components/Loading'

const Wrapper = styled.div`
    box-sizing: border-box;
    top: 50px;
    height: calc(100% - 100px);
    position: relative;
    overflow: hidden;
    display: flex;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.grey.light};

    @media (max-width: 768px) {
        flex-direction: column;
        justify-content:flex-start;
        min-height: calc(100% - 100px);
        height: auto;
        align-items: center;
    }
`

const Image = styled.img`
    max-width: 100%;
    max-height: calc(100% - 82px);
    border: 2px solid ${p => p.theme.colors.grey.base};
    border-radius: ${p => p.theme.borderRadius}px;
    background-color: ${p => p.theme.colors.white.base};
`

const FileInfo = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        padding: 10px 10px 0;
        width: calc(100% - 20px);
    }
`

const ImageWrapper = styled.div`
    background: white;
    height: calc(100% - 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    flex-grow: 999;
    background-color: inherit;

    @media (max-width: 768px) {
        flex-grow: 0;
        height: fit-content;
    }
`

const StyledIcon = styled(FontAwesomeIcon)`
    padding: 0 5px;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s ease-out;
    margin-bottom: 5px;
    user-select: none;
`

const StyledDeleteIcon = styled(StyledIcon)`
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            color: #e53935;
        }
    }
`

const StyledLockIcon = styled(StyledIcon)`
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            color: ${p => p.theme.colors.secondary.base};
        }
    }
`

const StyledNameInput = styled(NameInput)`
    text-align: left;
    width: 200px;
    padding: 0;
`

const StyledDescription = styled(Description)`
    max-height: 300px;

    @media (max-width: 768px) {
        width: calc(100% - 32px);
        margin: 0 auto 10px;
    }
`

const NameWrapper = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        width: 60%;
    }
`

const StyledDropdown = styled(Dropdown)`
    @media (max-width: 768px) {
        width: 40%;
        margin: 0;
        text-align: center;
    }
`

interface ImageState {
    image: ImageType,
    imageName: string,
    imageDescription: string,
    collections: Collection[]
}

interface UnmergedState {
    image?: ImageType,
    imageName?: string,
    imageDescription?: string,
    collections?: Collection[]
}

export default () => {
    const { imageId } = useParams()
    const history = useHistory()
    const { api, addNotification } = React.useContext(AppContext)
    const [state, setState] = React.useReducer(
        (state: ImageState, newState: UnmergedState): ImageState => ({ ...state, ...newState }),
        { image: null, imageName: '', imageDescription: '', collections: null }
    )
    const { image, imageName, imageDescription, collections } = state
    const width = useWidth()
    const { createCancelable } = useCancelable()

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
                setState({ collections: res.collections })
            })
            .catch(err => { if (!err.isCanceled) console.error(err) })
    }, [imageId])

    if (!image || (image.isOwner && !collections)) {
        return <Wrapper>
            <Loading />
        </Wrapper>
    }

    const nameWrapperNode = image ? (
        <NameWrapper>
            <StyledNameInput
                readOnly={!image.isOwner}
                value={imageName}
                onChange={(e) => setState({ imageName: e.target.value })}
                onBlur={() => {
                    if (imageName == image.name || !image.isOwner) return
                    if (!imageName) {
                        setState({ imageName: image.name })
                        return
                    }

                    api.updateImageInfo(image.id, imageName, image.description, image.collectionId, image.isPrivate)
                        .catch(err => console.error(err))

                    setState({ image: { ...image, name: imageName } })
                }} />
            {image.isOwner && <React.Fragment>
                <div style={{ minWidth: 32.5, textAlign: 'left' }}>
                    <StyledLockIcon
                        icon={image.isPrivate ? 'lock' : 'lock-open'}
                        onClick={() => {
                            api.updateImageInfo(image.id, image.name, image.description, image.collectionId, !image.isPrivate)
                                .catch(err => console.error(err))

                            setState({ image: { ...image, isPrivate: !image.isPrivate } })
                        }}
                    />
                </div>
                <StyledDeleteIcon
                    icon='trash-alt'
                    onClick={() => {
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
                    }} />
            </React.Fragment>}
        </NameWrapper>
    ) : null

    const dropdownNode = image && image.isOwner ? (
        <StyledDropdown
            placeholder='No collection'
            emptyDropdownText='You have no collections'
            items={collections.map(c => ({ name: c.name, value: c, key: c.id }))}
            initiallySelectedItem={
                image.collectionId ?
                    (() => {
                        const collection = collections.find((c) => c.id === image.collectionId)
                        if (!collection) return null
                        else return {
                            name: collection.name,
                            value: collection,
                            key: collection.id
                        }
                    })()
                    : null
            }
            onSelect={({ value }) => {
                api.updateImageInfo(image.id, image.name, image.description, value.id, image.isPrivate)
                    .catch(err => console.error(err))
            }} />
    ) : null

    const descriptionNode = !!image ? (<StyledDescription
        placeholder='description...'
        rows={1}
        value={imageDescription}
        readOnly={!image.isOwner}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setState({ imageDescription: e.target.value })
        }}
        onBlur={() => {
            if (image.description == imageDescription || !image.isOwner) return

            api.updateImageInfo(image.id, image.name, imageDescription, image.collectionId, image.isPrivate)
                .catch(err => console.error(err))

            setState({ image: { ...image, description: imageDescription } })
        }} />) : null

    return (
        <Wrapper>
            <FileInfo>
                {
                    !!image && <React.Fragment>
                        {nameWrapperNode}
                        {dropdownNode}
                        {width > 768 && descriptionNode}
                    </React.Fragment>
                }
            </FileInfo>
            <ImageWrapper>
                {
                    !!image && <Image src={image.url} />
                }
            </ImageWrapper>
            {!(width > 768) && descriptionNode}
        </Wrapper>
    )
}