import {pluginConfigData} from "@/index";
import {PluginV1} from "@/controllers/plugin/v1";
import {PluginV2} from "@/controllers/plugin/v2";
import {API_VERSION} from "@/constants/memos";


export class PluginMaster {
    static async runSync() {
        const version = pluginConfigData.base.version; // memos 版本
        if (API_VERSION.V1.includes(version)) {
            await PluginV1.run();
        } else if (API_VERSION.V2.includes(version)) {
            await PluginV2.run();
        }
    }
}