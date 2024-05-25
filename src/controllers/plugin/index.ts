import {pushErrMsg, pushMsg} from "@/api";

import {IConfig} from "@/types/config";
import {IItemCondition} from "@/types/controllers/plugin";

import {pluginConfigData} from "@/index";
import {SyncPlanKey, VersionKey} from "@/configs/components/select";

import {debugMessage, isEmptyValue} from "@/utils";

import {MemosServer} from "@/controllers/memos";
import {PluginSync as PluginV1} from "@/controllers/plugin/v1";
import {PluginSync as PluginV2} from "@/controllers/plugin/v2";


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

    let memosServer = new MemosServer();
    let result = await memosServer.checkAccessToken();
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

    let memosServer = new MemosServer();
    let result = await memosServer.checkNew();
    if (result){
        await pushMsg("检查到可同步的 Memos 数据，请手动同步");
    }

    debugMessage(pluginConfigData.debug.isDebug, "检查完成", "", true);
}

/**
 * 测试功能
 */
export async function test(){
    debugMessage(pluginConfigData.debug.isDebug, "开始测试", "", true);

    let memosServer = new MemosServer();
    await memosServer.getMemos();

    debugMessage(pluginConfigData.debug.isDebug, "测试结束", "", true);
}

export async function main(){
    // 检查配置项
    const checkResult = await checkConfig(pluginConfigData);
    if (!checkResult){
        return;
    }

    const memosVersion = pluginConfigData.general.version; // memos 版本

    if (memosVersion === VersionKey.v1){
        let plugin = new PluginV1();
        await plugin.run();
    }
    else if (memosVersion === VersionKey.v2){
        let plugin = new PluginV2();
        await plugin.run();
    }else {
        await pushErrMsg("请检查 Memos 版本是否配置正确！");
    }
}