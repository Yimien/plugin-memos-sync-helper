import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {PluginV1} from "@/controllers/plugin/v1";
import {PluginV2} from "@/controllers/plugin/v2";


export class PluginMaster {
    static async runSync() {
        const memosVersion = pluginConfigData.base.version; // memos 版本
        if (memosVersion === versionKey.v1) {
            await PluginV1.run();
        } else if (memosVersion === versionKey.v2) {
            await PluginV2.run();
        }
    }
}