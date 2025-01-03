// 标准 return

export const response = {
    success(data = null, message = 'success') {
        return {
            code: 0,
            data,
            message
        }
    },
    error(error) {
        return {
            code: -1,
            data: null,
            message: error instanceof Error ? error.message : String(error)
        }
    }
}
