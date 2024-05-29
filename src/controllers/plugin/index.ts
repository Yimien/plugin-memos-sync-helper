import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {PluginSync as V2} from "@/controllers/plugin/v2";
import {DataHandle as DataHandleV2} from "@/controllers/plugin/v2/data-handle";
import {IResHandleMemos} from "@/types/memos/v2/handle";


export class PluginServer {
    /**
     * Memos 排序
     * @param memosList
     * @param asc
     */
    static sortMemos(memosList: IResHandleMemos[], asc=true) {
        const memosVersion = pluginConfigData.base.version; // memos 版本

        if (memosVersion === versionKey.v1) {
            // todo v1
        } else if (memosVersion === versionKey.v2) {
            DataHandleV2.sortMemos(memosList, asc);
        }
    }

    static async run() {
        const memosVersion = pluginConfigData.base.version; // memos 版本

        if (memosVersion === versionKey.v1) {
            // todo v1
        } else if (memosVersion === versionKey.v2) {
            await V2.run();
        }
    }
}