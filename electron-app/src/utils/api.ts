import { apiUrl, websiteUrl } from '../../config.json'
import fetch, { Headers, Response, RequestInit, RequestInfo } from 'node-fetch'
import { File } from 'Types/file'
import { session } from 'electron'

type ApiResponse<T> = Promise<{
    success: boolean,
    message: string,
    data?: T
}>

const fetchWithCookie = async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
    const isRenderer = (process && process.type === 'renderer')

    let requestInit = init

    if (!isRenderer) {
        const cookies = await session.defaultSession.cookies.get({})
        const cookie = cookies.find(c => c.name === 'sessionId')

        if (cookie) {
            requestInit = !!requestInit ? {
                ...requestInit,
                headers: {
                    ...requestInit.headers,
                    cookie: cookie.name + '=' + cookie.value
                }
            }
                : {
                    headers: {
                        cookie: cookie.name + '=' + cookie.value
                    }
                }
        }
    }

    return fetch(url, requestInit)
}

const buildResponse = async <T>(res: Response, transform: (data: any) => T): ApiResponse<T> => {
    const parsed = await res.json()

    return {
        success: res.status === 200,
        message: `${parsed.message}`,
        data: transform(parsed)
    }
}

export const logIn = async (hash: string): ApiResponse<null> => {
    const res = await fetch(`${apiUrl}/logIn`, {
        method: 'POST',
        body: JSON.stringify({
            hash
        })
    })

    return buildResponse(res, () => null)
}

export const logOut = async (): ApiResponse<null> => {
    const res = await fetchWithCookie(`${apiUrl}/logOut`)

    return buildResponse(res, () => null)
}

export const getAccountInfo = async (): ApiResponse<{ name: string, avatarUrl: string }> => {
    const res = await fetchWithCookie(`${apiUrl}/getAccountInfo`)

    return buildResponse(res, (body) => (body.data && {
        name: body.data.name,
        avatarUrl: body.data.avatarUrl
    }))
}

export const updateAccountInfo = async ({ name }: { name: string }): ApiResponse<null> => {
    const res = await fetchWithCookie(`${apiUrl}/updateAccountInfo`, {
        method: 'POST',
        body: JSON.stringify({
            name
        })
    })

    return buildResponse(res, () => null)
}

export const uploadFile = async (file: File): ApiResponse<{ imageUrl: string }> => {
    const res = await fetchWithCookie(`${apiUrl}/uploadFile`, {
        method: 'POST',
        body: JSON.stringify({
            file: {
                name: file.name,
                meta: file.meta,
                isPrivate: file.isPrivate,
                uInt8Array: file.fileArray
            }
        })
    })

    return buildResponse(res, (body) => ({
        imageUrl: `${websiteUrl}/image/${body.imageId}`
    }))
}

export const changeAvatar = async (file: File): ApiResponse<null> => {
    const res = await fetchWithCookie(`${apiUrl}/uploadAvatar`, {
        method: 'POST',
        body: JSON.stringify({
            fileArray: file.fileArray,
            mime: file.meta.mime
        })
    })

    return buildResponse(res, () => null)
}

export const verifySession = async (): ApiResponse<string | null> => {
    const res = await fetchWithCookie(`${apiUrl}/verifySession`)

    return buildResponse(res, (body) => (body.accountHash || null))
}