import * as React from 'react'
import styled from 'styled-components'
import UploadView from 'Components/upload/UploadView'
import FileView from 'Components/upload/FileView'
import { UploadedFile } from 'Types/file'

const Wrapper = styled.div`
    height: calc(100% - 50px);
    padding-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

export default () => {
    const file: UploadedFile = {
        name: 'ebin',
        objectUrl: 'https://www.isic.cz/wp-content/uploads/2019/06/logo_isic.png',
        blob: new Blob(),
        meta: {
            size: 1,
            mime: 'image/png'
        }
    }

    return <Wrapper>
        {file ? (<FileView file={file} />) : (<UploadView />)}
    </Wrapper>
}