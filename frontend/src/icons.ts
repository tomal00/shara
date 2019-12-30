import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faUser, faInfo, faCloudUploadAlt, faImages, faSearch, faPlusSquare
} from '@fortawesome/free-solid-svg-icons'

export default {
    init(): void {
        library.add(faUser, faInfo, faCloudUploadAlt, faImages, faSearch, faPlusSquare)
    }
}