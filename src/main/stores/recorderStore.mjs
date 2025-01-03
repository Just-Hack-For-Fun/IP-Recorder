// src/main/store/config.js
import { response } from '../utils/response.mjs'
import { getCurrentTime } from '../utils/times.mjs'
import Store from 'electron-store'

const store = new Store({
    encryptionKey: 'ip-recorder-secret',
    name: 'records',
    defaults: {
        records: [] // { startTime, endTime, ip, location }
    }
})

const STORE_CONFIG = {
    encryptionKey: 'ip-recorder-secret',
    name: 'records',
    defaults: {
        records: []
    }
}

const RECORDS_KEY = 'records'

class RecordStore {
    constructor() {
        this.store = new Store(STORE_CONFIG)
    }

    // 是否存在历史记录
    hasHistory = () => {
        const records = this.store.get(RECORDS_KEY, [])

        // !! 可以将后面跟的值转为 Boolean
        return response.success(!!records.length)
    }
    /**
     * 功能描述： 向 store 中添加IP记录
     * @param { ip, location } 组成的对象
     */
    addRecord = ({ ip, location = '' }) => {
        try {
            if (!ip) {
                return response.error('IP 地址不能为空')
            }

            const records = this.store.get(RECORDS_KEY, [])
            const currentTime = getCurrentTime()
            const lastRecord = records[records.length - 1]

            if (lastRecord?.ip === ip) {
                lastRecord.endTime = currentTime
            } else {
                records.push({
                    ip,
                    location,
                    startTime: currentTime,
                    endTime: currentTime
                })
            }

            this.store.set(RECORDS_KEY, records)
            return response.success()
        } catch (error) {
            console.error('添加记录失败:', error)
            return response.error('添加记录失败')
        }
    }

    // 重置记录
    resetRecord = () => {
        try {
            this.store.set(RECORDS_KEY, [])
            return response.success()
        } catch (error) {
            console.error('重置记录失败:', error)
            return response.error('重置记录失败')
        }
    }

    // 获取所有记录
    getRecord = () => {
        try {
            return response.success(this.store.get(RECORDS_KEY, []))
        } catch (error) {
            console.error('获取记录失败:', error)
            return response.error('获取记录失败')
        }
    }
}

const recordStore = new RecordStore()

export const { hasHistory, getRecord, addRecord, resetRecord, cleanOldRecords } = recordStore
