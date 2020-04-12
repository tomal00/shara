import * as React from 'react'
import { UploadedFile } from 'Types/file'
import { AppContext } from 'Root/AppContext'
import { useCancelable } from 'Root/hooks'
import { useHistory, Redirect } from 'react-router-dom'
import Upload from 'Components/upload'

export default () => {
    const { api, accountHash, addNotification, logOut } = React.useContext(AppContext)

    if (!accountHash) {
        return <Redirect to='/account' />
    }

    const { createCancelable } = useCancelable()
    const [selectedFile, selectFile] = React.useState<UploadedFile | null>(null)
    const history = useHistory()

    const handleUpload = (file: UploadedFile) => {
        createCancelable(api.uploadFile(file))
            .promise
            .then(({ success, imageId }) => {
                if (success) {
                    selectFile(null)
                    history.push(`/image/${imageId}`)
                }
            })
            .catch(err => {
                if (!err.isCanceled) {
                    console.error(err)
                    if (err.statusCode === 401) { logOut() }
                }
            })
    }
    const handleCancel = () => selectFile(null)
    const handleSelectFile = selectFile

    return <Upload
        file={selectedFile}
        onUpload={handleUpload}
        onCancel={handleCancel}
        onSelectFile={handleSelectFile}
        addNotification={addNotification}
    />
}