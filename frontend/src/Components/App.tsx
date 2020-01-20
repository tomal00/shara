import * as React from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled, { ThemeProvider } from 'styled-components'

import Topbar from 'Components/topbar'
import Library from 'Components/library'
import Account from 'Components/account'
import About from 'Components/about'
import Upload from 'Components/upload'
import Image from 'Components/image'
import { lightTheme } from 'Themes/LightTheme'
import { Provider as ContextProvider } from 'Root/AppContext'
import { Api } from 'Root/api'
import * as NotificationSystem from 'react-notification-system';
import { NotificationSetter } from 'Types/etc'

const App = hot(({ className, api, accountHash }: { className?: string, api: Api, accountHash?: string }) => {
    const notificationSystem: React.Ref<NotificationSystem.System> = React.useRef(null)
    const addNotification: NotificationSetter = React.useCallback(({ notification, clearPrevious }) => {
        if (clearPrevious) {
            notificationSystem.current.clearNotifications()
        }
        notificationSystem.current.addNotification(notification)
    }, [])

    return (
        <ContextProvider addNotification={addNotification} api={api} accountHash={accountHash}>
            <ThemeProvider theme={lightTheme}>
                <div className={className}>
                    <NotificationSystem ref={notificationSystem} />
                    <BrowserRouter>
                        <Topbar />
                        <Switch>
                            <Route exact path='/account'>
                                <Account />
                            </Route>
                            <Route exact path='/upload'>
                                <Upload />
                            </Route>
                            <Route exact path='/library'>
                                <Library />
                            </Route>
                            <Route exact path='/about'>
                                <About />
                            </Route>
                            <Route path='/image/:imageId'>
                                <Image />
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