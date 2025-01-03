import {
    setRetryCounts,
    setReqInterval,
    getReqOptions
} from '../../stores/configStore.mjs'
// import { updateCurrentInfo } from '../../services/ipService.mjs'
import { response } from '../../utils/response.mjs'

export const requestOptionsHandlers = {
    getReqOptions,
    saveReqOptions: async (_, options) => {
        const result1 = await setRetryCounts(options.times)
        const result2 = await setReqInterval(options.interval)

        if (result1.code === 0 && result2.code === 0) {
            // updateCurrentInfo()
            return response.success()
        }
        return response.error(result1.message === 'success' ? result2.message : result1.message)
    }
}
