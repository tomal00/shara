import * as React from 'react'
import styled from 'styled-components'
import { Collection } from 'Types/collection'
import SidebarItem, { DefaultCollection } from 'Root/Components/library/SidebarItem'
import { StateSetter } from 'Types/etc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
    height: 100%;
    display: inline-block;
    position: fixed;
    z-index: 900;
`

const List = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
`

const CreateCollectionButton = styled.div`
    line-height: 30px;
    padding: 7px 12px;
    margin: 10px;
    cursor: pointer;
    background-color: inherit;
    transition: background-color 0.2s ease-out;
    border-radius: ${p => p.theme.borderRadius}px;
    font-size: 20px;
    user-select: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            background-color: ${p => p.theme.colors.grey.base};
        }
    }
`

const Fade = styled.div`
    background-color: transparent;
    top: 0;
    height: 100%;
    width: 100vw;
    position: absolute;
    z-index: 800;
    cursor: pointer;
    transition: background-color 0.25s linear;
    user-select: none;

    &:not(.visible) {
        pointer-events: none;
        touch-action: none;
    }

    &.visible {
        background-color: rgba(0,0,0,0.6);
    }
`

const ControlsWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 900;
    height: 100%;
    display: inline-block;
    background: ${p => p.theme.colors.grey.light};
    transition: transform 0.25s linear;
    width: 250px;

    ${Wrapper}.reduced & {
        width: 230px;
        padding-right: 35px;
        &:not(.expanded) {
            transform: translateX(-220px);
        }
    }
`

const StyledIcon = styled(FontAwesomeIcon)`
    font-size: 24px;
    padding: 10px;
    transition: transform 0.25s linear, color 0.2s ease-out;
    cursor: pointer;
    user-select: none;
    color: ${p => p.theme.colors.primary.base};
    position: absolute;
    right: 0;
    top: 6px;

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            color:  ${p => p.theme.colors.primary.dark};
        }
        ${ControlsWrapper}.expanded &:hover {
            color:  ${p => p.theme.colors.secondary.dark};
        }
    }

    ${ControlsWrapper}.expanded & {
        transform: rotate(180deg);
        color: ${p => p.theme.colors.secondary.base};
    }
`

interface SideBarProps {
    collections: Collection[],
    selectedCollection: Collection,
    onSelectCollection: (id: string) => void,
    onCreateCollection: () => void,
    onDeleteCollection: (id: string) => void,
    isReduced: boolean
}

export default React.memo(({ collections, isReduced, selectedCollection, onSelectCollection, onCreateCollection, onDeleteCollection }: SideBarProps) => {
    const [isExpanded, setIsExpanded]: [boolean, StateSetter<boolean>] = React.useState(false)

    return (
        <Wrapper className={isReduced ? 'reduced' : ''} >
            <ControlsWrapper className={isExpanded ? 'expanded' : ''}>
                {
                    isReduced && <StyledIcon
                        icon='chevron-right'
                        onClick={() => setIsExpanded(!isExpanded)} />
                }
                <CreateCollectionButton onClick={onCreateCollection}>
                    + Create a collection
                            </CreateCollectionButton>
                <List>
                    <DefaultCollection
                        onSelect={() => {
                            onSelectCollection(null)
                            if (isExpanded) setIsExpanded(false)
                        }}
                        isActive={!selectedCollection} />
                    {collections.map(c => (
                        <SidebarItem
                            key={c.id}
                            name={c.name}
                            /*itemCount={c.items.length}*/
                            isActive={c === selectedCollection}
                            onSelect={() => {
                                onSelectCollection(c.id)
                                if (isExpanded) setIsExpanded(false)
                            }}
                            onDelete={() => onDeleteCollection(c.id)} />
                    ))}
                </List>
            </ControlsWrapper>
            {isReduced && <Fade className={isExpanded ? 'visible' : ''} onClick={() => setIsExpanded(false)} />}
        </Wrapper>
    )
})