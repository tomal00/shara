import * as React from 'react'
import styled from 'styled-components'
import UploadView from 'Components/upload/UploadView'
import FileView from 'Components/upload/FileView'
import { UploadedFile } from 'Types/file'
import { AppContext } from 'Root/AppContext'
import { useCancelable } from 'Root/hooks'
import { StateSetter } from 'Types/etc'
import { useHistory, Redirect } from 'react-router-dom'

const Wrapper = styled.div`
    min-height: calc(100% - 50px);
    top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: ${p => p.theme.colors.grey.light};
`

export default () => {
    const { api, accountHash, addNotification } = React.useContext(AppContext)

    if (!accountHash) {
        return <Redirect to='/account' />
    }

    const { createCancelable } = useCancelable()
    const [file, setFile]: [UploadedFile, StateSetter<File>] = React.useState(null)
    const history = useHistory()

    return <Wrapper>
        {file ?
            (<FileView
                file={file}
                onCancel={() => setFile(null)}
                onUpload={(file: UploadedFile) => {
                    createCancelable(api.uploadFile(file))
                        .promise
                        .then(({ success, imageId }) => {
                            if (success) {
                                setFile(null)
                                history.push(`/image/${imageId}`)
                            }
                        })
                        .catch(err => { if (!err.isCanceled) console.error(err) })
                }} />)
            : (<UploadView
                onSelectFile={setFile}
                addNotification={addNotification} />)}
    </Wrapper>
}