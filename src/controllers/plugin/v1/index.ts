import {pluginConfigData} from "@/index";
import {putFile} from "@/controllers/siyuan/api";
import {MemosApiServiceV1} from "@/controllers/memos/v1";
import {DataHandleV1} from "@/controllers/plugin/v1/data-handle";
import {IResGetMemos} from "@/types/memos";
import {IResourceV1} from "@/types/memos/v1";
import {IResDataHandleRunV1} from "@/types/plugin/v1/handle";
import {debugMessage, isEmptyValue} from "@/utils";
import {STATUS} from "@/constants/utils/request";
import {DataSaveV1} from "@/controllers/plugin/v1/data-save";


export class PluginV1 {
    /**
     * 下载资源
     * @param resources
     */
    static async downloadResource(resources: IResourceV1[]) {
        for (let resource of resources) {
            if (!isEmptyValue(resource.externalLink)) {
                continue;
            }

            let uid = resource.uid;
            let response = await MemosApiServiceV1.downloadResource(uid);
            if (response.status !== STATUS.OK) {
                debugMessage(pluginConfigData.debug.isDebug, "下载失败", response);
                continue;
            }
            let fileBlob = await response.blob();
            let path = `data/${DataHandleV1.getResourcePathString(resource)}`;
            await putFile(path, false, fileBlob);
        }
    }


    static async run() {
        // 数据拉取
        debugMessage(pluginConfigData.debug.isDebug, "数据拉取", "", true);

        let allMemos: IResGetMemos = await MemosApiServiceV1.getMemos();

        debugMessage(pluginConfigData.debug.isDebug, "数据拉取完成", "", true);

        // 数据处理
        debugMessage(pluginConfigData.debug.isDebug, "数据处理", "", true);

        let handleData: IResDataHandleRunV1 = await DataHandleV1.run(allMemos);

        debugMessage(pluginConfigData.debug.isDebug, "数据处理完成", "", true);

        // 资源下载
        debugMessage(pluginConfigData.debug.isDebug, "资源下载", "", true);

        await this.downloadResource(handleData.resources);

        debugMessage(pluginConfigData.debug.isDebug, "资源下载完成", "", true);

        // 数据保存
        debugMessage(pluginConfigData.debug.isDebug, "数据同步", "", true);

        await DataSaveV1.run(handleData);

        debugMessage(pluginConfigData.debug.isDebug, "数据同步完成", "", true);
    }
}