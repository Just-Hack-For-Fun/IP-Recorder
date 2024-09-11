const Store = require('electron-store')
const store = new Store()

/**
 * 功能描述：记录获取到的IP信息
 * 参数说明：ipInfo  => { ip: xxxx, location: xxxx }
 * 返回值：无
 * 注意事项：无
 */
const recordIPChange = (ipInfo) => {
  let ipHistory = store.get('ipHistory', [])
  let lastEntry = ipHistory[ipHistory.length - 1]

  const getCurrentTime = () => {
    return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }

  let ip = ipInfo.ip ? ipInfo.ip : '未获取到IP地址'
  let location = ipInfo.location ? ipInfo.location : '未获取到IP归属地'
  
  if (lastEntry && lastEntry.ip === ip) {
    lastEntry.endTime = getCurrentTime() // 更新结束时间
  } else {
    ipHistory.push({
      ip: ip,
      location: location,
      startTime: getCurrentTime(),
      endTime: getCurrentTime()
    })
  }

  store.set('ipHistory', ipHistory)
}

/**
 * 功能描述：查询是否存在历史记录
 * 参数说明：无
 * 返回值：Boolean 返回是否存在历史记录
 * 注意事项：无
 */
const hasHistory = () => store.has('ipHistory')

/**
 * 功能描述：删除历史记录
 * 参数说明：无
 * 返回值：Boolean 返回是否删除成功
 * 注意事项：无
 */
const deleteHistory = () => store.delete('ipHistory')

/**
 * 功能描述：获取已记录的IP信息
 * 参数说明：无
 * 返回值：[] 返回结果数组
   [
      {
        ip: xxx,
        location: xxx,
        startTime: xxx,
        endTime xxx:
      },
      {
        ip: xxx,
        location: xxx,
        startTime: xxx,
        endTime xxx:
      },
   ]
 *   
 * 注意事项：无
 */
const getIpRecord = () => {
  return store.get('ipHistory', [])
}

module.exports = {
  recordIPChange,
  hasHistory,
  deleteHistory,
  getIpRecord
}
