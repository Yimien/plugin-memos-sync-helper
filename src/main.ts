import {pushErrMsg, pushMsg} from "@/controllers/siyuan/api";

import {pluginConfigData, STORAGE_NAME} from "@/index";

import {debugMessage} from "@/utils";

import {MemosServer} from "@/controllers/memos";
import {Sync} from "@/controllers/plugin/sync";
import {PluginServer} from "@/controllers/plugin";
import {PlugConfig} from "@/controllers/plugin/config";


export async function checkConfig() {
    debugMessage(pluginConfigData.debug.isDebug, "检查插件配置", "", true);

    const result: boolean = await PlugConfig.check();

    if (!result) {
        await pushErrMsg("请检查插件配置是否正确！");
    }

    debugMessage(pluginConfigData.debug.isDebug, "校验完成", "", true);

    return result;
}

/**
 * 校验授权码
 */
export async function checkAccessToken() {
    debugMessage(pluginConfigData.debug.isDebug, "校验授权", "", true);

    let result = await MemosServer.checkAccessToken();
    if (result) {
        await pushMsg("校验通过");
    } else {
        await pushErrMsg("校验失败，请检查服务器地址和授权码是否配置正确");
    }

    debugMessage(pluginConfigData.debug.isDebug, "校验完成", "", true);
}

/**
 * 检查是否存在可更新的数据
 */
export async function checkNew() {
    debugMessage(pluginConfigData.debug.isDebug, "检查是否存在可更新的数据", "", true);

    const checkResult = await PlugConfig.check();

    if (!checkResult) {
        return;
    }

    let result = await MemosServer.checkNew();
    if (result) {
        Sync.canSync();
        await pushMsg("检查到可同步的 Memos 数据，请手动同步");
    }

    debugMessage(pluginConfigData.debug.isDebug, "检查完成", "", true);
}

/**
 * 测试功能
 */
export async function test() {
    debugMessage(pluginConfigData.debug.isDebug, "开始测试", "", true);

    await PluginServer.run();

    debugMessage(pluginConfigData.debug.isDebug, "测试结束", "", true);
}


export async function main() {
    try {
        // 防抖处理
        if (Sync.isSyncing()) {
            await pushMsg("同步中，请稍候");
            return;
        } else {
            await pushMsg("开始同步……");
            Sync.startSync();
        }

        // 检查配置项
        const checkResult = await checkConfig();
        if (!checkResult) {
            return;
        }

        // 同步
        await PluginServer.run();

        Sync.syncSuccess();
        await pushMsg("同步成功");
    } catch (error) {
        Sync.syncError();
        await pushErrMsg(`${STORAGE_NAME}：${error}`);
    } finally {

    }
}