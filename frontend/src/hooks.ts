import { useEffect, useState, useRef } from 'react';
import { Cancelable } from 'Types/cancelable'
import { StateSetter } from 'Types/etc'
import { RefObject } from 'react'
import { makeCancelable } from 'Root/helpers'

export function useCancelable() {
    const cancelablesRef: React.RefObject<Cancelable<any>[]> = useRef([])

    function createCancelable<T>(p: Promise<T>) {
        const cancelable = makeCancelable<T>(p)
        cancelablesRef.current.push(cancelable)

        return cancelable
    }

    function cancelCancelables() {
        for (let cancelable of cancelablesRef.current) {
            cancelable.cancel()
        }
        cancelablesRef.current.splice(0, cancelablesRef.current.length)
    }

    useEffect(() => () => {
        cancelCancelables()
    }, [])

    return { createCancelable, cancelCancelables }
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