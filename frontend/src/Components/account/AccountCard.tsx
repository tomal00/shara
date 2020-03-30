import * as React from 'react'
import styled from 'styled-components'
import { Button, Input, NameInput, StyledTooltip } from 'Components/Common'
import { AppContext } from 'Root/AppContext'
import { StateSetter } from 'Types/etc'
import { useCancelable } from 'Root/hooks'
import { selectFileFromExplorer } from 'Root/files'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { copyToClipboard } from 'Root/helpers'

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

interface AccountCardState {
    name: string,
    avatarUrl?: string
}

export default ({ onLoad }: { onLoad: () => void }) => {
    const { accountHash, api, setAccountHash, addNotification, logOut } = React.useContext(AppContext)
    const [state, setState]: [AccountCardState, StateSetter<AccountCardState>] = React.useState({ name: '' })
    const { name, avatarUrl } = state
    const { createCancelable } = useCancelable()

    React.useEffect(() => {
        createCancelable(api.getAccountInfo())
            .promise
            .then((res) => {
                setState({ ...state, name: res.name, avatarUrl: res.avatarUrl });
                onLoad()
            })
            .catch(err => {
                if (!err.isCanceled) {
                    console.error(err)
                    if (err.statusCode === 401) { logOut() }
                }
            })
    }, [accountHash])

    return <AccountCard>
        <StyledNameInput
            placeholder='Nickname'
            value={name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            onBlur={() => {
                api.updateAccountInfo({ name })
                    .catch(err => {
                        if (!err.isCanceled) {
                            console.error(err)
                            if (err.statusCode === 401) { logOut() }
                        }
                    })
            }} />
        <Avatar
            data-for='avatar-tooltip'
            data-tip='Change avatar'
            avatarUrl={avatarUrl ? avatarUrl : defaultAvatar}
            onClick={async (e) => {
                e.persist()

                try {
                    const file = await selectFileFromExplorer()
                    if (file && file.type.match(/image/g)) {
                        createCancelable(api.uploadAvatar(file).then(api.getAccountInfo))
                            .promise
                            .then((res) => {
                                setState({ ...state, name: res.name, avatarUrl: res.avatarUrl });
                            })
                            .catch(err => {
                                if (!err.isCanceled) {
                                    console.error(err)
                                    if (err.statusCode === 401) { logOut() }
                                }
                            })

                    }
                    else {
                        addNotification({
                            clearPrevious: true,
                            notification: {
                                level: 'error',
                                title: 'Invalid type of file',
                                message: 'Please, select a file of image type',
                                autoDismiss: 10
                            }
                        })
                    }
                }
                catch (e) {
                    console.error(e)
                }
            }} />
        <StyledTooltip tooltipProps={{ id: 'avatar-tooltip', effect: 'solid', place: 'right' }} />
        <HashWrapper>
            <CustomInput value={accountHash} readOnly />
            <span
                data-for='copy-tooltip'
                data-tip='Copy to clipboard'>
                <StyledIcon icon='copy' onClick={() => {
                    copyToClipboard(accountHash)
                    addNotification({
                        clearPrevious: true,
                        notification: {
                            level: 'info',
                            title: 'Copied',
                            message: 'Your account\'s hash has been copied to clipboard ',
                            autoDismiss: 10
                        }
                    })
                }} />
            </span>
            <StyledTooltip isPrimaryColor tooltipProps={{ id: 'copy-tooltip', effect: 'solid' }} />
        </HashWrapper>
        <StyledButton
            onClick={() => {
                api.logOut()
                setAccountHash(null)
            }}>
            Logout
        </StyledButton>
        {/*<CustomInput placeholder='Enter e-mail address here...' />
        <Button>Send hash</Button>*/}
    </AccountCard>
}