import * as React from 'react'
import styled from 'styled-components'
import { UploadedFile } from 'Types/file'
import { ExpandableTextArea, NameInput, Button } from 'Components/Common'

const { useState } = React

interface FileViewProps {
    file: UploadedFile
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
    width: 100%;
    background-color: white;
    padding: 10px;
    border-radius: ${p => p.theme.borderRadius}px;
`

const UploadControls = styled.div`

`

const Description = styled(ExpandableTextArea)`
    align-self: stretch;
    margin: 20px 0;
    word-wrap: break-word;
    border: 0;
    outline: none!important;
    resize: none!important;
    padding: 5px;
    background-color: ${p => p.theme.colors.secondary.light};
    border: 2px solid;
    border-color: ${p => p.theme.colors.secondary.dark};
    transition: border-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    max-height: 176px;
    font-size: 16px;

    &:hover:not(:focus) {
        border-color: ${p => p.theme.colors.primary.light};
    }

    &:focus {
        outline-width: 0;
    }

    ${p => p.readOnly ? `
        &:hover {
            border-color: ${p.theme.colors.primary.light};
        }
    ` : `
        &:focus {
            border-color: ${p.theme.colors.primary.base};
        }
    `}
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
`


export default ({ file }: FileViewProps) => {
    const [description, setDescription] = useState('')
    const [fileName, setFileName] = useState(file.name)

    return <ViewWrapper>
        <FileName
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder={file.name}
            minLength={1}
            maxLength={128} />
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
            <CancelButton>Cancel</CancelButton>
            <UploadButton>Upload</UploadButton>
        </UploadControls>
    </ViewWrapper>
}