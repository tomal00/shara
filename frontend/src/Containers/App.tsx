import * as React from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'

import Topbar from 'Components/topbar'
import Library from 'Containers/Library'
import Account from 'Components/account'
import About from 'Components/about'
import Upload from 'Containers/Upload'
import Image from 'Containers/Image'
import Footer from 'Components/footer'
import Download from 'Components/download'
import Prompt, { Props as PromptProps } from 'Root/Components/Prompt'
import { lightTheme } from 'Root/Themes/DefaultTheme'
import { Provider as ContextProvider } from 'Root/AppContext'
import { Api } from 'Root/api'
import * as NotificationSystem from 'react-notification-system';
import { NotificationSetter, PromptData } from 'Types/etc'

const App = hot(({ className, api, accountHash }: { className?: string, api: Api, accountHash: string | null }) => {
    const notificationSystem: React.Ref<NotificationSystem.System> = React.useRef(null)
    const addNotification: NotificationSetter = React.useCallback(({ notification, clearPrevious }) => {
        if (!notificationSystem.current) return

        if (clearPrevious) {
            notificationSystem.current.clearNotifications()
        }
        notificationSystem.current.addNotification(notification)
    }, [])
    const [prompt, setPrompt] = React.useState<PromptProps | null>(null)
    const openPrompt = (data: PromptData) => new Promise<void | string>((res, rej) => {
        setPrompt({
            promptData: data,
            onResolve: (val?: string) => {
                setPrompt(null)
                res(val)
            },
            onReject: () => {
                setPrompt(null)
                rej({ isCanceled: true })
            }
        })
    })

    React.useEffect(() => {
        if (!JSON.parse(localStorage.getItem('cookies') || 'null')) {
            addNotification({
                clearPrevious: false, notification: {
                    level: 'info',
                    title: 'Cookies',
                    message: 'This web application utilizes cookies in order to function properly.',
                    autoDismiss: 0,
                    action: {
                        label: 'I understand',
                        callback: () => {
                            localStorage.setItem('cookies', 'true')
                        }
                    }
                }
            })
        }
    }, [])

    return (
        <ContextProvider
            addNotification={addNotification}
            api={api}
            accountHash={accountHash}
            prompt={prompt ? prompt.promptData : null}
            openPrompt={openPrompt}>
            <ThemeProvider theme={lightTheme}>
                <div className={className}>
                    {
                        prompt && <Prompt {...prompt} />
                    }
                    <NotificationSystem ref={notificationSystem} />
                    <BrowserRouter>
                        <Topbar />
                        <Switch>
                            <Route exact path='/account'>
                                <Account />
                                <Footer />
                            </Route>
                            <Route exact path='/upload'>
                                <Upload />
                            </Route>
                            <Route exact path='/library'>
                                <Library />
                            </Route>
                            <Route exact path='/about'>
                                <About />
                                <Footer />
                            </Route>
                            <Route path='/image/:imageId'>
                                <Image />
                                <Footer />
                            </Route>
                            <Route exact path='/download'>
                                <Download />
                                <Footer />
                            </Route>
                            <Redirect from='/' to='/upload' />
                        </Switch>
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        </ContextProvider>
    )
})

export default styled(App)`
    font-family: 'Roboto', sans-serif;
    min-width: 300px;
`