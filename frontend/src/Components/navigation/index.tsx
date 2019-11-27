import * as React from 'react'
import { Link } from 'react-router-dom'

interface NavItem {
    name: string,
    icon: string
}

export default () => {
    const navItems: NavItem[] = [
        { name: 'Account', icon: '' },
        { name: 'Upload', icon: '' },
        { name: 'Library', icon: '' },
        { name: 'About', icon: '' }
    ]


    return (
        (
            <nav>
                <ul>
                    {
                        navItems.map((navItem: NavItem) => <li key={navItem.name}>
                            <Link to={`/${navItem.name.toLowerCase()}`}>
                                {navItem.name}
                            </Link>
                        </li>)
                    }
                </ul>
            </nav>
        )
    )
}