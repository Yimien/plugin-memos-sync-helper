import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {MemosService as ServiceV2} from "./v2/index"
import {IResGetMemos} from "@/types/memos";
import {debugMessage} from "@/utils";


export class MemosServer {

    /**
     * 检查授权码
     */
    static async checkAccessToken(): Promise<boolean> {
        const version = pluginConfigData.base.version;
        let result: boolean = false;

        if (version === versionKey.v1) {
            // TODO V1
        } else if (version === versionKey.v2) {
            const memosService = new ServiceV2();
            result = await memosService.checkAccessToken();
        }
        return result;
    }

    /**
     * 检查是否存在可同步的数据
     */
    static async checkNew(): Promise<boolean> {
        const version = pluginConfigData.base.version;
        let result: boolean = false;

        if (version === versionKey.v1) {
            // TODO V1
        } else if (version === versionKey.v2) {
            const memosService = new ServiceV2();
            result = await memosService.checkNew();
        }
        return result;
    }

    static async getMemos() {
        debugMessage(pluginConfigData.debug.isDebug, "数据拉取", "", true);

        const version = pluginConfigData.base.version;
        let result: IResGetMemos;

        if (version === versionKey.v1) {
            // TODO V1
        } else if (version === versionKey.v2) {
            const memosService = new ServiceV2();
            result = await memosService.getMemos();
        }

        debugMessage(pluginConfigData.debug.isDebug, "数据拉取完成", "", true);

        return result;
    }
}
