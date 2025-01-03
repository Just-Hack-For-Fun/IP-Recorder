import { getProxy, setProxy } from '../../stores/configStore.mjs'
import { getInfoWithOpts } from '../../services/ipService.mjs'

export const proxyHandlers = {
    getProxy,
    testProxy: async (_, proxy) => await getInfoWithOpts({ proxy }),
    saveProxy: (_, proxy) => setProxy(proxy)
}
