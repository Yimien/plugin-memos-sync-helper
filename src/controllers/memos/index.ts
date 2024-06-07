import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {MemosApiServiceV1} from "./v1/index"
import {MemosApiServiceV2} from "./v2/index"
import {IResGetMemos} from "@/types/memos";
import {API_V2_LIST} from "@/constants/memos";


export class MemosServer {

    /**
     * 检查授权码
     */
    static async checkAccessToken(): Promise<boolean> {
        let result: boolean = false;

        const version = pluginConfigData.base.version;

        if (version === versionKey.v1) {
            result = await MemosApiServiceV1.checkAccessToken();
        } else if (API_V2_LIST.includes(version)) {
            result = await MemosApiServiceV2.checkAccessToken();
        }
        return result;
    }

    /**
     * 检查是否存在可同步的数据
     */
    static async checkNew(): Promise<boolean> {
        let result: boolean = false;

        const version = pluginConfigData.base.version;

        if (version === versionKey.v1) {
            result = await MemosApiServiceV1.checkNew();
        } else if (API_V2_LIST.includes(version)) {
            result = await MemosApiServiceV2.checkNew();
        }
        return result;
    }

    /**
     * 拉取 Memos 数据
     */
    static async getMemos() : Promise<IResGetMemos> {
        let result: IResGetMemos;

        const version = pluginConfigData.base.version;

        if (version === versionKey.v1) {
            result = await MemosApiServiceV1.getMemos();
        } else if (API_V2_LIST.includes(version)) {
            result = await MemosApiServiceV2.getMemos();
        }
        return result;
    }
}
