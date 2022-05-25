import {$authHost, $host} from "./index";

export const fetchChats = async () => {
    const {data} = await $host.get('api/chat/get')
    return data
}
export const fetchOneChat = async (id) => {
    const {data} = await $host.post('api/chat/getone/' + id)
    return data
}
export const fetchOneChatId = async (userId, offerId) => {
    const {data} = await $host.post('api/chat/getoneid', {userId, offerId})
    return data
}
export const fetchMessages = async (id) => {
    const {data} = await $host.post('api/chat/getmes/' + id)
    return data
}