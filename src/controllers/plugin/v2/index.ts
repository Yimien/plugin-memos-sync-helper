import {MemosServer} from "@/controllers/memos";
import {pushMsg, putFile} from "@/controllers/siyuan/api";
import {IResGetMemos} from "@/types/memos";
import {DataHandle} from "@/controllers/plugin/v2/data-handle";
import {debugMessage, isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";
import {IResource} from "@/types/memos/v2";
import {IResDataHandleRun} from "@/types/memos/v2/handle";
import {syncPlanKey} from "@/constants/components/select";
import {SingleDoc} from "@/controllers/plugin/v2/data-save/single-doc";
import {SameDoc} from "@/controllers/plugin/v2/data-save/same-doc";
import {MemosApiService} from "@/controllers/memos/v2";
import {DailyNotes} from "@/controllers/plugin/v2/data-save/daily-notes";


export class PluginSync {
    /**
     * 下载资源
     * @param resources
     */
    static async downloadResource(resources: IResource[]) {
        for (let resource of resources) {
            let responseData = await MemosApiService.downloadResource(resource);
            if (isEmptyValue(responseData)) {
                debugMessage(pluginConfigData.debug.isDebug, "下载失败", resource.name);
                continue;
            }
            let path = DataHandle.getResourcePath(resource);
            await putFile(path, false, responseData);
        }
    }

    /**
     * 将数据保存进思源
     * @param data
     */
    static async saveToSiYuan(data: IResDataHandleRun) {
        if (pluginConfigData.base.syncPlan === syncPlanKey.singleDoc) {
            // 一条记录，一份文档
            await SingleDoc.runSync(data);
        } else if (pluginConfigData.base.syncPlan === syncPlanKey.sameDoc) {
            // 所有记录，一份文档
            await SameDoc.runSync(data);
        } else {
            // Daily Notes
            await DailyNotes.runSync(data);
        }
    }


    static async run() {
        // 数据拉取
        debugMessage(pluginConfigData.debug.isDebug, "数据拉取", "", true);

        let allMemos: IResGetMemos = await MemosServer.getMemos();

        debugMessage(pluginConfigData.debug.isDebug, "数据拉取完成", "", true);

        // 判断是否有新数据
        if (allMemos.new.length <= 0) {
            await pushMsg("暂无新数据！");
            return;
        }

        // 数据处理
        debugMessage(pluginConfigData.debug.isDebug, "数据处理", "", true);

        let handleResult: IResDataHandleRun = await DataHandle.run(allMemos);

        debugMessage(pluginConfigData.debug.isDebug, "数据处理完成", "", true);

        // 资源下载
        debugMessage(pluginConfigData.debug.isDebug, "资源下载", "", true);

        // await this.downloadResource(handleResult.resources);

        debugMessage(pluginConfigData.debug.isDebug, "资源下载完成", "", true);

        // 数据保存
        debugMessage(pluginConfigData.debug.isDebug, "数据同步", "", true);

        await this.saveToSiYuan(handleResult);

        debugMessage(pluginConfigData.debug.isDebug, "数据同步完成", "", true);
    }
}