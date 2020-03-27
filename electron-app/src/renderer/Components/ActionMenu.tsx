import * as React from 'react'
import styled from 'styled-components'
import { Button, Input, NameInput } from 'Components/Common'
import { Account } from 'Types/account'
import Avatar from 'Components/Avatar'


const defaultAvatar = require('Public/default-avatar.png')
const { useState } = React

const Wrapper = styled.div`
    background: ${p => p.theme.colors.grey.light};
    display: grid;
    grid-template-columns: calc(50% - 10px) calc(50% - 10px);
    grid-column-gap: 20px;
    justify-items: stretch;
    align-items: center;
    padding: 20px;
    height: 100vh;
`

const StyledAvatar = styled(Avatar)`
    justify-self: center;
    height: 60px;
    width: 60px;
`

const StretchedButton = styled(Button)`
    grid-column: span 2;
`

const StretchedInput = styled(Input)`
    grid-column: span 2;
`

const AccountInfo = styled.div`
    display: flex;
    grid-column: span 2;
    justify-content: space-evenly;
    align-items: center;
`

interface MenuProps {
    onLogOut: () => void,
    onChangeName: (name: string) => Promise<{ success: boolean }>,
    onUploadFile: () => void,
    onChangeAvatar: () => void,
    currentAccount: Account
}

export default ({ onLogOut, currentAccount, onChangeName, onUploadFile, onChangeAvatar }: MenuProps) => {
    const [name, setName] = useState<string>(currentAccount.name)

    return <Wrapper>
        <AccountInfo>
            <NameInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Nickname'
                onBlur={() => {
                    if (name) {
                        onChangeName(name)
                            .then(({ success }) => {
                                if (!success) {
                                    setName(currentAccount.name)
                                }
                            })
                    }
                    else {
                        setName(currentAccount.name)
                    }
                }}
            />
            <StyledAvatar onClick={onChangeAvatar} avatarUrl={currentAccount.avatarUrl || defaultAvatar} />
        </AccountInfo>
        <StretchedInput value={currentAccount.hash} readOnly />
        <StretchedButton onClick={onUploadFile}>Upload file</StretchedButton>
        <StretchedButton onClick={() => onLogOut()}>Log out</StretchedButton>
    </Wrapper>

}