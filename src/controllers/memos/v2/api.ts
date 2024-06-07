import {METHOD} from "@/constants/utils/request";
import {isEmptyValue} from "@/utils";
import {Requests} from "@/utils/requests";
import {IResListMemos} from "@/types/memos/v2/api";


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
    return await Requests.send(METHOD.GET, '/api/v1/users');
}


// **************************************** MemoService ****************************************


/**
 * 获取用户的当前身份验证信息
 * @constructor
 */
export async function GetAuthStatus() {
    return await Requests.send(METHOD.POST, "/api/v1/auth/status");
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
    return await Requests.send(METHOD.GET, '/api/v1/memos', {
        pageSize: pageSize,
        pageToken: pageToken,
        filter: changeFilter(filter)
    });
}


// **************************************** ResourceService ****************************************


/**
 * 按名称返回资源二进制文件
 * @param name
 * @param filename
 * @constructor /file/resources/35
 */
export async function GetResourceBinary(name: string, filename: string) {
    return await Requests.get(`/file/${name}/${filename}`);
}

export async function DownloadResourceByName(name: string) {
    return await Requests.get(`/file/${name}`);
}

export async function GetMemo(id: string | number) {
    return await Requests.send(METHOD.GET, `/api/v1/memos/${id}`);
}