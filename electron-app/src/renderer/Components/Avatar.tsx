import styled from 'styled-components'

export default styled.div<{ avatarUrl: string }>`
    box-sizing: border-box;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 3px solid ${p => p.theme.colors.secondary.base};
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease-out;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            border-color: ${p => p.theme.colors.secondary.dark};

            &::after {
                opacity: 0.5;
            }
        }
    }

    &::after {
        cursor: pointer;
        transition: opacity 0.2s ease-out;
        content: "";
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        background-color: white;
        background-position: center;
        background-size: cover;
        background-image: url(${p => p.avatarUrl});
    }
`