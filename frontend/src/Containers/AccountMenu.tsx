import * as React from 'react'
import AccountCard from 'Components/account/AccountCard'
import { useCancelable } from 'Root/hooks'
import { selectFileFromExplorer } from 'Root/files'
import { AppContext } from 'Root/AppContext'
import { copyToClipboard } from 'Root/helpers'

interface AccountMenuState {
    name: string,
    avatarUrl?: string
}

export default ({ onLoad }: { onLoad: () => void }) => {
    const { createCancelable } = useCancelable()
    const { accountHash, api, setAccountHash, addNotification, logOut } = React.useContext(AppContext)
    const [state, setState] = React.useState<AccountMenuState>({ name: '' })
    const { name, avatarUrl } = state

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

    const handleChangeName = (value: string): void => setState({ ...state, name: value })
    const handleUpdateName = (): void => {
        api.updateAccountInfo({ name })
            .catch(err => {
                if (!err.isCanceled) {
                    console.error(err)
                    if (err.statusCode === 401) { logOut() }
                }
            })
    }
    const handleUpdateAvatar = async (): Promise<void> => {
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
    }
    const handleCopyHash = () => {
        if (!accountHash) return

        copyToClipboard(accountHash)
        addNotification({
            clearPrevious: true,
            notification: {
                level: 'info',
                title: 'Copied',
                message: 'Your account\'s hash has been copied to the clipboard ',
                autoDismiss: 10
            }
        })
    }
    const handleLogOut = () => {
        api.logOut()
        setAccountHash(null)
    }

    return <AccountCard
        avatarUrl={avatarUrl || ''}
        name={name}
        accountHash={accountHash || ''}
        onChangeName={handleChangeName}
        onUpdateName={handleUpdateName}
        onUpdateAvatar={handleUpdateAvatar}
        onCopyHash={handleCopyHash}
        onLogOut={handleLogOut}
    />
}