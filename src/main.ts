import {STORAGE_NAME} from "@/constants";
import {sync_status} from "@/constants/main";
import {ICONS} from "@/constants/assets/icons";
import {syncPlanKey} from "@/constants/components/select";
import {IItemCondition} from "@/types/plugin";
import {lsNotebooks, pushErrMsg, pushMsg} from "@/controllers/siyuan/api";
import {MemosServer} from "@/controllers/memos";
import {PluginServer} from "@/controllers/plugin";
import {debugMessage, isEmptyValue} from "@/utils";
import {isMobile, pluginConfigData, topBarElement} from "@/index";


class PlugConfig {
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
            pluginConfigData.base.memosSort,

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
                flag: pluginConfigData.base.syncPlan === syncPlanKey.sameDoc,
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
        for (const itemsCondition of itemsConditions) {
            if (itemsCondition.flag && isEmptyValue(itemsCondition.value)) {
                return false;
            }
        }

        // 判断同步笔记本是否存在
        let notebooks = await lsNotebooks();
        let notebookIdList: string[] = notebooks.notebooks.map(notebook => notebook.id);
        return notebookIdList.includes(pluginConfigData.base.notebook);
    }
}


class Sync {
    private static status: string | number;
    private static iconBefore: string;

    /**
     * 开始同步
     */
    static startSync() {
        Sync.status = sync_status.downloading;
        Sync.backupIcon();
        Sync.updateIcon();
    }

    /**
     * 同步出错
     */
    static syncError() {
        Sync.status = sync_status.completed;
        Sync.recoveryIcon();
    }

    /**
     * 同步成功
     */
    static syncSuccess() {
        Sync.status = sync_status.completed;
        Sync.updateIcon();

        // todo 修改上次同步时间
    }

    /**
     * 可以同步
     */
    static canSync() {
        Sync.status = sync_status.waiting;
        Sync.updateIcon();
    }

    /**
     * 是否在同步数据
     */
    static isSyncing() {
        return Sync.status === sync_status.downloading;
    }

    /**
     * 更新图标
     * @private
     */
    private static updateIcon() {
        let svg: any;

        if (Sync.status === sync_status.waiting) {
            svg = ICONS.syncing.svg;
        } else if (Sync.status === sync_status.downloading) {
            svg = ICONS.download.svg;
        } else if (Sync.status === sync_status.completed) {
            svg = ICONS.memos.svg;
        }

        if (isMobile) {
            svg += '<span class="b3-menu__label">Memos 同步助手</span>'
        }

        topBarElement.innerHTML = svg;
    }

    /**
     * 备份图标
     * @private
     */
    private static backupIcon() {
        Sync.iconBefore = topBarElement.innerHTML;
    }

    /**
     * 恢复图标
     * @private
     */
    private static recoveryIcon() {
        if (!isEmptyValue(Sync.iconBefore)) {
            topBarElement.innerHTML = Sync.iconBefore;
        }
    }
}


/**
 * 检查插件配置
 */
export async function checkConfig() {
    debugMessage(pluginConfigData.debug.isDebug, "正在检查插件配置...");

    const result: boolean = await PlugConfig.check();

    if (!result) {
        await pushErrMsg("请检查插件配置是否正确！");
    }

    debugMessage(pluginConfigData.debug.isDebug, "检查完成");

    return result;
}

/**
 * 校验授权码
 */
export async function checkAccessToken() {
    debugMessage(pluginConfigData.debug.isDebug, "正在校验授权码...");

    let result = await MemosServer.checkAccessToken();
    if (result) {
        await pushMsg("校验通过");
    } else {
        await pushErrMsg("校验失败，请检查服务器地址和授权码是否配置正确");
    }

    debugMessage(pluginConfigData.debug.isDebug, "校验完成");
}

/**
 * 检查是否存在可更新的数据
 */
export async function checkNew() {
    debugMessage(pluginConfigData.debug.isDebug, "正在检查是否存在可同步的新数据...");

    const checkResult = await PlugConfig.check();

    if (!checkResult) {
        return;
    }

    let result = await MemosServer.checkNew();
    if (result) {
        Sync.canSync();
        await pushMsg("检查到可同步的 Memos 数据，请手动同步");
    }

    debugMessage(pluginConfigData.debug.isDebug, "检查完成");
}

/**
 * 测试功能
 */
export async function test() {
    debugMessage(pluginConfigData.debug.isDebug, "开始测试", "", true);

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
        throw new Error(error);
    } finally {

    }
}