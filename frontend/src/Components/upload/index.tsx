import * as React from 'react'
import styled from 'styled-components'
import UploadView from 'Components/upload/UploadView'
import FileView from 'Components/upload/FileView'
import { UploadedFile } from 'Types/file'
import { AppContext } from 'Root/AppContext'
import { makeCancelable } from 'Root/helpers'
import { Cancelable } from 'Root/Types/cancelable'
import { useCancelableCleanup } from 'Root/hooks'
import { StateSetter } from 'Types/etc'
import { useHistory, Redirect } from 'react-router-dom'

const Wrapper = styled.div`
    height: calc(100% - 50px);
    top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

const activePromises: Cancelable<any>[] = []

export default () => {
    const { api, accountHash, addNotification } = React.useContext(AppContext)

    if (!accountHash) {
        return <Redirect to='/account' />
    }

    const [file, setFile]: [UploadedFile, StateSetter<File>] = React.useState(null)
    const history = useHistory()

    useCancelableCleanup(activePromises)

    return <Wrapper>
        {file ?
            (<FileView
                file={file}
                onCancel={() => setFile(null)}
                onUpload={(file: UploadedFile) => {
                    const cancelable = makeCancelable(api.uploadFile(file))
                    cancelable
                        .promise
                        .then(({ success, imageId }) => {
                            if (success) {
                                setFile(null)
                                history.push(`/image/${imageId}`)
                            }
                        })
                        .catch(e => {
                            if (!e.isCanceled) console.error(e)
                        })
                    activePromises.push(cancelable)
                }} />)
            : (<UploadView
                onSelectFile={setFile}
                addNotification={addNotification} />)}
    </Wrapper>
}