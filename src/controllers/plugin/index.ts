import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {PluginSync as V2} from "@/controllers/plugin/v2";


export class PluginServer {
    static async run() {
        const memosVersion = pluginConfigData.base.version; // memos 版本

        if (memosVersion === versionKey.v1) {
            // todo v1
        } else if (memosVersion === versionKey.v2) {
            await V2.run();
        }
    }
}