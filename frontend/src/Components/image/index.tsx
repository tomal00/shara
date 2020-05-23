import * as React from 'react'
import styled from 'styled-components'
import { NameInput, Description, Dropdown, StyledTooltip } from 'Components/Common'
import { Image as ImageType } from 'Types/file'
import { useWidth } from 'Root/hooks'
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

const DeleteIconTooltip = styled(StyledTooltip)`
    background-color: #e53935!important;
    border-color: #666!important;
    
    &::after {
        border-top-color: #666!important;
    }
`

interface ImageProps {
    image?: ImageType,
    collections?: Collection[],
    imageDescription: string,
    imageName: string,
    onChangeName: (value: string) => void,
    onUpdateName: () => void,
    onToggleAccess: () => void,
    onDelete: () => void,
    onUpdateCollection: (collection: Collection) => void,
    onChangeDescription: (value: string) => void,
    onUpdateDescription: () => void,
}

export default ({
    image, collections, imageDescription, imageName, onChangeName, onUpdateName,
    onToggleAccess, onDelete, onUpdateCollection, onChangeDescription, onUpdateDescription
}: ImageProps) => {
    const width = useWidth()

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
                onChange={(e) => onChangeName(e.target.value)}
                maxLength={128}
                onBlur={onUpdateName} />
            {image.isOwner && <React.Fragment>
                <div
                    data-for='access-controls-tooltip'
                    data-tip={`Click the icon if you wish to change<br>the image to ${image.isPrivate ? 'public' : 'private'}.`}
                    style={{ minWidth: 32.5, textAlign: 'left' }}>
                    <StyledLockIcon
                        icon={image.isPrivate ? 'lock' : 'lock-open'}
                        onClick={onToggleAccess}
                    />
                </div>
                <div
                    data-for='delete-icon-tooltip'
                    data-tip={`Click to delete the image`}>
                    <StyledDeleteIcon
                        icon='trash-alt'
                        onClick={onDelete} />
                </div>
                <DeleteIconTooltip tooltipProps={{ id: 'delete-icon-tooltip', effect: 'solid' }} />
                <StyledTooltip tooltipProps={{ id: 'access-controls-tooltip', effect: 'solid', multiline: true }} />
            </React.Fragment>}
        </NameWrapper>
    ) : null

    const dropdownNode = image && image.isOwner && collections ? (
        <StyledDropdown
            placeholder='No collection'
            emptyDropdownText='You have no collections'
            items={collections.map(c => ({ name: c.name, value: c, key: c.id }))}
            initiallySelectedItem={
                image.collectionId ?
                    (() => {
                        const collection = collections.find((c) => c.id === image.collectionId)
                        if (!collection) return undefined
                        else return {
                            name: collection.name,
                            value: collection,
                            key: collection.id
                        }
                    })()
                    : undefined
            }
            onSelect={(item) => onUpdateCollection(item.value as Collection)} />
    ) : null

    const descriptionNode = !!image ? (<StyledDescription
        placeholder='description...'
        rows={1}
        value={imageDescription}
        readOnly={!image.isOwner}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChangeDescription(e.target.value)
        }}
        onBlur={onUpdateDescription} />) : null

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