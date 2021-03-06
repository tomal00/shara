import * as React from 'react'
import styled from 'styled-components'
import { UploadedFile } from 'Types/file'
import { NameInput, Button, Description, StyledTooltip } from 'Components/Common'
import { StateSetter } from 'Types/etc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { useDidUpdate } from 'Root/hooks'

const { useState, useRef } = React

interface FileViewProps {
    file: UploadedFile,
    onCancel: () => void,
    onUpload: (file: UploadedFile) => void
}

const ViewWrapper = styled.div`
    width: 600px;
    max-width: 90%;
    position: relative;
    background: ${p => p.theme.colors.white.base};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    border-radius: ${p => p.theme.borderRadius}px;
    border: 1px solid ${p => p.theme.colors.grey.base};
    margin: 10px 0;
`

const ImagePreview = styled.img`
    max-width: 100%;
    background-color: ${p => p.theme.colors.white.base};
    border-radius: ${p => p.theme.borderRadius}px;
    max-height: 40vh;
    border: 2px solid ${p => p.theme.colors.grey.light};
    overflow: hidden;
`

const UploadControls = styled.div`
    align-self: stretch;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 512px) {
        flex-direction: column;
    }
`


const UploadButton = styled(Button)`
    padding: 0 15px;
    margin-left: 10px;
    background-color: ${p => p.theme.colors.primary.base};
    color: ${p => p.theme.colors.primary.text};

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            background-color: ${p => p.theme.colors.primary.dark};
        }
    }
`

const CancelButton = styled(Button)`
    padding: 0 15px;
    margin-right: 10px;
    background-color: ${p => p.theme.colors.secondary.base};

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            background-color: ${p => p.theme.colors.secondary.dark};
        }
    }
`

const FileName = styled(NameInput)`
    margin: 20px;
`

const AccessControlsWrapper = styled.div`
    font-size: 18px;
    cursor: pointer;
    user-select: none;
    width: 230px;

    @media (max-width: 512px) {
        margin-bottom: 15px;
    }
`

const StyledIcon = styled(FontAwesomeIcon)`
    width: 20px!important;
    margin-right: 5px;
    transition: color 0.2s ease-out;
    position: relative;

    @media (hover: hover) and (pointer: fine) {
        ${AccessControlsWrapper}:hover & {
            color: ${p => p.theme.colors.secondary.base};
        }
    }

    &.public {
        left: 2px;
    }
`


export default ({ file, onCancel, onUpload }: FileViewProps) => {
    const [description, setDescription]: [string, StateSetter<string>] = useState('')
    const [fileName, setFileName]: [string, StateSetter<string>] = useState(file.name)
    const [isPrivate, setPrivate]: [boolean, StateSetter<boolean>] = useState(file.isPrivate)
    const accessTogglerWrapperRef: React.Ref<HTMLDivElement> = useRef(null)

    useDidUpdate(() => {
        if (accessTogglerWrapperRef.current) ReactTooltip.show(accessTogglerWrapperRef.current)
    }, [isPrivate])

    return <ViewWrapper>
        <div>
            <FileName
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={file.name}
                minLength={1}
                maxLength={128} />
        </div>
        <ImagePreview src={file.objectUrl} />
        <Description
            value={description}
            rows={1}
            maxLength={512}
            placeholder='description...'
            onChange={
                (e: React.SyntheticEvent) => {
                    const target = e.target as HTMLTextAreaElement
                    setDescription(target.value)
                }} />
        <UploadControls>
            <AccessControlsWrapper
                onClick={() => setPrivate(!isPrivate)}
                ref={accessTogglerWrapperRef}
                data-for='access-control-tooltip'
                data-tip={`Click here if you wish to change<br>the image to ${isPrivate ? 'public' : 'private'}.`} >
                <StyledIcon
                    className={isPrivate ? 'private' : 'public'}
                    icon={isPrivate ? 'lock' : 'lock-open'} />
                <span>{isPrivate ? 'This image will be private' : 'This image will be public'}</span>
            </AccessControlsWrapper>
            <StyledTooltip tooltipProps={{ id: 'access-control-tooltip', effect: 'solid', multiline: true }} />
            <div>
                <CancelButton onClick={onCancel}>Cancel</CancelButton>
                <UploadButton
                    onClick={() => {
                        onUpload({
                            ...file,
                            name: fileName,
                            meta: {
                                ...file.meta,
                                description: description
                            },
                            isPrivate
                        })
                    }}>
                    Upload
            </UploadButton>
            </div>
        </UploadControls>
    </ViewWrapper>
}