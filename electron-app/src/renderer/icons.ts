import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faSyncAlt,
    faTimes
} from '@fortawesome/free-solid-svg-icons'

export default {
    init(): void {
        library.add(faSyncAlt)
        library.add(faTimes)
    }
}