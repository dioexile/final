import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (email, password, username) => {
    const {data} = await $host.post('api/user/registration', {email, password, username})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const signIn = async (email, password) => {
    const {data} = await $host.post('api/user/signIn', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const fetchOneUser = async (id) => {
    const {data} = await $host.get('api/user/' + id)
    return data
}
export const fetchComments = async (id) => {
    const {data} = await $host.get('api/comment/getAll/' + id)
    return data
}
// export const fetchOneUser2 = async (id) => {
//     const {data} = await $host.get('api/user/', {id})
//     return data
// }
export const uploadAvatar = async (id, formData) => {
    const {data} = await $authHost.post('api/user/avatar/'+ id, formData)  
    return data
}
export const deleteAvatar = async (id) => {
    const {data} = await $authHost.delete('api/user/avatar/'+ id)  
    return data
}

