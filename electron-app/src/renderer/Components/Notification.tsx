import styled from 'styled-components'
import * as React from 'react'
import { Notification } from 'Types/notification'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out, opacity 0.4s ease-out;
    z-index: 999;
    
    @keyframes spawn {
        from {opacity: 0;}
        to {opacity: 1;}
    }

    animation: spawn 0.4s ease-out 1;
`

const Message = styled.div`
    padding: 5px;
    min-width: 0;
`

const CloseIcon = styled(FontAwesomeIcon)`
    padding: 5px;
    box-sizing: content-box;
    cursor: pointer;
    transition: color 0.2s ease-out;

    &:hover {
        color: white;
    }
`

type Props = {
    notification: Notification | null,
    className?: string,
    onClose: () => void
}

const typeColors = new Map<Notification['type'], { border: string, background: string }>()
typeColors.set('error', { border: '#e53935', background: '#ff6f60' })
typeColors.set('info', { border: '#81d4fa', background: '#b6ffff' })
typeColors.set('success', { border: '#64dd17', background: '#9cff57' })

export default styled(({ notification, className, onClose }: Props) => {
    if (!notification) return null

    return <Wrapper className={className}>
        <Message>{notification.message}</Message>
        <CloseIcon icon='times' onClick={onClose} />
    </Wrapper>
})`
    ${p => {
        if (!p.notification) return ''
        const type = typeColors.get(p.notification.type)

        if (!type) return ''

        else return `
            border: 2px solid ${type.border};
            background-color: ${type.background};
        `
    }}
`