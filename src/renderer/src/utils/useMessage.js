import { createVNode, render } from 'vue'
// import Message from './Message.vue'
import MessageBox from '@components/utils/MessageBox.vue'

const messageInstances = []

export function useMessage() {
    const showMessage = (options) => {
        const container = document.createElement('div')

        // 创建消息实例
        const vnode = createVNode(MessageBox, {
            content: typeof options === 'string' ? options : options.content,
            type: options.type || 'info',
            duration: options.duration || 3000,
            onDestroy: () => {
                render(null, container)
                document.body.removeChild(container)
                const index = messageInstances.indexOf(container)
                if (index !== -1) {
                    messageInstances.splice(index, 1)
                }
            }
        })

        // 渲染消息
        render(vnode, container)
        document.body.appendChild(container)
        messageInstances.push(container)
    }

    return {
        info: (content, duration=700) => showMessage({ content, duration })
    }
}
