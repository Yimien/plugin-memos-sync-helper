import {Dialog, getFrontend, Plugin} from "siyuan";
import "@/index.scss";
import SettingExample from "@/components/setting.svelte";
import {PLUGIN_NAME, STORAGE_NAME} from "@/constants";
import {ICONS} from "@/constants/assets/icons";
import {DEFAULT_CONFIG} from "@/constants/config/default";
import {IConfig} from "@/types/config/default";
import {IOption, IOptions} from "@/types/components/item";
import {lsNotebooks} from "@/controllers/siyuan/api";
import {debugMessage} from "@/utils";
import {Logger} from "@/utils/misc/logger";
import {mergeIgnoreArray} from "@/utils/misc/merge";
import {checkNew, main} from "@/main";


/**
 * 配置数据
 */
export let pluginConfigData: IConfig;

/**
 * 是否是手机端
 */
export let isMobile: boolean;

/**
 * 顶栏图标
 */
export let topBarElement: HTMLElement;


export default class PluginMemosSyncHelper extends Plugin {
    /**
     * 日志
     */
    public readonly logger: InstanceType<typeof Logger>;


    // **************************************** 官方 ****************************************


    constructor(options: any) {
        super(options);
        this.logger = new Logger(this.name);
    }

    /**
     * 思源在初始化的时候会调用该方法。
     */
    async onload() {
        const frontEnd = getFrontend();
        isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        // 批量添加图标
        await this.batchAddIcons(ICONS);

        // 为插件在顶栏添加一个图标
        topBarElement = this.addTopBar({
            icon: ICONS.memos.name,
            title: PLUGIN_NAME,
            position: "right",
            callback: () => {
                main(this);
            }
        });
    }

    async onLayoutReady() {
        // 读取配置数据
        this.loadData(STORAGE_NAME)
            .then(config => {
                pluginConfigData = mergeIgnoreArray(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(async () => {
                await checkNew();
            });

        // console.log("onLayoutReady");
    }

    /**
     * 当插件被禁用的时候，会调用此方法。
     */
    onunload() {
        // console.log("onunload");
    }

    /**
     * 当插件被卸载的时候，会调用此方法。
     */
    uninstall() {
        // console.log("uninstall");
    }

    /**
     * 打开设置页面
     */
    async openSetting() {
        await this.openDIYSetting()
    }


    // **************************************** api ****************************************

    /**
     * 更新插件配置
     * @param config - 配置数据
     */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== config) {
            pluginConfigData = config;
        }
        return this.saveData(STORAGE_NAME, pluginConfigData);
    }


    // **************************************** 自定义 ****************************************

    /**
     * 获取笔记本列表，并转换成下拉选项
     * @private
     */
    private async getNotebookOptions() {
        debugMessage(pluginConfigData.debug.isDebug, "正在获取笔记本列表，并转换成下拉选项...");

        let notebookOptions: IOptions = [];
        const responseData = await lsNotebooks();
        const notebooks = responseData.notebooks;

        for (const notebook of notebooks) {
            let n: IOption = {
                key: notebook.id,
                text: notebook.name
            }
            notebookOptions.push(n);
        }

        debugMessage(pluginConfigData.debug.isDebug, "转换结果", notebookOptions);
        return notebookOptions;
    }

    /**
     * 自定义设置
     */
    private async openDIYSetting() {
        let dialog = new Dialog({
            title: PLUGIN_NAME,
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: "900px",
            height: "700px",
            destroyCallback: (options) => {
                debugMessage(pluginConfigData.debug.isDebug, "destroyCallback", options);
                //You'd better destroy the component when the dialog is closed
                panel.$destroy();
            }
        });
        let panel = new SettingExample({
            target: dialog.element.querySelector("#SettingPanel"),
            props: {
                config: pluginConfigData,
                plugin: this,
                notebookOptions: await this.getNotebookOptions()
            }
        });
    }

    /**
     * 批量添加图标
     * @param icons
     * @private
     */
    private async batchAddIcons(icons: any) {
        for (const key in icons) {
            this.addIcons(icons[key].icon);
        }
    }
}
