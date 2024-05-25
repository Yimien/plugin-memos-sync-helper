import {pluginConfigData} from "@/index";
import {VersionKey} from "@/configs/components/select";
import {MemosService as ServiceV2} from "./v2/index"
import {IResGetMemos} from "@/types/controllers/memos";


export class MemosServer {

    /**
     * 检查授权码
     */
    static async checkAccessToken() : Promise<boolean> {
        const version = pluginConfigData.general.version;
        let result : boolean = false;

        if (version === VersionKey.v1){
            // TODO V1
        } else if (version === VersionKey.v2){
            const memosService = new ServiceV2();
            result = await memosService.checkAccessToken();
        }
        return result;
    }

    /**
     * 检查是否存在可同步的数据
     */
    static async checkNew() : Promise<boolean> {
        const version = pluginConfigData.general.version;
        let result : boolean = false;

        if (version === VersionKey.v1){
            // TODO V1
        } else if (version === VersionKey.v2){
            const memosService = new ServiceV2();
            result = await memosService.checkNew();
        }
        return result;
    }

    static async getMemos() {
        const version = pluginConfigData.general.version;
        let result : IResGetMemos;

        if (version === VersionKey.v1){
            // TODO V1
        } else if (version === VersionKey.v2){
            const memosService = new ServiceV2();
            result = await memosService.getMemos();
        }
        return result;
    }
}
