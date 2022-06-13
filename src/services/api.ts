import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class API {
    private static _axiosInstance: AxiosInstance | null = null;

    static initializeAxios(baseUrl: string = '') {
        this._axiosInstance = axios.create({
            baseURL: baseUrl,
            timeout: 60000
        });
    }

    static get<T>(path: string, params: any = {}, headers: any = {}) {

        if (this._axiosInstance == null) {
            return Promise.reject("Axios instance is not initialized");
        }

        const onSuccess = (response: AxiosResponse<T>) => {
            return response.data;
        }

        const onError = (error: any) => {
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Data:', error.response.data);

            } else {
                console.log('Error Message:', error.message);
            }

            return Promise.reject(error.response || error.message);
        }

        return this._axiosInstance.get<T>(path, {
            params,
            headers
        })
            .then(onSuccess)
            .catch(onError);
    }

    static post<T>(path: string, data: any = {}, headers?: any, params?: any) {

        if (this._axiosInstance == null) {
            return Promise.reject("Axios instance is not initialized");
        }

        const onSuccess = (response: AxiosResponse<T>) => {
            return Promise.resolve(response);
        }

        const onError = (error: any) => {
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Data:', error.response.data);
            } else {
                console.log('Error Message:', error.message);
            }

            return Promise.reject(error.response || error.message);
        }

        return this._axiosInstance.post<T>(path, data, {
            headers,
            params
        })
            .then(onSuccess)
            .catch(onError);
    }
}