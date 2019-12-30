import * as React from 'react'
import styled from 'styled-components'
import CollectionView from 'Root/Components/library/CollectionView'
import SideBar from 'Components/library/SideBar'

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: stretch;
    padding-top: 50px;
`

export default () => {


    return (
        <Wrapper>
            <SideBar />
            <CollectionView />
        </Wrapper>
    )
}