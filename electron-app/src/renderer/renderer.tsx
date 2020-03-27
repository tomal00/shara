import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'Renderer/App'
import icons from 'Renderer/icons'

import 'normalize.css';
import 'Public/style.css'

icons.init()

ReactDOM.render(
    <App />,
    document.getElementById('app')
);