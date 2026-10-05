import {pluginConfigData} from "@/index";
import {MemosApiServiceV1} from "./v1/index"
import {MemosApiServiceV2} from "./v2/index"
import {IResGetMemos} from "@/types/memos";
import {API_VERSION} from "@/constants/memos";


export class MemosServer {

    /**
     * 检查授权码
     */
    static async checkAccessToken(): Promise<boolean> {
        const version = pluginConfigData.base.version;

        if (API_VERSION.V1.includes(version)) {
            return await MemosApiServiceV1.checkAccessToken();
        } else {
            return await MemosApiServiceV2.checkAccessToken();
        }
    }

    /**
     * 获取用户信息
     */
    static async getUserData() {
        const version = pluginConfigData.base.version;

        if (API_VERSION.V1.includes(version)) {
            return { name: "" };
        } else {
            return await MemosApiServiceV2.getUserData();
        }
    }

    /**
     * 检查是否存在可同步的数据
     */
    static async checkNew(): Promise<boolean> {
        const version = pluginConfigData.base.version;

        if (API_VERSION.V1.includes(version)) {
            return await MemosApiServiceV1.checkNew();
        } else {
            return await MemosApiServiceV2.checkNew();
        }
    }

    /**
     * 拉取 Memos 数据
     */
    static async getMemos() : Promise<IResGetMemos> {
        const version = pluginConfigData.base.version;

        if (API_VERSION.V1.includes(version)) {
            return await MemosApiServiceV1.getMemos();
        } else {
            return await MemosApiServiceV2.getMemos();
        }
    }
}
