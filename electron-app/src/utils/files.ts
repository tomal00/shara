import { dialog } from 'electron'
import * as fs from 'fs'
import { File } from 'Types/file'
import * as path from 'path'
import * as mimeTypes from 'mime-types'

export const selectFilePathFromExplorer = async (): Promise<null | string> => {
    const result = await dialog.showOpenDialog({
        title: 'Select the image to be uploaded',
        properties: ['openFile'],
    })

    if (result.canceled) return null

    return result.filePaths[0]
}

export const ImportFile = (filePath: string): File => {
    const arr = fs.readFileSync(filePath)
    const name = path.basename(filePath)
    const mime = mimeTypes.lookup(name) || ''

    return {
        name: name.replace(mime, ''),
        isPrivate: false,
        fileArray: arr,
        meta: {
            size: fs.statSync(filePath).size,
            mime,
            description: ''
        }
    }
}