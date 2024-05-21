import {METHOD, STATUS} from "@/constants";
import {isEmptyValue} from "@/utils";
import {Requests} from "@/utils/requests";
import {IResponse} from "@/interface/requests";


async function request(method: string, pathName: string, data: any): Promise<any> {
    const hostName: string = "http://192.168.31.104:15231"
    const accessToken: string = "eyJhbGciOiJIUzI1NiIsImtpZCI6InYxIiwidHlwIjoiSldUIn0.eyJuYW1lIjoidGVzdCIsImlzcyI6Im1lbW9zIiwic3ViIjoiMiIsImF1ZCI6WyJ1c2VyLmFjY2Vzcy10b2tlbiJdLCJpYXQiOjE3MTYxMjYzNzN9.8doJUMsAVFsvEq-88phBc7p0pCbi3xL9wVlkrSvdGn4"

    let headers = new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.76",
        'Authorization': `Bearer ${accessToken}`
    })
    let r = new Requests(headers);
    let url = `${hostName}${pathName}`

    if (method === METHOD.GET) {
        let response: IResponse = await r.get(url, data);
        return response.code === STATUS.OK ? response.data : null;
    } else if (method === METHOD.POST) {
        let response: IResponse = await r.post(url, data);
        return response.code === STATUS.OK ? response.data : null;
    } else if (method === METHOD.PUT) {
        let response: IResponse = await r.put(url, data);
        return response.code === STATUS.OK ? response.data : null;
    } else if (method === METHOD.DELETE) {
        let response: IResponse = await r.delete(url, data);
        return response.code === STATUS.OK ? response.data : null;
    }
}

/**
 * 转换过滤器
 * @param filter - 待处理的过滤器
 */
async function changeFilter(filter: any) {
    return await isEmptyValue(filter) ? null : filter.join(" && ")
}


// **************************************** MemoService ****************************************


/**
 * 列出带有分页和过滤器的备忘录。
 * @param pageSize - 返回的最大条数
 * @param pageToken - 检索后续页面的令牌
 * @param filter - 过滤器
 * @constructor
 */
export async function ListMemos(pageSize?: number, pageToken?: string, filter?: any) {
    return await request(METHOD.GET, '/api/v1/memos', {
        pageSize: pageSize,
        pageToken: pageToken,
        filter: changeFilter(filter)
    })
}