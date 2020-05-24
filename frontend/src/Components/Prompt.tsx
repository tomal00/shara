import * as React from 'react'
import styled from 'styled-components'
import { PromptData } from 'Types/etc'
import { Button, Input } from 'Components/Common'

const Wrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1000;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    animation: fade-in 0.1s;

    &.will-unmount {
        transition: opacity 0.1s;
        opacity: 0;
    }

`

const Card = styled.div`
    border-radius: ${p => p.theme.borderRadius}px;
    border: 1px solid ${p => p.theme.colors.grey.base};
    background: ${p => p.theme.colors.white.base};
    max-width: 80%;
    width: 300px;
    display: flex;
    flex-direction: column;
    padding: 20px;
`

const StyledButton = styled(Button)`
    padding: 10px;

    &:not(.active) {
        background-color: ${p => p.theme.colors.grey.base};
        color: ${p => p.theme.colors.grey.dark};
        cursor: not-allowed;
    }

    &:last-child {
        margin-left: 15px;

        &.active {
            background-color: ${p => p.theme.colors.secondary.base};
            color: ${p => p.theme.colors.secondary.text};

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background-color: ${p => p.theme.colors.secondary.dark};
                }
            }
        }
    }
`

const Title = styled.div`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
`

const Message = styled.div`
    margin-bottom: 10px;
`

const Buttons = styled.div`
    display: flex;
    justify-content: flex-end;
`

const StyledInput = styled(Input)`
    margin-bottom: 10px;
`

export type Props = {
    promptData: PromptData,
    className?: string,
    onResolve: (res?: string) => void,
    onReject: () => void
}

export default ({ className, promptData, onResolve, onReject }: Props) => {
    const { confirmText, stornoText, title, text, type, inputPlaceholder } = promptData
    const [willUnmount, setWillUnmount] = React.useState<boolean>(false)
    const [inputValue, setInputValue] = React.useState<string>('')
    const canConfirm = type === 'confirm' || inputValue

    return <Wrapper className={`${className} ${willUnmount ? 'will-unmount' : ''}`}>
        <Card>
            <Title>{title}</Title>
            {text && <Message>{text}</Message>}
            {
                type === 'input' && <StyledInput
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    maxLength={128}
                    placeholder={inputPlaceholder} />
            }
            <Buttons>
                <StyledButton className='active' onClick={() => {
                    if (willUnmount) return

                    setWillUnmount(true)
                    setTimeout(() => onReject(), 150)
                }}>
                    {stornoText}
                </StyledButton>
                <StyledButton className={canConfirm ? 'active' : ''} onClick={() => {
                    if (!canConfirm || willUnmount) return

                    setWillUnmount(true)
                    setTimeout(() => onResolve(type === 'input' ? inputValue : undefined), 150)
                }}>
                    {confirmText}
                </StyledButton>
            </Buttons>
        </Card>
    </Wrapper>
}