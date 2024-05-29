import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {MemosApiService as V2} from "./v2/index"
import {IResGetMemos} from "@/types/memos";


export class MemosServer {

    /**
     * 检查授权码
     */
    static async checkAccessToken(): Promise<boolean> {
        let result: boolean = false;

        const version = pluginConfigData.base.version;

        if (version === versionKey.v1) {
            // todo v1
        } else if (version === versionKey.v2) {
            result = await V2.checkAccessToken();
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
            // todo v1
        } else if (version === versionKey.v2) {
            result = await V2.checkNew();
        }
        return result;
    }

    /**
     * 拉取 Memos 数据
     */
    static async getMemos() {
        let result: IResGetMemos;

        const version = pluginConfigData.base.version;

        if (version === versionKey.v1) {
            // todo v1
        } else if (version === versionKey.v2) {
            result = await V2.getMemos();
        }
        return result;
    }
}
