import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faDownload, faCopy, faChevronRight, faBars, faSyncAlt, faLock, faUnlock, faLockOpen, faChevronDown, faUser, faInfo, faCloudUploadAlt, faImages, faSearch, faPlusSquare, faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import {
    faGithub, faWindows, faLinux
} from '@fortawesome/free-brands-svg-icons'

export default {
    init(): void {
        library.add(faWindows, faLinux, faDownload, faGithub, faCopy, faChevronRight, faBars, faSyncAlt, faLock, faUnlock, faLockOpen, faChevronDown, faUser, faInfo, faCloudUploadAlt, faImages, faSearch, faPlusSquare, faTrashAlt)
    }
}