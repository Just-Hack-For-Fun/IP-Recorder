import { dialog, app } from 'electron'
import fs from 'fs'
import path from 'path'
import { getRecord } from '../stores/recorderStore.mjs'
import { response } from './response.mjs'

async function exportToCSV() {
    const { code, data, message } = getRecord()

    if (code === -1) return response.error(message)
    if (data.length === 0) return response.error('无IP信息记录')

    const records = data

    // 处理CSV字段中的特殊字符
    const escapeCSV = (field) => {
        field = String(field)
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            field = field.replace(/"/g, '""')
            field = `"${field}"`
        }
        return field
    }

    const headers = ['开始时间', '结束时间', 'IP地址', '归属地']

    const csvContent = [
        headers.map(escapeCSV).join(','),
        ...records.map((record) =>
            [
                escapeCSV(record.startTime),
                escapeCSV(record.endTime),
                escapeCSV(record.ip),
                escapeCSV(record.location)
            ].join(',')
        )
    ].join('\n')

    // 添加 BOM，以便 Excel 正确识别中文
    const csvData = '\ufeff' + csvContent

    try {
        // 打开保存文件对话框
        const { filePath } = await dialog.showSaveDialog({
            defaultPath: path.join(
                app.getPath('downloads'),
                `ip_records_${new Date().toISOString().slice(0, 10)}.csv`
            ),
            filters: [{ name: 'CSV Files', extensions: ['csv'] }]
        })

        if (filePath) {
            // 写入文件
            fs.writeFileSync(filePath, csvData, 'utf8')
            return response.success(filePath)
        }
    } catch (error) {
        console.error('Export failed:', error)
        return response.error(`导出失败: ${error}`)
    }
}

export default exportToCSV
