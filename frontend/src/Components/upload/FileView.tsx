import * as React from 'react'
import styled from 'styled-components'
import { UploadedFile } from 'Types/file'
import { ExpandableTextArea, NameInput, Button, Description } from 'Components/Common'
import { StateSetter } from 'Types/etc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const { useState } = React

interface FileViewProps {
    file: UploadedFile,
    onCancel: () => void,
    onUpload: (file: UploadedFile) => void
}

const ViewWrapper = styled.div`
    width: 600px;
    max-width: 90%;
    position: relative;
    background: ${p => p.theme.colors.secondary.base};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    border-radius: ${p => p.theme.borderRadius}px;
`

const ImagePreview = styled.img`
    max-width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: ${p => p.theme.borderRadius}px;
    max-height: 40vh;
`

const UploadControls = styled.div`

`


const UploadButton = styled(Button)`
    height: 40px;
    padding: 0 15px;
    margin-left: 20px;
    background-color: ${p => p.theme.colors.primary.light};
    color: ${p => p.theme.colors.primary.text};

    &:hover {
        background-color: ${p => p.theme.colors.primary.dark};
    }
`

const CancelButton = styled(Button)`
    height: 40px;
    padding: 0 15px;
    margin-right: 20px;
    color: ${p => p.theme.colors.secondary.text};

    &:hover {
        opacity: 0.6;
        color: white;
        background-color: ${p => p.theme.colors.secondary.dark};
    }
`

const FileName = styled(NameInput)`
    margin: 20px;
    text-align: left;
`

const StyledIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    width: 20px!important;
`


export default ({ file, onCancel, onUpload }: FileViewProps) => {
    const [description, setDescription]: [string, StateSetter<string>] = useState('')
    const [fileName, setFileName]: [string, StateSetter<string>] = useState(file.name)
    const [isPrivate, setPrivate]: [boolean, StateSetter<boolean>] = useState(file.isPrivate)

    return <ViewWrapper>
        <div>
            <StyledIcon
                icon={isPrivate ? 'lock' : 'lock-open'}
                onClick={() => setPrivate(!isPrivate)} />
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
        </UploadControls>
    </ViewWrapper>
}