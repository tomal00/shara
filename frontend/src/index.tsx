import * as ReactDOM from 'react-dom'
import * as React from 'react'
import 'normalize.css'
import { Api } from 'Root/api'
import App from 'Components/App'
import icons from 'Root/icons'

const apiUrl = 'https://qlxwd19sx6.execute-api.eu-central-1.amazonaws.com/dev'
const api = new Api(apiUrl)

icons.init()

let accountHash = ''

api.verifyHash()
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