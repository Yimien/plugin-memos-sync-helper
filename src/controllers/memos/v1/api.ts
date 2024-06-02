import {Requests} from "@/utils/requests";
import {METHOD} from "@/constants/utils/request";
import {IParamGetMemosWithFilters} from "@/types/memos/v1/api";
import {IMemoV1} from "@/types/memos/v1";


/**
 * 获取当前用户信息
 * @constructor
 */
export async function GetCurrentUser() {
    return await Requests.send(METHOD.GET, "/api/v1/user/me");
}

/**
 * 获取Memos，可选过滤
 * @param data
 * @constructor
 */
export async function GetMemosWithFilters(data?: IParamGetMemosWithFilters) : Promise<IMemoV1[]> {
    return await Requests.send(METHOD.GET, "/api/v1/memo", data);
}

export async function downloadResourceByUid(uid: string | number) {
    return await Requests.get(`/o/r/${uid}`);
}