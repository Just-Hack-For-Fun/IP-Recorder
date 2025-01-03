import { hasHistory, resetRecord } from '../../stores/recorderStore.mjs'
import exportToCSV from '../../utils/exportToCsv.mjs'
import { updateCurrentInfo } from '../../services/ipService.mjs'

export const recordHandlers = {
    hasHistory,
    resetRecord,
    exportRecord: async () => await exportToCSV(),
    updateCurrentInfo
}
