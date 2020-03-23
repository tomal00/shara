import * as ReactDOM from 'react-dom'
import * as React from 'react'
import 'normalize.css'
import { Api } from 'Root/api'
import App from 'Components/App'
import icons from 'Root/icons'
import { createBrowserHistory } from 'history';
import { apiUrl } from '../config.json'

const api = new Api(apiUrl)
const history = createBrowserHistory();

const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
if (path) {
    history.replace(path);
}

icons.init()

let accountHash = ''

api.verifySession()
    .then((res) => {
        accountHash = res.accountHash
    })
    .catch(e => { })
    .finally(() => {
        ReactDOM.render(
            <App api={api} accountHash={accountHash} />,
            document.getElementById('root')
        )
    })