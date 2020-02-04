import { useEffect, useState } from 'react';
import { Cancelable } from 'Types/cancelable'
import { StateSetter } from 'Types/etc'
import { RefObject } from 'react'

export function useCancelableCleanup(arr: Cancelable<any>[]) {
    useEffect(() => () => {
        for (let i of arr) { i.cancel() }
        arr.splice(0, arr.length)
    }, [])
}

export function useWidth() {
    const [width, setWidth]: [number, StateSetter<number>] = useState(window.innerWidth)

    useEffect(() => {
        const resizeHandler = () => {
            if (width !== window.innerWidth) {
                setWidth(window.innerWidth)
            }
        }

        window.addEventListener('resize', resizeHandler)

        return () => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, [])

    return width
}

export function useCallbackOnOutsideClick(callback: () => void, ref: RefObject<HTMLDivElement>) {
    const handleClick = (e: MouseEvent) => {
        if (!ref.current.contains(e.target as Node)) {
            callback()
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])
}