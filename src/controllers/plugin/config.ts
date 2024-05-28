import {IItemCondition} from "@/types/plugin";
import {syncPlanKey} from "@/constants/components/select";
import {isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";
import {lsNotebooks} from "@/controllers/siyuan/api";

export class PlugConfig {
    /**
     * 检查插件配置是否正确
     */
    static async check() {

        const items = [
            pluginConfigData.base.version,
            pluginConfigData.base.host,
            pluginConfigData.base.token,
            pluginConfigData.base.syncPlan,
            pluginConfigData.base.notebook,

            pluginConfigData.advanced.isHandleBacklinks,
            pluginConfigData.advanced.isSuperLabel,
            pluginConfigData.advanced.isHandleVideo,
            pluginConfigData.advanced.isHandleHref,

            pluginConfigData.filter.lastSyncTime,

            pluginConfigData.debug.isDebug,
            pluginConfigData.debug.isAutoUpdateTime
        ]

        const itemsConditions: IItemCondition[] = [
            {
                flag: pluginConfigData.base.syncPlan === syncPlanKey.oneDoc,
                value: pluginConfigData.base.docPath
            },
            {
                flag: !(isEmptyValue(pluginConfigData.advanced.isSuperLabel)),
                value: pluginConfigData.advanced.labelName
            },
            {
                flag: !(isEmptyValue(pluginConfigData.advanced.isHandleVideo)),
                value: pluginConfigData.advanced.videoFormats
            }
        ]

        // 判断必填项是否存在
        for (const item of items) {
            if (isEmptyValue(item)) {
                return false;
            }
        }

        // 判断某种条件的必填项是否存在
        for (const flag in itemsConditions) {
            if (flag && (isEmptyValue(items[flag]))) {
                return false;
            }
        }

        // 判断同步笔记本是否存在
        let notebooks = await lsNotebooks();
        let notebookIdList: string[] = notebooks.notebooks.map(notebook => notebook.id);
        return notebookIdList.includes(pluginConfigData.base.notebook);
    }
}