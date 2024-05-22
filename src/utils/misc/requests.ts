import {IResponse} from '@/types/utils/requests'
import {METHOD} from '@/configs/utils'
import {isEmptyValue} from '@/utils'


export class Requests {
    private readonly headers: Headers;

    constructor(headers: Headers) {
        this.headers = headers;
    }

    /**
     * 发送 GET 请求
     * @param url - 请求地址
     * @param data - 请求参数
     */
    async get(url: string, data: any): Promise<IResponse> {
        await this.removeEmptyValues(data);
        let r: URL = new URL(url);
        r.search = new URLSearchParams(data).toString();
        return await this.changeResponse(await fetch(r, {
            method: METHOD.GET,
            headers: this.headers
        }));
    }

    /**
     * 发送 POST 请求
     * @param url - 请求地址
     * @param data - 请求参数
     */
    async post(url: string, data: any): Promise<IResponse> {
        await this.removeEmptyValues(data);
        return await this.changeResponse(await fetch(url, {
            method: METHOD.POST,
            body: data,
            headers: this.headers
        }));
    }

    /**
     * 发送 PUT 请求
     * @param url - 请求地址
     * @param data - 请求参数
     */
    async put(url: string, data: any): Promise<IResponse> {
        await this.removeEmptyValues(data);
        return await this.changeResponse(await fetch(url, {
            method: METHOD.PUT,
            body: data,
            headers: this.headers
        }));
    }

    /**
     * 发送 DELETE 请求
     * @param url - 请求地址
     * @param data - 请求参数
     */
    async delete(url: string, data: any): Promise<IResponse> {
        await this.removeEmptyValues(data);
        let r: URL = new URL(url);
        r.search = new URLSearchParams(data).toString();
        return await this.changeResponse(await fetch(r, {
            method: METHOD.DELETE,
            headers: this.headers
        }));
    }

    /**
     * 转换响应结果
     * @param response - 响应结果
     */
    async changeResponse(response: Response): Promise<IResponse> {
        return {
            code: response.status,
            data: await response.json(),
            all: response
        }
    }

    /**
     * 移除请求参数的空值
     * @param obj - 原请求参数
     */
    async removeEmptyValues(obj: any) {
        for (let key in obj) {
            if (await isEmptyValue(obj[key])) {
                delete obj[key];
            }
        }
    }
}
