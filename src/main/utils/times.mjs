// 获取当前时间
export const getCurrentTime = () => {
    return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}
