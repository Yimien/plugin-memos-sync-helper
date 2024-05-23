<script lang="ts">
    import Panels from "@/components/libs/Panels.svelte";
    import Panel from "@/components/libs/Panel.svelte";
    import Item from "@/components/libs/Item.svelte";
    import Input from "@/components/libs/Input.svelte";

    import { PanelKey, panels} from "@/configs/components/panels";
    import { ItemType } from "@/configs/components/input";
    import {
        versionOptions, quoteHandleOptions, labelMatchOptions, resourceDownloadOptions,
        syncPlanOptions, imageBlockLayoutOptions
    } from "@/configs/components/select";

    import { IConfig } from "@/types/config.d";

    import type PluginMemosSyncHelper from "@/index";
    import { checkAccessToken} from "@/controllers/memos/v2";

    export let plugin: InstanceType<typeof PluginMemosSyncHelper>;
    export let config: IConfig;

    let panels_focus_key = PanelKey.general;

    function updated() {
        plugin.updateConfig(config);
    }


</script>

<Panels
    {panels}
    focus={panels_focus_key}
    let:focus={focusPanel}
>
    <Panel display={panels[0].key === focusPanel}>
        <Item
                title="服务器检查"
                text="检查服务器是否运行正常以及授权码是否失效"
        >
            <Input
                    slot="input"
                    type={ItemType.button}
                    settingKey="Check"
                    settingValue="校验"
                    on:clicked={ checkAccessToken }
            />
        </Item>
        <Item
            title="Memos 版本"
            text="当前服务器上运行的 Memos 版本"
        >
            <Input
                slot="input"
                type={ItemType.select}
                settingKey="Version"
                settingValue={config.general.version}
                options={versionOptions}
                on:changed={e => {
                        config.general.version = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                block={true}
                title="服务器地址"
                text=""
        >
            <Input
                    block={true}
                    slot="input"
                    type={ItemType.text}
                    settingKey="Host"
                    settingValue={config.general.host}
                    on:changed={e => {
                        config.general.host = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                block={true}
                title="授权码"
                text=""
        >
            <Input
                    block={true}
                    slot="input"
                    type={ItemType.text}
                    settingKey="Token"
                    settingValue={config.general.token}
                    on:changed={e => {
                        config.general.token = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="同步方案"
                text="如何保存数据？"
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="SyncPlan"
                    settingValue={config.general.syncPlan}
                    options={syncPlanOptions}
                    on:changed={e => {
                        config.general.syncPlan = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="同步笔记本"
                text="将数据同步至哪个笔记本？"
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="notebook"
                    settingValue={config.general.notebook}
                    options={versionOptions}
                    on:changed={e => {
                        config.general.notebook = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="文档路径"
                text="配置目标文档的路径"
        >
            <Input
                    slot="input"
                    type={ItemType.text}
                    settingKey="docPath"
                    settingValue={config.general.docPath}
                    on:changed={e => {
                        config.general.docPath = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="上次同步时间"
                text="上次完成同步的时间，在同步完成后自动更新"
        >
            <Input
                    slot="input"
                    type={ItemType.text}
                    settingKey="LastSyncTime"
                    settingValue={config.general.lastSyncTime}
                    on:changed={e => {
                        config.general.lastSyncTime = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>

    <Panel display={panels[1].key === focusPanel}>

        <Item
                title="识别双向链接符号"
                text="配置目标文档的路径"
        >
            <Input
                    slot="input"
                    type={ItemType.checkbox}
                    settingKey="Links"
                    settingValue={config.advanced.isLinks}
                    on:changed={e => {
                        config.advanced.isLinks = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="主题路径"
                text="识别双向链接时，若文档不存在，会自动创建在该路径下"
        >
            <Input
                    slot="input"
                    type={ItemType.text}
                    settingKey="SubjectPath"
                    settingValue={config.advanced.subjectPath}
                    on:changed={e => {
                        config.advanced.subjectPath = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="收束标签"
                text="为所有的标签增加一个上级标签以方便管理"
        >
            <Input
                    slot="input"
                    type={ItemType.checkbox}
                    settingKey="LabelTop"
                    settingValue={config.advanced.isLabelTop}
                    on:changed={e => {
                        config.advanced.isLabelTop = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="上级标签名称"
                text="自定义上级标签名称"
        >
            <Input
                    slot="input"
                    type={ItemType.text}
                    settingKey="LabelName"
                    settingValue={config.advanced.labelName}
                    on:changed={e => {
                        config.advanced.labelName = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="引用处理方案"
                text="如何保存 Memos 的引用"
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="QuoteHandle"
                    settingValue={config.advanced.quoteHandle}
                    options={quoteHandleOptions}
                    on:changed={e => {
                        config.advanced.quoteHandle = e.detail.value;
                        updated();
                    }}
            />
        </Item>
        <Item
                title="图片块布局"
                text="图片排列方案"
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="ImageBlockLayout"
                    settingValue={config.advanced.imageBlockLayout}
                    options={imageBlockLayoutOptions}
                    on:changed={e => {
                        config.advanced.imageBlockLayout = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="识别超链接"
                text="是否识别超链接"
        >
            <Input
                    slot="input"
                    type={ItemType.checkbox}
                    settingKey="Href"
                    settingValue={config.advanced.isHref}
                    on:changed={e => {
                        config.advanced.isHref = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="资源下载方案"
                text="如何下载 Memos 的资源"
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="ResourceDownload"
                    settingValue={config.advanced.resourceDownload}
                    options={resourceDownloadOptions}
                    on:changed={e => {
                        config.advanced.resourceDownload = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="优化视频样式"
                text="优化视频格式文件的保存样式"
        >
            <Input
                    slot="input"
                    type={ItemType.checkbox}
                    settingKey="ImproveVideoStyle"
                    settingValue={config.advanced.isImproveVideoStyle}
                    on:changed={e => {
                        config.advanced.isImproveVideoStyle = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                block={true}
                title="需要优化的视频格式"
                text="配置哪些视频格式需要优化"
        >
            <Input
                    slot="input"
                    type={ItemType.textarea}
                    settingKey="VideoFormats"
                    settingValue={config.advanced.videoFormats ? config.advanced.videoFormats : ""}
                    height={100}
                    block={true}
                    on:changed={e => {
                        config.advanced.videoFormats = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>

    <Panel display={panels[2].key === focusPanel}>
        <Item
                title="标签匹配范围"
                text="配置标签的匹配范围"
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="Version"
                    settingValue={config.old.labelMatch}
                    options={labelMatchOptions}
                    on:changed={e => {
                        config.old.labelMatch = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>

    <Panel display={panels[3].key === focusPanel}>
        <Item
                title="开始调试"
                text="启用后将在控制台输出执行日志"
        >
            <Input
                    slot="input"
                    type={ItemType.checkbox}
                    settingKey="Debug"
                    settingValue={config.debug.isDebug}
                    on:changed={e => {
                        config.debug.isDebug = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="允许更新上次同步时间"
                text="禁用后在调试时将不会自动更新调试模式"
        >
            <Input
                    slot="input"
                    type={ItemType.checkbox}
                    settingKey="autoUpdateTime"
                    settingValue={config.debug.isAutoUpdateTime}
                    on:changed={e => {
                        config.debug.isAutoUpdateTime = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>
</Panels>

