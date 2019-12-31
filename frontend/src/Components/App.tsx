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

const App = hot(({ className }: { className?: string }) => (
    <ThemeProvider theme={lightTheme}>
        <div className={className}>
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
                    <Route path='/image'>
                        <Image />
                    </Route>
                    <Redirect from='/' to='/upload' />
                </Switch>
            </BrowserRouter>
        </div>
    </ThemeProvider>
))

export default styled(App)`
    font-family: 'Roboto', sans-serif;
`