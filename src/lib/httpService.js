import axios from 'axios';
import { BASE_URL } from  './url'
import { toast } from 'react-toastify';

export const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
    }
})


instance.interceptors.request.use(function(config){
    return{
        ...config,
        headers: {
            authorization: localStorage.getItem('token')
        }
    }
})

const responseBody = (response) => response.data;

const error = (error) => {
    if(error?.response?.status === 401){
        localStorage.removeItem("token");
        localStorage.removeItem("user");;
        
        return toast.error('session expired, unauthourized!, please login again to continue')
    }

    if(error?.response){
        // do nothing 
    }

    if(error?.request){
        return {status: false, message: 'some error occured, please try again'};
    }else{
        return {status: false, message: 'some error occured, please try again'};
    }
}

const requests = {
    get: (url, body, headers) => 
        instance.get(url, body, headers).then(responseBody).catch(error),
    post:  (url, body, headers) => 
        instance.post(url, body, headers).then(responseBody).catch(error),
    put:  (url, body, headers) => 
        instance.put(url, body, headers).then(responseBody).catch(error),
    patch:  (url, body) => 
        instance.patch(url, body).then(responseBody).catch(error),
    delete:  (url) => 
        instance.delete(url).then(responseBody).catch(error),
    download:  (url, headers) => 
        instance.get(url, {responseType : 'blob'}, headers).then(responseBody).catch(error),
}

export default requests;