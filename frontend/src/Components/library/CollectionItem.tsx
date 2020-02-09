import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import { NameInput } from 'Components/Common'
import { Image as ImageType } from 'Types/file'
import { Link } from "react-router-dom";

const Wrapper = styled.div`
    position: relative;
    background-color: ${p => p.theme.colors.grey.base};
    border-radius: ${p => p.theme.borderRadius}px;
    padding: 4px;
    height: 180px;
    width: 180px;
    cursor: pointer;
    transition: background-color 0.2s ease-out, color 0.2s ease-out, border-color 0.2s ease-out;
    margin: 20px;
    display: inline-block;
    border-bottom: 2px solid ${p => p.theme.colors.grey.dark};

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            &:nth-child(even) {
                background-color: ${p => p.theme.colors.primary.base};
                border-color: ${p => p.theme.colors.primary.dark};
            }
            &:nth-child(odd) {
                background-color: ${p => p.theme.colors.secondary.base};
                border-color: ${p => p.theme.colors.secondary.dark};
            }
            color: ${p => p.theme.colors.primary.text};
        }
    }
`
const Image = styled.div`
    background-image: url(${(p: { imageUrl: string }) => p.imageUrl});
    height: 150px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: white;
    border-radius: 3px;
    transition: opacity 0.2s ease-out;

    @media (hover: hover) and (pointer: fine) {
        ${Wrapper}:hover & {
            opacity: 0.6;
        }
    }
`

const ImageWrapper = styled.div`
    background-color: white;
    border-radius: ${p => p.theme.borderRadius}px;
`

const FileName = styled.div`
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 8px 0;
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

export default ({ image }: { image: ImageType, key?: any }) => {

    return <Wrapper>
        <StyledLink to={`/image/${image.id}`}>
            <ImageWrapper>
                <Image imageUrl={image.url} />
            </ImageWrapper>
            <FileName>{image.name}</FileName>
        </StyledLink>
    </Wrapper>
}