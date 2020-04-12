import * as React from 'react'
import styled from 'styled-components'
import { Button, Input, NameInput, StyledTooltip } from 'Components/Common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const defaultAvatar = require("Assets/default-avatar.png").default

const AccountCard = styled.div`
    padding: 50px 70px;
    width: 540px;
    box-sizing: border-box;
    height: fit-content;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.secondary.base};
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 25px 120px 43px auto;
    grid-row-gap: 15px;
    align-items: center;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    border: 1px solid ${p => p.theme.colors.grey.base};
    background: ${p => p.theme.colors.white.base};
    margin: 10px 5%;

    @media (max-width: 450px) {
        padding: 30px 30px;
    }
`

const HashWrapper = styled.div`
    grid-column: span 2;
    display: flex;
    align-self: stretch;
`

const StyledIcon = styled(FontAwesomeIcon)`
    height: calc(100% - 20px);
    width: 20px!important;
    padding: 10px;
    transition: color 0.2s ease-out;
    cursor: pointer;
    user-select: none;
    color: ${p => p.theme.colors.grey.dark};

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            color: ${p => p.theme.colors.primary.base};
        }
    }
`

const CustomInput = styled(Input)`
    height: 100%;

    ${HashWrapper} > & {
        flex-grow: 10;
    }
`

const Avatar = styled.div<{ avatarUrl: string }>`
    box-sizing: border-box;
    height: 100px;
    width: 100px;
    justify-self: center;
    border-radius: 50%;
    grid-column: span 2;
    border: 3px solid ${p => p.theme.colors.secondary.base};
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease-out;
    align-self: start;

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

const StyledNameInput = styled(NameInput)`
    grid-column: span 2;
    max-width: 100%;
`
const StyledButton = styled(Button)`
    grid-column: span 2;
`

interface AccountCardProps {
    avatarUrl: string,
    accountHash: string,
    name: string,
    onChangeName: (newName: string) => void,
    onUpdateName: () => void,
    onUpdateAvatar: () => void,
    onCopyHash: () => void,
    onLogOut: () => void
}

export default ({
    avatarUrl, accountHash, name, onChangeName, onUpdateName, onUpdateAvatar, onCopyHash, onLogOut
}: AccountCardProps) => {

    return <AccountCard>
        <StyledNameInput
            placeholder='Nickname'
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            onBlur={onUpdateName} />
        <Avatar
            data-for='avatar-tooltip'
            data-tip='Change avatar'
            avatarUrl={avatarUrl ? avatarUrl : defaultAvatar}
            onClick={onUpdateAvatar} />
        <StyledTooltip tooltipProps={{ id: 'avatar-tooltip', effect: 'solid', place: 'right' }} />
        <HashWrapper>
            <CustomInput value={accountHash} readOnly />
            <span
                data-for='copy-tooltip'
                data-tip='Copy to clipboard'>
                <StyledIcon icon='copy' onClick={onCopyHash} />
            </span>
            <StyledTooltip isPrimaryColor tooltipProps={{ id: 'copy-tooltip', effect: 'solid' }} />
        </HashWrapper>
        <StyledButton
            onClick={onLogOut}>
            Logout
        </StyledButton>
    </AccountCard>
}