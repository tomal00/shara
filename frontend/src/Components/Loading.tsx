import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 997;
    background: ${p => p.theme.colors.grey.light};
`

const StyledIcon = styled(FontAwesomeIcon)`
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg)
        }
    }

    font-size: 100px;
    animation: spin 3s infinite linear;
`

export default () => (
    <Wrapper>
        <StyledIcon icon='sync-alt' />
    </Wrapper>
)