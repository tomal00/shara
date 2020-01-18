export interface MetaData {
    size: number,
    mime: string,
    description?: string
}

export interface UploadedFile {
    file: File,
    objectUrl?: string,
    meta: MetaData,
    name: string,
    isPrivate: boolean
}

export interface Image {
    id: string,
    name: string,
    description?: string,
    url: string,
    collectionId?: string,
    isOwner: boolean
}