import {IItemCondition} from "@/types/controllers/plugin";
import {SyncPlanKey, VersionKey} from "@/configs/components/select";
import {isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";

export class PlugConfig {
    /**
     * 检查插件配置是否正确
     */
    static async check(){
        const items = [
            pluginConfigData.base.version,
            pluginConfigData.base.host,
            pluginConfigData.base.token,
            pluginConfigData.base.syncPlan,
            pluginConfigData.base.notebook,
            pluginConfigData.base.lastSyncTime,

            pluginConfigData.advanced.isLinks,
            pluginConfigData.advanced.isLabelTop,
            pluginConfigData.advanced.quoteHandle,
            pluginConfigData.advanced.resourceDownload,
            pluginConfigData.advanced.isImproveVideoStyle,
            pluginConfigData.advanced.isHref,
            pluginConfigData.advanced.imageBlockLayout,

            pluginConfigData.debug.isDebug,
            pluginConfigData.debug.isAutoUpdateTime
        ]

        const itemsConditions: IItemCondition[] = [
            {
                flag: pluginConfigData.base.syncPlan === SyncPlanKey.oneDoc,
                value: pluginConfigData.base.docPath
            },
            {
                flag: !(isEmptyValue(pluginConfigData.advanced.isLabelTop)),
                value: pluginConfigData.advanced.labelName
            },
            {
                flag: !(isEmptyValue(pluginConfigData.advanced.isImproveVideoStyle)),
                value: pluginConfigData.advanced.videoFormats
            },
            {
                flag: pluginConfigData.base.version === VersionKey.v1,
                value: pluginConfigData.special.labelMatch
            }
        ]

        for (const item of items) {
            if (isEmptyValue(item)) {
                return false;
            }
        }

        for (const flag in itemsConditions){
            if (flag && (isEmptyValue(items[flag]))) {
                return false;
            }
        }

        return true;
    }
}