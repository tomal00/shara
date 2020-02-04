import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { selectFileFromExplorer } from 'Root/files'
import { StateSetter, NotificationSetter } from 'Types/etc'
import { UploadedFile } from 'Types/file'

const IconWrapper = styled.div`
    position: relative;
    width: 400px;
    max-width: 100%;
    //border: 100px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    //border-radius: 100px;
    margin: 50px;
`

const StyledIcon = styled(FontAwesomeIcon)`
    width: 100%!important;
    height: 100%;
    color: ${p => p.theme.colors.primary.base};
    transition: color 0.2s ease-out;
    cursor: pointer;

    @media (hover: hover) and (pointer: fine) {
        ${IconWrapper}:hover & {
            color: ${p => p.theme.colors.primary.dark};
        }
    }
    ${IconWrapper}.drag-over & {
        color: ${p => p.theme.colors.primary.dark};
    }
`

const TopText = styled.div`
    color: ${p => p.theme.colors.secondary.light};
    user-select: none;
    cursor: pointer;
    opacity: 0;
    position: absolute;
    font-size: 40px;
    font-weight: bold;
    transition: color 0.2s ease-out, transform 0.2s ease-out, opacity 0.1s ease-out;
    transform: translateY(-100px);

    @media (hover: hover) and (pointer: fine) {
        ${IconWrapper}:hover & {
            color: ${p => p.theme.colors.secondary.base};
            transform: translateY(-200px);
            opacity: 1;
        }
    }

    ${IconWrapper}.drag-over & {
        color: ${p => p.theme.colors.secondary.base};
        transform: translateY(-200px);
        opacity: 1;
    }
`

const formatFileObject = (file: File): UploadedFile => ({
    file,
    objectUrl: URL.createObjectURL(file),
    name: file.name.split('.').slice(0, -1).join('.'),
    meta: {
        size: file.size,
        mime: file.type,
        description: ''
    },
    isPrivate: false
})

export default ({ onSelectFile, addNotification }: { onSelectFile: React.Dispatch<any>, addNotification: NotificationSetter }) => {
    const [isDraggingOver, setIsDraggingOver]: [boolean, StateSetter<boolean>] = React.useState(false)

    React.useEffect(() => {
        let counter = 0
        const dragOverHandler = (e: DragEvent) => e.preventDefault()
        const dragLeaveHandler = () => {
            counter--
            if (counter <= 0) {
                setIsDraggingOver(false)
            }
        }
        const dragEnterHandler = () => {
            counter++
            setIsDraggingOver(true)
        }
        const dropHandler = (e: DragEvent) => {
            e.preventDefault()
            const item = e.dataTransfer.items[0]
            if (item.kind === 'file' && item.type.match(/image/g)) {
                onSelectFile(formatFileObject(item.getAsFile()))
            }
            else {
                setIsDraggingOver(false)
                addNotification({
                    clearPrevious: true,
                    notification: {
                        level: 'error',
                        title: 'Invalid type of file',
                        message: 'Please, select a file of image type',
                        autoDismiss: 10
                    }
                })
            }
        }

        window.addEventListener("dragover", dragOverHandler);
        window.addEventListener("drop", dropHandler);
        window.addEventListener('dragleave', dragLeaveHandler)
        window.addEventListener('dragenter', dragEnterHandler)

        return () => {
            window.removeEventListener("dragover", dragOverHandler);
            window.removeEventListener("drop", dropHandler);
            window.removeEventListener("dragLeave", dragLeaveHandler);
            window.removeEventListener('dragenter', dragEnterHandler)
        }
    }, [])

    return (
        <IconWrapper
            className={isDraggingOver ? 'drag-over' : ''}
            onClick={async (e) => {
                e.persist()

                try {
                    const file = await selectFileFromExplorer()
                    if (file && file.type.match(/image/g)) {
                        onSelectFile(formatFileObject(file))
                    }
                    else {
                        addNotification({
                            clearPrevious: true,
                            notification: {
                                level: 'error',
                                title: 'Invalid type of file',
                                message: 'Please, select a file of image type',
                                autoDismiss: 10
                            }
                        })
                    }
                }
                catch (e) {
                    console.error(e)
                }
            }} >
            <TopText>
                {isDraggingOver ? 'Drop to upload' : 'Click to upload'}
            </TopText>
            <StyledIcon icon='cloud-upload-alt' />
        </IconWrapper>
    )
}