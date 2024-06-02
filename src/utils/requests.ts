import {METHOD, STATUS} from '@/constants/utils/request'
import {isEmptyValue} from '@/utils/index'
import {UA} from "@/utils/misc/user-agent";
import {pluginConfigData} from "@/index";


export class Requests {

    /**
     * 移除请求参数的空值
     * @param obj - 原请求参数
     */
    private static async removeEmptyValues(obj: any) {
        for (let key in obj) {
            if (isEmptyValue(obj[key])) {
                delete obj[key];
            }
        }
    }


    // **************************************** export ****************************************


    /**
     * 生成请求地址
     * @param pathName
     */
    static getUrl(pathName: string) {
        return `${pluginConfigData.base.host}${pathName}`;
    }

    /**
     * 生成信息头
     */
    static getHeaders() {
        return new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': UA.ua,
            'Authorization': `Bearer ${pluginConfigData.base.token}`
        });
    }

    /**
     * 发送 GET 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async get(pathName: string, data?: any) {
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        let url: URL = new URL(this.getUrl(pathName));
        url.search = new URLSearchParams(data).toString();

        // 发送请求
        return await fetch(url, {
            method: METHOD.GET,
            headers: this.getHeaders()
        });
    }

    /**
     * 发送 POST 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async post(pathName: string, data: any){
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        let url = this.getUrl(pathName);

        // 发送请求
        return await fetch(url, {
            method: METHOD.POST,
            body: data,
            headers: this.getHeaders()
        });
    }

    /**
     * 发送 PUT 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async put(pathName: string, data: any) {
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        let url = this.getUrl(pathName);

        // 发送请求
        return await fetch(url, {
            method: METHOD.PUT,
            body: data,
            headers: this.getHeaders()
        });
    }

    /**
     * 发送 DELETE 请求
     * @param pathName - 请求地址
     * @param data - 请求参数
     */
    static async delete(pathName: string, data: any){
        // 净化请求参数
        await this.removeEmptyValues(data);

        // 生成请求地址
        let url: URL = new URL(this.getUrl(pathName));
        url.search = new URLSearchParams(data).toString();

        // 发送请求
        return await fetch(url, {
            method: METHOD.DELETE,
            headers: this.getHeaders()
        });
    }

    /**
     * 发送请求
     * @param method - 请求方法
     * @param pathName - 请求路径
     * @param data - 请求参数
     */
    static async send(method: string, pathName: string, data?: any) {
        let response = null;
        if (method === METHOD.GET) {
            response = await this.get(pathName, data);
        } else if (method === METHOD.POST) {
            response = await this.post(pathName, data);
        } else if (method === METHOD.PUT) {
            response = await this.put(pathName, data);
        } else if (method === METHOD.DELETE) {
            response = await this.delete(pathName, data);
        }

        return (response !== null && response.status === STATUS.OK) ? await response.json() : null;
    }
}
