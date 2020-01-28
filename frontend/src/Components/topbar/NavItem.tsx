import styled from 'styled-components'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface NavItemProps {
    name: string,
    icon: IconDefinition
}

const StyledLink = styled(NavLink)`
    color: ${p => p.theme.colors.secondary.light};
    text-decoration: none;
    font-weight: bold;
    font-size: 24px;
    padding: 10px;
    transition: color 0.2s ease-out;
    user-select: none;

    &:hover:not(.active) {
        color: ${p => p.theme.colors.secondary.base};
    }

    &.active {
        color: ${p => p.theme.colors.secondary.dark};
        pointer: default;
    }
`

const ListItem = styled.li`
    margin: 0 5px;
`

const NavItem = ({ name, icon }: NavItemProps) => (
    <ListItem>
        <StyledLink to={`/${name.toLowerCase()}`} activeClassName='active'>
            {icon}
        </StyledLink>
    </ListItem>
)

export default NavItem