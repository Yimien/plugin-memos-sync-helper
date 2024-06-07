import {STORAGE_NAME} from "@/constants";
import {sync_status} from "@/constants/main";
import {ICONS} from "@/constants/assets/icons";
import {syncPlanKey} from "@/constants/components/select";
import {IItemCondition} from "@/types/plugin";
import {lsNotebooks, pushErrMsg, pushMsg} from "@/controllers/siyuan/api";
import {MemosServer} from "@/controllers/memos";
import {debugMessage, isEmptyValue} from "@/utils";
import PluginMemosSyncHelper, {isMobile, pluginConfigData, topBarElement} from "@/index";
import {PluginMaster} from "@/controllers/plugin";
import {IConfig} from "@/types/config/default";
import moment from "moment";



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
            pluginConfigData.base.resourceSavePath,
            pluginConfigData.base.memosSort,

            pluginConfigData.advanced.isHandleBacklinks,
            pluginConfigData.advanced.isSuperLabel,
            pluginConfigData.advanced.isHandleVideo,
            pluginConfigData.advanced.isHandleHref,

            pluginConfigData.filter.lastSyncTime,

            pluginConfigData.debug.isDebug
        ]

        const itemsConditions: IItemCondition[] = [
            {
                text: "文档路径",
                flag: pluginConfigData.base.syncPlan === syncPlanKey.sameDoc,
                value: pluginConfigData.base.docPath
            },
            {
                text: "上级标签名称",
                flag: pluginConfigData.advanced.isSuperLabel,
                value: pluginConfigData.advanced.labelName
            },
            {
                text: "需要优化的视频样式",
                flag: pluginConfigData.advanced.isHandleVideo,
                value: pluginConfigData.advanced.videoFormats
            },
            {
                text: "是否允许自动更新上次同步时间",
                flag: pluginConfigData.debug.isDebug,
                value: pluginConfigData.debug.isAutoUpdateTime
            }
        ]

        const stringIsOk =[
            {
                value: pluginConfigData.base.host,
                text: "服务器路径",
                check: [null, false]
            },
            {
                value: pluginConfigData.base.docPath,
                text: "文档路径",
                check: [true, false]
            },
            {
                value: pluginConfigData.base.resourceSavePath,
                text: "资源保存路径",
                check: [false, false]
            },
            {
                value: pluginConfigData.advanced.subjectPath,
                text: "主题路径",
                check: [true, false]
            },
            {
                value: pluginConfigData.advanced.labelName,
                text: "标签名称",
                check: [false, false]
            }
        ]

        // 判断必填项是否存在
        for (const item of items) {
            if (isEmptyValue(item)) {
                debugMessage(pluginConfigData.debug.isDebug, "验证失败", item);
                return false;
            }
        }

        // 判断某种条件的必填项是否存在
        for (const itemsCondition of itemsConditions) {
            if (itemsCondition.flag && isEmptyValue(itemsCondition.value)) {
                debugMessage(pluginConfigData.debug.isDebug, "验证失败", itemsCondition.text);
                return false;
            }
        }

        for (let item of stringIsOk){
            if (item.check[0] !== null) {
                if (item.check[0] === true && item.value.charAt(0) !== '/') {
                    debugMessage(pluginConfigData.debug.isDebug, `${item.text} 应当以'/'开头`);
                    return false;
                }
                if (item.check[0] === false && item.value.charAt(0) === '/') {
                    debugMessage(pluginConfigData.debug.isDebug, `${item.text} 不应以'/'开头`);
                    return false;
                }
            }

            if (item.check[1] !== null) {
                if (item.check[1] === true && item.value.charAt(item.value.length - 1) !== '/') {
                    debugMessage(pluginConfigData.debug.isDebug, `${item.text} 应当以'/'结尾`);
                    return false;
                }
                if (item.check[1] === false && item.value.charAt(item.value.length - 1) === '/') {
                    debugMessage(pluginConfigData.debug.isDebug, `${item.text} 不应以'/'结尾`);
                    return false;
                }
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
            // svg = ICONS.syncing.svg;
            svg = `<svg><use xlink:href="#${ICONS.syncing.name}"></use></svg>`
        } else if (Sync.status === sync_status.downloading) {
            // svg = ICONS.download.svg;
            svg = `<svg><use xlink:href="#${ICONS.download.name}"></use></svg>`;
        } else if (Sync.status === sync_status.completed) {
            // svg = ICONS.memos.svg;
            svg = `<svg><use xlink:href="#${ICONS.memos.name}"></use></svg>`;
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
        debugMessage(pluginConfigData.debug.isDebug, "请检查插件配置！");
        return;
    }

    let result = await MemosServer.checkNew();
    if (result) {
        Sync.canSync();
        await pushMsg("检查到可同步的新数据");
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


export async function main(plugin: InstanceType<typeof PluginMemosSyncHelper>) {
    try {
        // 防抖处理
        if (Sync.isSyncing()) {
            await pushMsg("同步中，请稍候");
            return;
        } else {
            await pushMsg("正在进行同步前检查");
            Sync.startSync();
        }

        // 检查配置项
        const configIsOk = await checkConfig();
        if (!configIsOk) {
            Sync.syncError();
            return;
        }

        const hasNew = await MemosServer.checkNew();
        if (hasNew) {
            // 同步
            await pushMsg("开始同步");
            await PluginMaster.runSync();
            await pushMsg("同步完成！");
        } else {
            await pushMsg("暂无新数据！");
        }

        // 修改上次同步时间
        if (!(pluginConfigData.debug.isDebug && pluginConfigData.debug.isAutoUpdateTime === false)) {
            debugMessage(pluginConfigData.debug.isDebug, "正在修改上次同步时间……");

            let config : IConfig = pluginConfigData;

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    config.filter.lastSyncTime = moment().format("YYYY-MM-DD HH:mm:ss");
                    debugMessage(pluginConfigData.debug.isDebug, "配置", config);
                    resolve(); // 标志 Promise 的状态已经改变
                }, 1000);
            });

            await plugin.updateConfig(config);

            debugMessage(pluginConfigData.debug.isDebug, "上次同步时间修改完成！");
        }

        Sync.syncSuccess();

    } catch (error) {
        Sync.syncError();
        await pushErrMsg(`${STORAGE_NAME}：${error}`);
        throw new Error(error);
    } finally {

    }
}