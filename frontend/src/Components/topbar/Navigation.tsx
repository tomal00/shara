import styled from 'styled-components'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import NavItem from 'Components/topbar/NavItem'

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
`

const Navigation = styled.nav`
    color:  ${p => p.theme.colors.primary.text};
`

const navItems: Array<{ name: string, icon: JSX.Element, title: string }> = [
    { name: 'Upload', icon: (<FontAwesomeIcon icon='cloud-upload-alt' />), title: 'Upload' },
    { name: 'Library', icon: (<FontAwesomeIcon icon='images' />), title: 'My images' },
    //{ name: 'About', icon: (<FontAwesomeIcon icon='info' />) },
    { name: 'Account', icon: (<FontAwesomeIcon icon='user' />), title: 'My account' }
]

export default () => (
    <Navigation>
        <List>
            {
                navItems.map(({ name, icon, title }) =>
                    <NavItem key={name} name={name} icon={icon} title={title} />)
            }
        </List>
    </Navigation>
)
