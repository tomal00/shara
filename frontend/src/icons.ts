import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faChevronRight, faBars, faSyncAlt, faLock, faUnlock, faLockOpen, faChevronDown, faUser, faInfo, faCloudUploadAlt, faImages, faSearch, faPlusSquare, faTrashAlt
} from '@fortawesome/free-solid-svg-icons'

export default {
    init(): void {
        library.add(faChevronRight, faBars, faSyncAlt, faLock, faUnlock, faLockOpen, faChevronDown, faUser, faInfo, faCloudUploadAlt, faImages, faSearch, faPlusSquare, faTrashAlt)
    }
}