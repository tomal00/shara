import * as React from 'react'
import styled from 'styled-components'
import { NameInput, Description } from 'Components/Common'

const Wrapper = styled.div`
    box-sizing: border-box;
    padding-top: 50px;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.secondary.base};
`

const Image = styled.img`
    max-width: 100%;
    max-height: calc(100% - 82px);
`

const FileInfo = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ImageWrapper = styled.div`
    background: white;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: ${p => p.theme.borderRadius}px;
    flex-grow: 999;
`

export default () => {


    return (
        <Wrapper>
            <FileInfo>
                <NameInput value='ebin' />
                <Description rows={1} />
            </FileInfo>
            <ImageWrapper>
                <Image src='http://hdwarena.com/wp-content/uploads/2018/10/Natural-Full-HD-Imag.jpg' />
            </ImageWrapper>
        </Wrapper>
    )
}