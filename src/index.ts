import {
    Plugin,
    Dialog,
    getFrontend
} from "siyuan";
import "@/index.scss";

import SettingExample from "@/components/setting.svelte";

import {IConfig} from "@/types/config";

import {DEFAULT_CONFIG} from "@/configs/default";
import {ICONS} from "@/configs/assets/icons";

import {mergeIgnoreArray} from "@/utils/misc/merge";
import {Logger} from "@/utils/logger";


export default class PluginMemosSyncHelper extends Plugin {
    /**
     * 插件名称
     */
    static readonly PLUGIN_NAME : string = "Memos 同步助手";

    /**
     * 配置名称
     */
    static readonly STORAGE_NAME : string = this.name;

    /**
     * 是否是手机端
     * @private
     */
    private isMobile: boolean;

    /**
     * 配置数据
     * @protected
     */
    protected config: IConfig;

    /**
     * 日志
     */
    public readonly logger: InstanceType<typeof Logger>;

    /**
     * 顶栏控件
     * @private
     */
    private topBarElement : HTMLElement;


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
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        // 批量添加图标
        await this.batchAddIcons(ICONS);

        // 为插件在顶栏添加一个图标
        this.topBarElement = this.addTopBar({
            icon: ICONS.iconMemos.name,
            title: PluginMemosSyncHelper.PLUGIN_NAME,
            position: "right",
            callback: () => {
                console.log("test");
            }
        });

        // 读取配置数据
        this.loadData(PluginMemosSyncHelper.STORAGE_NAME)
            .then(config => {
                this.config = mergeIgnoreArray(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(async () => {

            });
    }

    onLayoutReady() {

    }

    /**
     * 当插件被禁用的时候，会调用此方法。
     */
    async onunload() {
        console.log("onunload");
    }

    /**
     * 当插件被卸载的时候，会调用此方法。
     */
    uninstall() {
        console.log("uninstall");
    }

    /**
     * 打开设置页面
     */
    openSetting() {
        this.openDIYSetting()
    }


    // **************************************** 自定义 ****************************************


    /**
     * 自定义设置
     */
    private openDIYSetting(): void {
        let dialog = new Dialog({
            title: PluginMemosSyncHelper.PLUGIN_NAME,
            content: `<div id="SettingPanel""></div>`,
            width: "800px",
            height: "700px",
            destroyCallback: (options) => {
                console.log("destroyCallback", options);
                //You'd better destroy the component when the dialog is closed
                panel.$destroy();
            }
        });
        let panel = new SettingExample({
            target: dialog.element.querySelector("#SettingPanel"),
            props: {
                config: this.config,
                plugin: this
            }
        });
    }

    /**
     * 更新插件配置
     * @param config - 配置数据
     */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== this.config) {
            this.config = config;
        }
        return this.saveData(PluginMemosSyncHelper.STORAGE_NAME, this.config);
    }

    /**
     * 批量添加图标
     * @param icons
     * @private
     */
    private async batchAddIcons(icons: any){
        for (const key in icons){
            this.addIcons(icons[key].icon);
        }
    }
}
