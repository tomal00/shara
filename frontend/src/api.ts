import { getFileArray } from 'Root/files'
import { UploadedFile, Image } from 'Types/file'
import { Collection } from 'Types/collection'

const commonFetchProps = {
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
} as RequestInit

export class Api {
    constructor(private readonly apiUrl: string) { }
    private checkStatusCode(res: Response, expectedStatusCode: number) {
        if (res.status !== expectedStatusCode) {
            throw new Error('api error')
        }
    }
    createAccount = async (): Promise<{ success: boolean, accountHash: string }> => {
        let res = await fetch(`${this.apiUrl}/createAccount`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { accountHash } = await res.json()

        return { success: true, accountHash }
    }
    updateAccountInfo = async ({ name }: { name: string }): Promise<{ success: boolean }> => {
        let res = await fetch(`${this.apiUrl}/updateAccountInfo`, {
            method: 'POST',
            ...commonFetchProps,
            body: JSON.stringify({
                name
            })
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }
    logIn = async (accountHash: string): Promise<{ success: boolean }> => {
        if (!accountHash) return { success: false }

        let res = await fetch(`${this.apiUrl}/logIn`, {
            method: 'POST',
            ...commonFetchProps,
            body: JSON.stringify({
                hash: accountHash
            })
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }
    logOut = async () => {
        let res = await fetch(`${this.apiUrl}/logOut`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }
    getAccountInfo = async (): Promise<{ success: boolean, name: string }> => {
        let res = await fetch(`${this.apiUrl}/getAccountInfo`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { data } = await res.json()

        return { success: true, name: data.name }
    }
    verifyHash = async (): Promise<{ success: boolean, accountHash: string }> => {
        let res = await fetch(`${this.apiUrl}/verifyHash`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { accountHash, isValid } = await res.json()

        return { success: true, accountHash: isValid ? accountHash : '' }
    }
    uploadFile = async (file: UploadedFile): Promise<{ success: boolean, imageId: string }> => {
        const fileArray = await getFileArray(file.file)

        let res = await fetch(`${this.apiUrl}/uploadFile`, {
            method: 'POST',
            ...commonFetchProps,
            body: JSON.stringify({
                file: {
                    name: file.name,
                    meta: file.meta,
                    uInt8Array: fileArray,
                    isPrivate: file.isPrivate
                }
            })
        });
        this.checkStatusCode(res, 200)

        const { imageId } = await res.json()

        return { success: true, imageId }
    }
    deleteFile = async (
        imageId: string,
    ): Promise<{ success: boolean }> => {
        let res = await fetch(`${this.apiUrl}/deleteFile`, {
            method: 'DELETE',
            ...commonFetchProps,
            body: JSON.stringify({
                imageId,
            })
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }

    updateImageInfo = async (
        imageId: string,
        newName: string,
        newDescription: string,
        newCollectionId: string
    ): Promise<{ success: boolean }> => {
        let res = await fetch(`${this.apiUrl}/updateFileInfo`, {
            method: 'POST',
            ...commonFetchProps,
            body: JSON.stringify({
                imageId,
                imageName: newName,
                description: newDescription,
                collectionId: newCollectionId
            })
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }
    searchForImage = async (searchValue: string): Promise<{ success: boolean, results: Image[] }> => {
        let res = await fetch(`${this.apiUrl}/searchForImage?searchValue=${searchValue}`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { results } = await res.json()

        return {
            success: true,
            results: results.map((r: any) => ({
                name: r.imageName,
                description: r.description,
                collectionId: r.collectionId,
                id: r.imageId,
                url: this.getImageUrl(r.imageId)
            }))
        }
    }
    getImage = async (imageId?: string): Promise<{ success: boolean, image: Image }> => {
        let res = await fetch(`${this.apiUrl}/getImage?imageId=${imageId}`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { data } = await res.json()

        return {
            success: true,
            image: {
                name: data.imageName,
                description: data.description,
                collectionId: data.collectionId,
                id: data.imageId,
                url: this.getImageUrl(data.imageId),
                isOwner: data.isOwner
            }
        }
    }
    getImages = async (collectionId?: string): Promise<{ success: boolean, images: Image[] }> => {
        let res = await fetch(`${this.apiUrl}/getImages${collectionId ? `?collectionId=${collectionId}` : ''}`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { data } = await res.json()

        return {
            success: true,
            images: data.map((c: any): Image => ({
                name: c.imageName,
                id: c.imageId,
                description: c.description,
                url: this.getImageUrl(c.imageId),
                collectionId: c.collectionId,
                isOwner: c.isOwner
            }))
        }
    }
    getImageUrl = (imageId: string): string => {
        return `${this.apiUrl}/image/${imageId}`
    }
    deleteCollection = async (collectionId: string): Promise<{ success: boolean }> => {
        let res = await fetch(`${this.apiUrl}/deleteCollection`, {
            method: 'DELETE',
            ...commonFetchProps,
            body: JSON.stringify({ collectionId })
        });

        this.checkStatusCode(res, 200)

        return { success: true }
    }
    getCollections = async (): Promise<{ success: boolean, collections: Collection[] }> => {
        let res = await fetch(`${this.apiUrl}/getCollections`, {
            method: 'GET',
            ...commonFetchProps,
        });
        this.checkStatusCode(res, 200)

        const { data } = await res.json()

        return { success: true, collections: data.map((c: any) => ({ name: c.name, id: c.collectionId })) }
    }
    createCollection = async (collectionName: string): Promise<{ success: boolean }> => {
        if (!collectionName) throw new Error('you have to specify a collection name!')

        let res = await fetch(`${this.apiUrl}/createCollection`, {
            method: 'POST',
            ...commonFetchProps,
            body: JSON.stringify({
                collectionName
            })
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }
    renameCollection = async (newName: string, collectionId: string): Promise<{ success: boolean }> => {
        if (!newName) throw new Error('you have to specify a collection name!')

        let res = await fetch(`${this.apiUrl}/updateCollectionInfo`, {
            method: 'POST',
            ...commonFetchProps,
            body: JSON.stringify({
                collectionId,
                name: newName
            })
        });
        this.checkStatusCode(res, 200)

        return { success: true }
    }
}