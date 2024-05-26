import {IResListMemos} from "@/types/memos/v2";
import {IResponse} from "@/types/utils/requests";

import {pluginConfigData} from "@/index";
import {METHOD, STATUS} from "@/constants/utils";
import {UA} from "@/utils/misc/user-agent";

import {debugMessage, isEmptyValue} from "@/utils";
import {Requests} from "@/utils/misc/requests";


async function request(method: string, pathName: string, data?: any): Promise<any> {
    const hostName: string = pluginConfigData.base.host;
    const accessToken: string = pluginConfigData.base.token;

    let headers = new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': UA.ua,
        'Authorization': `Bearer ${accessToken}`
    })
    let r = new Requests(headers);
    let url = `${hostName}${pathName}`;
    let response: IResponse;
    let result: any;

    debugMessage(pluginConfigData.debug.isDebug, "请求地址", url);
    if (!isEmptyValue(data)) {
        debugMessage(pluginConfigData.debug.isDebug, "请求参数", data);
    }

    if (method === METHOD.GET) {
        response = await r.get(url, data);
        result = response.code === STATUS.OK ? response.data : null;
    } else if (method === METHOD.POST) {
        response = await r.post(url, data);
        result = response.code === STATUS.OK ? response.data : null;
    } else if (method === METHOD.PUT) {
        response = await r.put(url, data);
        result = response.code === STATUS.OK ? response.data : null;
    } else if (method === METHOD.DELETE) {
        response = await r.delete(url, data);
        result = response.code === STATUS.OK ? response.data : null;
    }

    debugMessage(pluginConfigData.debug.isDebug, "响应结果", response);
    return result;
}

/**
 * 转换过滤器
 * @param filter - 待处理的过滤器
 */
function changeFilter(filter: any) {
    return isEmptyValue(filter) ? null : filter.join(" && ")
}


// **************************************** UserService ****************************************


/**
 * 列出用户列表
 * 注：需要管理员身份及以上
 * @constructor
 */
export async function ListUsers() {
    return await request(METHOD.GET, '/api/v1/users');
}


// **************************************** MemoService ****************************************


/**
 * 获取用户的当前身份验证信息
 * @constructor
 */
export async function GetAuthStatus() {
    return await request(METHOD.POST, "/api/v1/auth/status");
}


// **************************************** MemoService ****************************************


/**
 * 列出带有分页和过滤器的备忘录
 * @param pageSize - 返回的最大条数
 * @param pageToken - 检索后续页面的令牌
 * @param filter - 过滤器
 * @constructor
 */
export async function ListMemos(pageSize?: number, pageToken?: string, filter?: any): Promise<IResListMemos> {
    return await request(METHOD.GET, '/api/v1/memos', {
        pageSize: pageSize,
        pageToken: pageToken,
        filter: changeFilter(filter)
    });
}