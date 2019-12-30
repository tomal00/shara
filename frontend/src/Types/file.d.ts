export interface MetaData {
    size: number,
    mime: string,
    description?: string
}

export interface UploadedFile {
    blob: Blob,
    objectUrl?: string,
    meta: MetaData,
    name: string
}