import {$authHost, $host} from "./index";

export const createOffer = async (project, wallet, price, shortDescription, fullDescription) => {
    const {data} = await $authHost.post('api/offer/create', {project, wallet, price, shortDescription, fullDescription})
    return data
}

export const fetchOffers = async (project, wallet, price, shortDescription, fullDescription) => {
    const {data} = await $host.post('api/offer/get', {project, wallet, price, shortDescription, fullDescription})
    return data
}
export const fetchOneOffer = async (id) => {
    const {data} = await $host.get('api/offer/' + id)
    return data
}
export const editOffer = async (id, project, wallet, price, shortDescription, fullDescription) => {
    const {data} = await $host.post('api/offer/edit', {id, project, wallet, price, shortDescription, fullDescription})
    return data
}
export const deleteOffer = async (id) => {
    await $host.get('api/offer/' + id)
}