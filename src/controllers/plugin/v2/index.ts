import {putFile} from "@/controllers/siyuan/api";
import {IResGetMemos} from "@/types/memos";
import {DataHandleV2} from "@/controllers/plugin/v2/data-handle";
import {debugMessage, isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";
import {IResourceV2} from "@/types/memos/v2";
import {IResDataHandleRunV2} from "@/types/plugin/v2/handle";
import {MemosApiServiceV2} from "@/controllers/memos/v2";
import {DataSaveV2} from "@/controllers/plugin/v2/data-save";


export class PluginV2 {
    /**
     * 下载资源
     * @param resources
     */
    static async downloadResources(resources: IResourceV2[]) {
        for (let resource of resources) {
            let response = await MemosApiServiceV2.downloadResource(resource);
            debugMessage(pluginConfigData.debug.isDebug, "响应结果", response);
            if (isEmptyValue(response)) {
                continue;
            }
            let fileBlob = await response.blob();
            let path = `data/${DataHandleV2.getResourcePathString(resource)}`;
            await putFile(path, false, fileBlob);
        }
    }


    static async run() {
        // 数据拉取
        debugMessage(pluginConfigData.debug.isDebug, "数据拉取", "", true);

        let allMemos: IResGetMemos = await MemosApiServiceV2.getMemos();

        debugMessage(pluginConfigData.debug.isDebug, "数据拉取完成", "", true);

        // 数据处理
        debugMessage(pluginConfigData.debug.isDebug, "数据处理", "", true);

        let resHandleData : IResDataHandleRunV2 = await DataHandleV2.run(allMemos);

        debugMessage(pluginConfigData.debug.isDebug, "数据处理完成", "", true);

        // 资源下载
        debugMessage(pluginConfigData.debug.isDebug, "资源下载", "", true);

        await this.downloadResources(resHandleData.resources);

        debugMessage(pluginConfigData.debug.isDebug, "资源下载完成", "", true);

        // 数据保存
        debugMessage(pluginConfigData.debug.isDebug, "数据同步", "", true);

        await DataSaveV2.run(resHandleData);

        debugMessage(pluginConfigData.debug.isDebug, "数据同步完成", "", true);
    }
}