import * as React from 'react'
import styled from 'styled-components'
import { Button, Input, NameInput } from 'Components/Common'
import { AppContext } from 'Root/AppContext'
import { StateSetter } from 'Types/etc'
import { makeCancelable } from 'Root/helpers'
import { Cancelable } from 'Root/Types/cancelable'
import { useCancelableCleanup } from 'Root/hooks'

const AccountCard = styled.div`
    padding: 20px;
    width: 400px;
    /*height: 300px;*/
    height: 220px;
    border-radius: ${p => p.theme.borderRadius}px;
    background: ${p => p.theme.colors.secondary.base};
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 25px 120px 30px 30px 30px;
    grid-row-gap: 15px;
    align-items: center;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
`

const CustomInput = styled(Input)`
width: 100%;
`

const Avatar = styled.div`
    box-sizing: border-box;
    height: 100px;
    width: 100px;
    justify-self: center;
    border-radius: 50%;
    grid-column: span 2;
    border: 3px solid ${p => p.theme.colors.primary.base};
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s ease-out;
    align-self: start;

    &:hover {
        border-color: ${p => p.theme.colors.primary.dark};

        &::after {
            opacity: 0.5;
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
        background-image: url(https://images-na.ssl-images-amazon.com/images/I/51GfWevWFiL._SX425_.jpg);
    }
`

const activePromises: Cancelable<any>[] = []

export default ({ onLoad }: { onLoad: () => void }) => {
    const { accountHash, api, setAccountHash } = React.useContext(AppContext)
    const [name, setName]: [string, StateSetter<string>] = React.useState('')

    useCancelableCleanup(activePromises)

    React.useEffect(() => {
        const cancelable = makeCancelable(api.getAccountInfo())
        cancelable
            .promise
            .then((res) => {
                setName(res.name);
                onLoad()
            })
            .catch(err => { if (!err.isCanceled) console.error(err) })
        activePromises.push(cancelable)

    }, [accountHash])

    return <AccountCard>
        <NameInput
            placeholder='Nickname'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
                api.updateAccountInfo({ name })
                    .catch(err => console.error(err))
            }} />
        <Avatar />
        <CustomInput value={accountHash} readOnly />
        <Button
            onClick={() => {
                api.logOut()
                setAccountHash(null)
            }}>
            Logout
        </Button>
        {/*<CustomInput placeholder='Enter e-mail address here...' />
        <Button>Send hash</Button>*/}
    </AccountCard>
}