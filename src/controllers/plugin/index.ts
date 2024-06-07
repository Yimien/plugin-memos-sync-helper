import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {PluginV1} from "@/controllers/plugin/v1";
import {PluginV2} from "@/controllers/plugin/v2";
import {API_V2_LIST} from "@/constants/memos";


export class PluginMaster {
    static async runSync() {
        const version = pluginConfigData.base.version; // memos 版本
        if (version === versionKey.v1) {
            await PluginV1.run();
        } else if (API_V2_LIST.includes(version)) {
            await PluginV2.run();
        }
    }
}