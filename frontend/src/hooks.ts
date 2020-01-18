import { useEffect, useState } from 'react';
import { Cancelable } from 'Types/cancelable'
import { StateSetter } from 'Types/etc'

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