import * as React from 'react'
import styled from 'styled-components'
import { NameInput, Description, Dropdown } from 'Components/Common'
import { useParams, useHistory } from 'react-router-dom'
import { AppContext } from 'Root/AppContext'
import { Image as ImageType } from 'Types/file'
import { makeCancelable } from 'Root/helpers'
import { Cancelable } from 'Root/Types/cancelable'
import { useCancelableCleanup } from 'Root/hooks'
import { StateSetter } from 'Types/etc'
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
        flex-direction: column-reverse;
        justify-content:flex-end;
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

const StyledDeleteIcon = styled(FontAwesomeIcon)`
    padding: 0 5px;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s ease-out;
    margin-bottom: 5px;

    &:hover {
        color: #e53935;
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
        width: 100%;
        margin: 0;
    }
`

const NameWrapper = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        width: 50%;
    }
`

const StyledDropdown = styled(Dropdown)`
    @media (max-width: 768px) {
        width: 50%;
        margin: 0;
        text-align: center;
    }
`

const activePromises: Cancelable<any>[] = []

export default () => {
    const { imageId } = useParams()
    const history = useHistory()
    const { api, addNotification } = React.useContext(AppContext)
    const [image, setImage]: [ImageType, StateSetter<ImageType>] = React.useState(null)
    const [imageName, setImageName]: [string, StateSetter<string>] = React.useState('')
    const [imageDescription, setImageDescription]: [string, StateSetter<string>] = React.useState('')
    const [collections, setCollections]: [Collection[], StateSetter<Collection[]>] = React.useState(null)

    useCancelableCleanup(activePromises)

    React.useEffect(() => {
        const cancelable = makeCancelable(
            api.getImage(imageId)
                .then(({ image }) => {
                    setImage(image)
                    setImageName(image.name)
                    setImageDescription(image.description || '')

                    return image.isOwner
                })
                .catch(e => {
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
                .then((shouldFetchCollections: boolean) => {
                    if (!shouldFetchCollections) return null
                    else return api.getCollections()
                        .then((res) => {
                            setCollections(res.collections)
                        })
                })
        )

        cancelable
            .promise
            .catch(e => {
                if (!e.isCanceled) console.error(e)
            })

        activePromises.push(cancelable)
    }, [imageId])

    if (!image || (image.isOwner && !collections)) {
        return <Wrapper>
            <Loading />
        </Wrapper>
    }

    return (
        <Wrapper>
            <FileInfo>
                {
                    !!image && <React.Fragment>
                        <NameWrapper>
                            <StyledNameInput
                                readOnly={!image.isOwner}
                                value={imageName}
                                onChange={(e) => setImageName(e.target.value)}
                                onBlur={() => {
                                    if (imageName == image.name || !image.isOwner) return
                                    if (!imageName) {
                                        setImageName(image.name)
                                        return
                                    }

                                    api.updateImageInfo(image.id, imageName, image.description, image.collectionId)
                                        .catch(err => console.error(err))
                                    setImage({
                                        ...image,
                                        name: imageName
                                    })
                                }} />
                            {image.isOwner && <StyledDeleteIcon
                                icon='trash-alt'
                                onClick={() => {
                                    const cancelable = makeCancelable(api.deleteFile(image.id))
                                    cancelable
                                        .promise
                                        .then(({ success }) => {
                                            if (success) {
                                                history.push('/library')
                                            }
                                        })
                                        .catch(e => {
                                            if (!e.isCanceled) console.error(e)
                                        })

                                    activePromises.push(cancelable)
                                }} />}
                        </NameWrapper>
                        {image.isOwner && <StyledDropdown
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
                                api.updateImageInfo(image.id, image.name, image.description, value.id)
                                    .catch(err => console.error(err))
                            }} />}
                        <StyledDescription
                            placeholder='description...'
                            rows={1}
                            value={imageDescription}
                            readOnly={!image.isOwner}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setImageDescription(e.target.value)
                            }}
                            onBlur={() => {
                                if (image.description == imageDescription || !image.isOwner) return

                                api.updateImageInfo(image.id, image.name, imageDescription, image.collectionId)
                                    .catch(err => console.error(err))

                                setImage({
                                    ...image,
                                    description: imageDescription
                                })
                            }} />
                    </React.Fragment>
                }
            </FileInfo>
            <ImageWrapper>
                {
                    !!image && <Image src={image.url} />
                }
            </ImageWrapper>
        </Wrapper>
    )
}