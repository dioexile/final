import {$authHost, $host} from "./index";

export const createSellOffer = async (project, wallet, price, shortDescription, fullDescription) => {
    const {data} = await $authHost.post('api/purchase-offer/create', {project, wallet, price, shortDescription, fullDescription})
    return data
}

export const fetchSellOffers = async (project, wallet, price, shortDescription, fullDescription) => {
    const {data} = await $host.post('api/purchase-offer/get', {project, wallet, price, shortDescription, fullDescription})
    return data
}
export const fetchOneSellOffer = async (id) => {
    const {data} = await $host.get('api/purchase-offer/' + id)
    return data
}

