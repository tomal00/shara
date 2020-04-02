export interface MetaData {
    size: number,
    mime: string,
    description?: string
}

export interface File {
    fileArray: ArrayBuffer,
    meta: MetaData,
    name: string,
    isPrivate: boolean
}