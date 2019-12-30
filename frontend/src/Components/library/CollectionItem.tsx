import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import { NameInput } from 'Components/Common'
import { UploadedFile } from 'Types/file'

const Wrapper = styled.div`
    position: relative;
    background-color: ${p => p.theme.colors.secondary.base};
    border-radius: ${p => p.theme.borderRadius}px;
    padding: 10px;
    height: 180px;
    width: 180px;
    cursor: pointer;
    transition: background-color 0.2s ease-out, color 0.2s ease-out;
    margin: 20px;
    display: inline-block;

    &:hover {
        background-color: ${p => p.theme.colors.primary.light};
        color: ${p => p.theme.colors.primary.text};
    }
`
const Image = styled.div`
    background-image: url(${(p: { imageUrl: string }) => p.imageUrl});
    height: 150px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin: 10px;
    margin-top: 0;
    background-color: white;
`

const ImageWrapper = styled.div`
    background-color: white;
    border-radius: ${p => p.theme.borderRadius}px;
`

const FileName = styled.div`
    text-align: center;
`

export default ({ file }: { file: UploadedFile }) => {

    return <Wrapper>
        <ImageWrapper>
            <Image imageUrl={file.objectUrl} />
        </ImageWrapper>
        <FileName>{file.name}</FileName>
    </Wrapper>
}