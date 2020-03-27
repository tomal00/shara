import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from 'Renderer/theme'
import * as api from 'Utils/api'
import LogInMenu from 'Components/LogInMenu'
import Loading from 'Components/Loading'
import ActionMenu from 'Components/ActionMenu'
import { Account } from 'Types/account'
import { Notification as NotificationType } from 'Types/notification'
import { ImportFile } from 'Utils/files'
import { shell, ipcRenderer } from 'electron'
import Notification from 'Components/Notification'

const { useReducer, useEffect } = React

type AppState = {
    isLoading: boolean,
    currentAccount: Account | null,
    currentNotification: NotificationType | null
}

type NewState = {
    isLoading?: boolean,
    currentAccount?: Account | null,
    currentNotification?: NotificationType | null
}

export default () => {
    const [state, setState] = useReducer<React.Reducer<AppState, NewState>>(
        (state: AppState, newState: any) => ({ ...state, ...newState }),
        { isLoading: false, currentAccount: null, currentNotification: null }
    )

    const setNotification = (notification: NotificationType) => {
        setState({ currentNotification: notification })
    }

    useEffect(() => {
        setState({ isLoading: true })
        api.verifySession()
            .then(async ({ data, success }) => {
                if (success && data) {
                    const res = await api.getAccountInfo()

                    if (res.success && res.data) {
                        setState({ currentAccount: { hash: data, ...res.data } })
                    }
                }
            })
            .finally(() => {
                setState({ isLoading: false })
            })
    }, [])

    const { isLoading, currentAccount, currentNotification } = state

    const handleLogIn = (hash: string) => {
        setState({ isLoading: true })
        api.logIn(hash)
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message)
                }
                else {
                    ipcRenderer.invoke('update-tray')
                }
            })
            .then(api.getAccountInfo)
            .then(res => {
                if (res.success && !!res.data) {
                    setState({ currentAccount: { hash, ...res.data } })
                }
            })
            .catch(({ message }: Error) => {
                setNotification({ message, type: 'error' })
            })
            .finally(() => setState({ isLoading: false }))
    }
    const handleLogOut = async (): Promise<void> => {
        await api.logOut()
        setState({ currentAccount: null, isLoading: false })
        ipcRenderer.invoke('update-tray')
    }
    const handleChangeName = async (newName: string): Promise<{ success: boolean }> => {
        const { success, message } = await api.updateAccountInfo({ name: newName })

        if (!success) {
            setNotification({ message, type: 'error' })
        }

        return { success }
    }
    const handleUploadFile = async (): Promise<void> => {
        const path = await ipcRenderer.invoke('get-file-path')
        const file = await ImportFile(path)

        if (!file) return

        const res = await api.uploadFile(file)

        if (!res.success || !res.data) {
            setNotification({ message: res.message, type: 'error' })
            return
        }
        else {
            shell.openExternal(res.data.imageUrl)
        }

    }
    const handleChangeAvatar = async (): Promise<void> => {
        const path = await ipcRenderer.invoke('get-file-path')
        const file = await ImportFile(path)
        let accountInfo = state.currentAccount

        if (!file) return

        setState({ isLoading: true })
        const res = await api.changeAvatar(file)

        if (res.success) {
            const infoRes = await api.getAccountInfo()

            if (infoRes.success && infoRes.data && accountInfo) {
                accountInfo = { ...infoRes.data, hash: accountInfo.hash }
            }
        }
        else setNotification({ message: res.message, type: 'error' })

        setState({ isLoading: false, currentAccount: accountInfo })
    }

    const displayedMenu = !currentAccount ?
        (<LogInMenu onLogIn={handleLogIn} />) :
        (<ActionMenu
            currentAccount={currentAccount}
            onLogOut={handleLogOut}
            onChangeName={handleChangeName}
            onUploadFile={handleUploadFile}
            onChangeAvatar={handleChangeAvatar} />)

    return <div>
        <ThemeProvider theme={theme}>
            <Notification
                onClose={() => setState({ currentNotification: null })}
                notification={currentNotification} />
            {isLoading && <Loading />}
            {displayedMenu}
        </ThemeProvider>
    </div>
}