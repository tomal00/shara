import * as React from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components'

import Navigation from './navigation'
import Library from './library'
import Account from './account'
import About from './about'
import Upload from './upload'

interface AppProps {
    className?: string
}

export default hot(styled(({ className }: AppProps) => (
    <div className={className}>
        <BrowserRouter>
            <Navigation />
            <div>
                <Switch>
                    <Route path='/account'>
                        <Account />
                    </Route>
                    <Route path='/upload'>
                        <Upload />
                    </Route>
                    <Route path='/library'>
                        <Library />
                    </Route>
                    <Route path='/about'>
                        <About />
                    </Route>
                    <Redirect from='/' to='/upload' />
                </Switch>
            </div>
        </BrowserRouter>
    </div>
))`
font-family: 'Roboto', sans-serif;
`
)