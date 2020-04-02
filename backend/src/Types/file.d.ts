export interface MetaData {
    size: number,
    mime: string,
    description?: string
}

export interface FullFileInfo {
    ownerHash: string,
    collectionId?: string,
    imageId: string,
    imageName: string,
    description?: string,
    isPrivate: boolean
}