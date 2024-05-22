import {
    Dialog,
    ICard,
    ICardData,
    Plugin
} from "siyuan";
import "@/index.scss";

import SettingExample from "@/components/custom.svelte";

import {IConfig} from "@/types/config";

import {DEFAULT_CONFIG} from "@/configs/default"

import {mergeIgnoreArray} from "@/utils/misc/merge"
import {Logger} from "@/utils/logger"

export default class PluginMemosSyncHelper extends Plugin {
    static readonly STORAGE_NAME = "memos-sync-helper-config";
    public readonly logger: InstanceType<typeof Logger>;

    public config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
    }

    async onload() {
        this.loadData(PluginMemosSyncHelper.STORAGE_NAME)
            .then(config => {
                this.config = mergeIgnoreArray(DEFAULT_CONFIG, config || {}) as IConfig;
                console.log(this.config);
            })
            .catch(error => this.logger.error(error))
            .finally(async () => {

            });
    }

    onLayoutReady() {
        // this.loadData(STORAGE_NAME);
        // this.settingUtils.load();
        // console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
        //
        // console.log(
        //     "Official settings value calling example:\n" +
        //     this.settingUtils.get("InputArea") + "\n" +
        //     this.settingUtils.get("Slider") + "\n" +
        //     this.settingUtils.get("Select") + "\n"
        // );
        //
        // let tabDiv = document.createElement("div");
        // new HelloExample({
        //     target: tabDiv,
        //     props: {
        //         app: this.app,
        //     }
        // });
        // this.customTab = this.addTab({
        //     type: TAB_TYPE,
        //     init() {
        //         this.element.appendChild(tabDiv);
        //         console.log(this.element);
        //     },
        //     beforeDestroy() {
        //         console.log("before destroy tab:", TAB_TYPE);
        //     },
        //     destroy() {
        //         console.log("destroy tab:", TAB_TYPE);
        //     }
        // });
    }

    async onunload() {
        // console.log(this.i18n.byePlugin);
        // showMessage("Goodbye SiYuan Plugin");
        // console.log("onunload");
    }

    uninstall() {
        console.log("uninstall");
    }

    async updateCards(options: ICardData) {
        options.cards.sort((a: ICard, b: ICard) => {
            if (a.blockID < b.blockID) {
                return -1;
            }
            if (a.blockID > b.blockID) {
                return 1;
            }
            return 0;
        });
        return options;
    }

    /**
     * A custom setting pannel provided by svelte
     */
    openDIYSetting(): void {
        let dialog = new Dialog({
            title: "Memos 同步助手",
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: "900px",
            height: "700px",
            destroyCallback: (options) => {
                console.log("destroyCallback", options);
                //You'd better destroy the component when the dialog is closed
                pannel.$destroy();
            }
        });
        let pannel = new SettingExample({
            target: dialog.element.querySelector("#SettingPanel"),
            props: {
                config: this.config,
                plugin: this
            }
        });
    }

    /**
     * 打开设置页面
     */
    openSetting() {
        this.openDIYSetting()
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
}
