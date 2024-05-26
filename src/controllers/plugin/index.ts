import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {PluginSync as PluginV1} from "@/controllers/plugin/v1";
import {PluginSync as PluginV2} from "@/controllers/plugin/v2";
import {pushErrMsg} from "@/controllers/siyuan/api";

export class PluginServer {
    static async run() {
        const memosVersion = pluginConfigData.base.version; // memos 版本

        if (memosVersion === versionKey.v1) {
            let plugin = new PluginV1();
            await plugin.run();
        } else if (memosVersion === versionKey.v2) {
            let plugin = new PluginV2();
            await plugin.run();
        } else {
            await pushErrMsg("请检查 Memos 版本是否配置正确！");
        }
    }
}