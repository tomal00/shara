import * as ReactDOM from 'react-dom'
import * as React from 'react'
import 'normalize.css'

import App from 'Components/App'
import icons from 'Root/icons'

icons.init()

ReactDOM.render(
    <App />,
    document.getElementById('root')
)