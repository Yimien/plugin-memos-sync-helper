import {pushErrMsg, pushMsg} from "@/api";

import {IConfig} from "@/types/config";
import {IItemCondition} from "@/types/controllers/plugin";

import {pluginConfigData} from "@/index";
import {SyncPlanKey, VersionKey} from "@/configs/components/select";

import {debugMessage, isEmptyValue} from "@/utils";

import {MemosServer} from "@/controllers/memos";
import {Sync} from "@/controllers/plugin/sync";
import {PluginServer} from "@/controllers/plugin";


/**
 * 检查配置必填项是否配置完整
 * @param config - 配置数据
 */
export async function checkConfig(config : IConfig)  {
    debugMessage(pluginConfigData.debug.isDebug, "检查插件配置", "", true);

    const errorTip : string = "请检查插件配置是否正确！";
    let result : boolean = true;

    const items = [
        config.general.version,
        config.general.host,
        config.general.token,
        config.general.syncPlan,
        config.general.notebook,
        config.general.lastSyncTime,

        config.advanced.isLinks,
        config.advanced.isLabelTop,
        config.advanced.quoteHandle,
        config.advanced.resourceDownload,
        config.advanced.isImproveVideoStyle,
        config.advanced.isHref,
        config.advanced.imageBlockLayout,

        config.debug.isDebug,
        config.debug.isAutoUpdateTime
    ]

    const itemsConditions: IItemCondition[] = [
        {
            flag: config.general.syncPlan === SyncPlanKey.oneDoc,
            value: config.general.docPath
        },
        {
            flag: !(isEmptyValue(config.advanced.isLabelTop)),
            value: config.advanced.labelName
        },
        {
            flag: !(isEmptyValue(config.advanced.isImproveVideoStyle)),
            value: config.advanced.videoFormats
        },
        {
            flag: config.general.version === VersionKey.v1,
            value: config.old.labelMatch
        }
    ]

    for (const item of items) {
        if (isEmptyValue(item)){
            await pushErrMsg(errorTip);
            result = false;
            break;
        }
    }

    for (const flag in itemsConditions){
        if (flag && (isEmptyValue(items[flag]))) {
            await pushErrMsg(errorTip);
            result = false;
            break;
        }
    }

    debugMessage(pluginConfigData.debug.isDebug, "检查结果", result);

    debugMessage(pluginConfigData.debug.isDebug, "校验完成", "", true);
    return result;
}

/**
 * 校验授权码
 */
export async function checkAccessToken(){
    debugMessage(pluginConfigData.debug.isDebug, "校验授权", "", true);

    let result = await MemosServer.checkAccessToken();
    if (result){
        await pushMsg("校验通过");
    } else {
        await pushMsg("校验失败，请检查服务器地址和授权码是否配置正确");
    }

    debugMessage(pluginConfigData.debug.isDebug, "校验完成", "", true);
}

/**
 * 检查是否存在可更新的数据
 */
export async function checkNew(){
    debugMessage(pluginConfigData.debug.isDebug, "检查是否存在可更新的数据", "", true);

    // let result = await MemosServer.checkNew();
    let result = true;
    if (result){
        Sync.canSync();
        await pushMsg("检查到可同步的 Memos 数据，请手动同步");
    }

    debugMessage(pluginConfigData.debug.isDebug, "检查完成", "", true);
}

/**
 * 测试功能
 */
export async function test(){
    debugMessage(pluginConfigData.debug.isDebug, "开始测试", "", true);

    await checkNew();

    debugMessage(pluginConfigData.debug.isDebug, "测试结束", "", true);
}


export async function main(){
    try {
        // 防抖处理
        if (Sync.isSyncing()){
            await pushMsg("同步中，请稍候");
        } else {
            await pushMsg("开始同步……");
            Sync.startSync();
        }

        // 检查配置项
        const checkResult = await checkConfig(pluginConfigData);
        if (!checkResult){
            return;
        }



        // 同步
        await PluginServer.run();

    } catch (error) {
        Sync.syncError()
        await pushErrMsg(error);
    } finally {
        Sync.syncSuccess()
        await pushMsg("同步结束");
    }
}