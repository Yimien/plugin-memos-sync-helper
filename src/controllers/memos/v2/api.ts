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


// **************************************** UserService / AuthService ****************************************


/**
 * 获取当前登录用户信息（适用于 Memos v0.24 ~ v0.31+，不需要管理员权限）
 */
export async function GetAuthUser() {
    return await Requests.send(METHOD.GET, '/api/v1/auth/me');
}

/**
 * 获取认证状态（适用于 Memos v0.22 ~ v0.24，该端点为 POST 方法）
 */
export async function GetAuthStatus() {
    return await Requests.send(METHOD.POST, '/api/v1/auth/status');
}

/**
 * 获取当前会话用户（适用于 Memos v0.25.x 的会话模型）
 */
export async function GetCurrentSession() {
    return await Requests.send(METHOD.GET, '/api/v1/auth/sessions/current');
}

/**
 * 获取当前用户信息备用端点
 */
export async function GetUserMe() {
    return await Requests.send(METHOD.GET, '/api/v1/users/me');
}

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
 * 列出带有分页和过滤器的备忘录
 * @param pageSize - 返回的最大条数
 * @param pageToken - 检索后续页面的令牌
 * @param filter - 过滤器
 * @param view - 显示所有参数
 * @constructor
 */
export async function ListMemos(pageSize?: number, pageToken?: string, filter?: any, view?: string): Promise<IResListMemos> {
    return await Requests.send(METHOD.GET, '/api/v1/memos', {
        pageSize: pageSize,
        pageToken: pageToken,
        filter: changeFilter(filter),
        view: view
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
