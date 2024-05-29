import {MemosServer} from "@/controllers/memos";
import {pushMsg} from "@/controllers/siyuan/api";
import {IResGetMemos} from "@/types/memos";
import {DataHandle} from "@/controllers/plugin/v2/data-handle";
import {debugMessage} from "@/utils";
import {pluginConfigData} from "@/index";
import {IResource} from "@/types/memos/v2";
import {IResRun} from "@/types/memos/v2/handle";
import {syncPlanKey} from "@/constants/components/select";
import {SingleDoc} from "@/controllers/plugin/common/save/single-doc";


export class PluginSync {
    /**
     * 下载资源
     * @param resources
     */
    static async downloadResource(resources: IResource[]) {

    }

    /**
     * 将数据保存进思源
     * @param data
     */
    static async saveToSiYuan(data: IResRun) {
        if (pluginConfigData.base.syncPlan === syncPlanKey.singleDoc) {
            // 一条记录，一份文档
            await SingleDoc.runSync(data);
        } else if (pluginConfigData.base.syncPlan === syncPlanKey.sameDoc) {
            // 所有记录，一份文档

        } else {
            // Daily Notes

        }
    }


    static async run() {
        // 数据拉取
        debugMessage(pluginConfigData.debug.isDebug, "1. 数据拉取", "", true);

        let allMemos: IResGetMemos = await MemosServer.getMemos();

        debugMessage(pluginConfigData.debug.isDebug, "1. 数据拉取完成", "", true);

        // 判断是否有新数据
        if (allMemos.new.length <= 0) {
            await pushMsg("暂无新数据！");
            return;
        }

        // 数据处理
        debugMessage(pluginConfigData.debug.isDebug, "2. 数据处理", "", true);

        let handleResult: IResRun = await DataHandle.run(allMemos);

        debugMessage(pluginConfigData.debug.isDebug, "2. 数据处理完成", "", true);

        // 资源下载
        debugMessage(pluginConfigData.debug.isDebug, "3. 资源下载", "", true);

        await this.downloadResource(handleResult.resources);

        debugMessage(pluginConfigData.debug.isDebug, "3. 资源下载完成", "", true);

        // 数据保存
        debugMessage(pluginConfigData.debug.isDebug, "4. 数据保存", "", true);

        await this.saveToSiYuan(handleResult);

        debugMessage(pluginConfigData.debug.isDebug, "4. 数据保存完成", "", true);
    }
}