import { getApiSource, setApiSource } from '../../stores/configStore.mjs'
import { getInfoWithOpts } from '../../services/ipService.mjs'

export const apiSourceHandlers = {
    getApiSource,
    testApiSource: async (_, apiSource) => await getInfoWithOpts({ apiSource }),
    saveApiSource: (_, api) => setApiSource(api)
}
