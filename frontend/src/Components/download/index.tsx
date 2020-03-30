import * as React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
    min-height: calc(100% - 100px);
    top: 50px;
    position: relative;
    background: ${p => p.theme.colors.grey.light};
`

const Content = styled.div`
    max-width: 1200px;
    padding: 40px;
    margin: auto;
`

const Title = styled.div`
    font-size: 26px;
`

const SubTitle = styled.div`
    font-size: 22px;
`

const List = styled.ul`
    margin: 8px 0;
`

const ListItem = styled.li`
    margin: 4px 0;
`

const StyledLink = styled.a`
    color: inherit!important;
`

export default () => (
    <Wrapper>
        <Content>
            <Title>
                Desktop app downloads
            </Title>
            <br />
            <br />
            <SubTitle>
                <FontAwesomeIcon icon={['fab', 'windows']} /> Windows
            </SubTitle>
            <List>
                <ListItem>
                    <StyledLink href='/downloads/shara-desktop_Setup_win32.exe'>Windows Installer (.exe) 32bit</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href='/downloads/shara-desktop_Setup_win64.exe'>Windows Installer (.exe) 64bit</StyledLink>
                </ListItem>
            </List>
            <br />
            <SubTitle>
                <FontAwesomeIcon icon={['fab', 'linux']} /> Linux
            </SubTitle>
            <List>
                <ListItem>
                    <StyledLink href='downloads/shara-desktop_i386.deb'>Debian package (.deb) 32bit</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href='downloads/shara-desktop_amd64.deb'>Debian package (.deb) 64bit</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href='downloads/shara-desktop_ia32.tar.xz'>Tar xz Archive (.tar.xz) 32bit</StyledLink>
                </ListItem>
                <ListItem>
                    <StyledLink href='downloads/shara-desktop.tar.xz'>Tar xz Archive (.tar.xz) 64bit</StyledLink>
                </ListItem>
            </List>
        </Content>
    </Wrapper>
)