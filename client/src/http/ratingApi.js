import {$authHost, $host} from "./index";

export const createRating = async (uId, rId, rate) => {
    const {data} = await $authHost.post('api/rate/send', {uId, rId, rate})
    return data
}
export const getOneRate = async (uId, rId) => {
    const {data} = await $authHost.get('api/rate/getOne', {uId, rId})
    return data
}