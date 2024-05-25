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

    import {IOptions} from "@/types/components/item.d";
    import {IConfig} from "@/types/config.d";

    import type PluginMemosSyncHelper from "@/index";
    import {checkAccessToken, test} from "@/controllers/plugin";


    export let plugin: InstanceType<typeof PluginMemosSyncHelper>;
    export let config: IConfig;

    export let notebookOptions : IOptions;

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
                title="授权码校验"
                text="校验授权码是否失效"
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
                isRequired={true}
                title="服务器地址"
                text="访问 Memos 的网址"
        >
            <Input
                    block={true}
                    slot="input"
                    type={ItemType.text}
                    placeholder="支持域名和IP地址，注意不要以 '/' 结尾"
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
                isRequired={true}
                title="授权码"
                text="用户授权认证"
        >
            <Input
                    block={true}
                    slot="input"
                    type={ItemType.text}
                    placeholder="在 Memos 的‘我的账号’页面自行创建"
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
                text={
                `1. ${syncPlanOptions[0].text}：需要配置笔记本，文档路径无效<br>`+
                `2. ${syncPlanOptions[1].text}：需要配置笔记本，如需保存至指定文档下需要配置文档路径<br>`+
                `3. ${syncPlanOptions[2].text}：需要配置笔记本和文档路径`
                }
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
                text="选择保存数据的笔记本"
                isRequired={true}
        >
            <Input
                    slot="input"
                    type={ItemType.select}
                    settingKey="notebook"
                    settingValue={config.general.notebook}
                    options={notebookOptions}
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
                isTip={true}
                tipTest={`当${syncPlanOptions[2].text}时，此项必填`}
                block={true}
        >
            <Input
                    slot="input"
                    block={true}
                    type={ItemType.text}
                    settingKey="docPath"
                    placeholder="请以'/'开头进行填写"
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
                    placeholder="YYYY/MM/DD HH:mm:ss"
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
                title="引用处理方案"
                text="保存 Memos 的引用到思源笔记时的显示处理方案"
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
                title="图片块排列方案"
                text="保存 Memos 的图片到思源笔记时的排列处理方案"
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
                text="识别超链接并转换成可点击的样式"
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
                title="识别双向链接符号"
                text="识别双向链接符号并自动关联对应文档"
                isTip={true}
                tipTest="只支持文档块的匹配"
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
                block={true}
                title="主题路径"
                text="配置保存识别双向链接时自动创建的文档路径"
                isTip={true}
                tipTest="若本项为空，则自动创建的文档会直接保存在同步笔记本下"
        >
            <Input
                    slot="input"
                    block={true}
                    type={ItemType.text}
                    settingKey="SubjectPath"
                    placeholder="请以'/'开头进行填写"
                    settingValue={config.advanced.subjectPath}
                    on:changed={e => {
                        config.advanced.subjectPath = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="标签管理优化"
                text="为所有的标签增加一个统一的上级标签"
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
                text="配置上级标签的名称"
                isTip={true}
                tipTest="当需要增加上级标签时，此项必填"
        >
            <Input
                    slot="input"
                    type={ItemType.text}
                    settingKey="LabelName"
                    settingValue={config.advanced.labelName}
                    placeholder="请确认开头和结尾没有'/'"
                    on:changed={e => {
                        config.advanced.labelName = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="优化视频样式"
                text="识别对应的格式的视频文件并转换成可点击播放的样式"
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
                text="配置哪些格式的视频文件需要转换"
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
        <Item
                title="资源下载方案"
                text="当资源（图片）无法正确显示或下载时请选择切换其它模式"
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
    </Panel>

    <Panel display={panels[2].key === focusPanel}>
        <Item
                title="标签匹配范围"
                text="自定义标签的匹配范围"
                isTip={true}
                tipTest="本功能仅在 Memos 版本为0.21及以下时有效"
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
                title="调试模式"
                text="开启后将在控制台输出执行日志"
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
                text="禁用后，在调试时将不会自动更新上次同步时间"
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
        <Item
                title="测试"
                text="测试功能"
        >
            <Input
                    slot="input"
                    type={ItemType.button}
                    settingKey="Test"
                    settingValue="测试"
                    on:clicked={ test }
            />
        </Item>
    </Panel>
</Panels>