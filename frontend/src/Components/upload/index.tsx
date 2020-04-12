import * as React from 'react'
import styled from 'styled-components'
import UploadView from 'Components/upload/UploadView'
import FileView from 'Components/upload/FileView'
import { UploadedFile } from 'Types/file'
import { NotificationSetter } from 'Types/etc'

const Wrapper = styled.div`
    min-height: calc(100% - 50px);
    top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: ${p => p.theme.colors.grey.light};
`

interface UploadProps {
    file: UploadedFile | null,
    onUpload: (file: UploadedFile) => void,
    onCancel: () => void,
    onSelectFile: (file: UploadedFile) => void,
    addNotification: NotificationSetter
}

export default ({ file, onCancel, onUpload, onSelectFile, addNotification }: UploadProps) => {
    return <Wrapper>
        {file ?
            (<FileView
                file={file}
                onCancel={onCancel}
                onUpload={onUpload} />)
            : (<UploadView
                onSelectFile={onSelectFile}
                addNotification={addNotification} />)}
    </Wrapper>
}