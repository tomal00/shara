import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { selectFileFromExplorer } from 'Root/files'

const Wrapper = styled.div`
    height: calc(100% - 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

const IconWrapper = styled.div`
    position: relative;
    height: 400px;
    width: 400px;
    max-width: 100%;
    //border: 100px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    //border-radius: 100px;
    margin: 50px;
`

const InnerBorder = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    border: 50px solid white;
    border-radius: 50px;
    top: -50px;
    left: -50px;
`

const StyledIcon = styled(FontAwesomeIcon)`
    width: 100%!important;
    height: 100%;
    color: ${p => p.theme.colors.primary.light};
    transition: color 0.2s ease-out;
    cursor: pointer;

    ${IconWrapper}:hover & {
        color: ${p => p.theme.colors.primary.base};
    }
`

const TopText = styled.div`
    color: ${p => p.theme.colors.primary.light};
    opacity: 0;
    position: absolute;
    font-size: 40px;
    font-weight: bold;
    transition: color 0.2s ease-out, transform 0.2s ease-out, opacity 0.1s ease-out;
    transform: translateY(-100px);

    ${IconWrapper}:hover & {
        color: ${p => p.theme.colors.primary.base};
        transform: translateY(-200px);
        opacity: 1;
    }
`

export default () => {

    return <Wrapper>
        <IconWrapper onClick={async (e) => {
            e.persist()

            try {
                const file = await selectFileFromExplorer()
            }
            catch (e) {
                console.error(e)
            }
        }} >
            <TopText>Click to upload</TopText>
            <StyledIcon icon='cloud-upload-alt' />
        </IconWrapper>
    </Wrapper>
}