<script lang="ts">
    import Panels from "@/components/libs/Panels.svelte";
    import Panel from "@/components/libs/Panel.svelte";
    import Item from "@/components/libs/Item.svelte";
    import Input from "@/components/libs/Input.svelte";

    import {panelKey, PANELS} from "@/constants/components/panels";
    import {itemType} from "@/constants/components/input";
    import {
        IMAGE_BLOCK_LAYOUT_OPTIONS,
        LABEL_MATCH_OPTIONS,
        QUOTE_HANDLE_OPTIONS,
        RESOURCE_DOWNLOAD_OPTIONS,
        SYNC_PLAN_OPTIONS,
        VERSION_OPTIONS
    } from "@/constants/components/select";

    import {IOptions} from "@/types/components/item.d";
    import {IConfig} from "@/types/config/default.d";

    import type PluginMemosSyncHelper from "@/index";
    import {checkAccessToken, test} from "@/main";


    export let plugin: InstanceType<typeof PluginMemosSyncHelper>;
    export let config: IConfig;

    export let notebookOptions: IOptions;

    let panels_focus_key = panelKey.base;

    function updated() {
        plugin.updateConfig(config);
    }


</script>

<Panels
        focus={panels_focus_key}
        let:focus={focusPanel}
        panels={PANELS}
>
    <Panel display={PANELS[0].key === focusPanel}>
        <Item
                text="校验授权码是否失效"
                title="授权码校验"
        >
            <Input
                    on:clicked={ checkAccessToken }
                    settingKey="Check"
                    settingValue="校验"
                    slot="input"
                    type={itemType.button}
            />
        </Item>
        <Item
                text="当前服务器上运行的 Memos 版本"
                title="Memos 版本"
        >
            <Input
                    on:changed={e => {
                        config.base.version = e.detail.value;
                        updated();
                    }
                }
                    options={VERSION_OPTIONS}
                    settingKey="Version"
                    settingValue={config.base.version}
                    slot="input"
                    type={itemType.select}
            />
        </Item>
        <Item
                block={true}
                isRequired={true}
                text="访问 Memos 的网址"
                title="服务器地址"
        >
            <Input
                    block={true}
                    on:changed={e => {
                        config.base.host = e.detail.value;
                        updated();
                    }
                }
                    placeholder="支持域名和IP地址，注意不要以 '/' 结尾"
                    settingKey="Host"
                    settingValue={config.base.host}
                    slot="input"
                    type={itemType.text}
            />
        </Item>
        <Item
                block={true}
                isRequired={true}
                text="用户授权认证"
                title="授权码"
        >
            <Input
                    block={true}
                    on:changed={e => {
                        config.base.token = e.detail.value;
                        updated();
                    }
                }
                    placeholder="在 Memos 的‘我的账号’页面自行创建"
                    settingKey="Token"
                    settingValue={config.base.token}
                    slot="input"
                    type={itemType.text}
            />
        </Item>

        <Item
                text={
                `1. ${SYNC_PLAN_OPTIONS[0].text}：需要配置笔记本，文档路径无效<br>`+
                `2. ${SYNC_PLAN_OPTIONS[1].text}：需要配置笔记本，如需保存至指定文档下需要配置文档路径<br>`+
                `3. ${SYNC_PLAN_OPTIONS[2].text}：需要配置笔记本和文档路径`
                }
                title="同步方案"
        >
            <Input
                    on:changed={e => {
                        config.base.syncPlan = e.detail.value;
                        updated();
                    }
                }
                    options={SYNC_PLAN_OPTIONS}
                    settingKey="SyncPlan"
                    settingValue={config.base.syncPlan}
                    slot="input"
                    type={itemType.select}
            />
        </Item>

        <Item
                isRequired={true}
                text="选择保存数据的笔记本"
                title="同步笔记本"
        >
            <Input
                    on:changed={e => {
                        config.base.notebook = e.detail.value;
                        updated();
                    }
                }
                    options={notebookOptions}
                    settingKey="notebook"
                    settingValue={config.base.notebook}
                    slot="input"
                    type={itemType.select}
            />
        </Item>
        <Item
                block={true}
                isTip={true}
                text="配置目标文档的路径"
                tipTest={`当${SYNC_PLAN_OPTIONS[2].text}时，此项必填`}
                title="文档路径"
        >
            <Input
                    block={true}
                    on:changed={e => {
                        config.base.docPath = e.detail.value;
                        updated();
                    }
                }
                    placeholder="请以'/'开头进行填写"
                    settingKey="docPath"
                    settingValue={config.base.docPath}
                    slot="input"
                    type={itemType.text}
            />
        </Item>
        <Item
                text="上次完成同步的时间，在同步完成后自动更新"
                title="上次同步时间"
        >
            <Input
                    on:changed={e => {
                        config.base.lastSyncTime = e.detail.value;
                        updated();
                    }
                }
                    placeholder="YYYY/MM/DD HH:mm:ss"
                    settingKey="LastSyncTime"
                    settingValue={config.base.lastSyncTime}
                    slot="input"
                    type={itemType.text}
            />
        </Item>
    </Panel>

    <Panel display={PANELS[1].key === focusPanel}>
        <Item
                isTip={true}
                text="自定义标签的匹配范围"
                tipTest="本功能仅在 Memos 版本为0.21及以下时有效"
                title="标签匹配范围"
        >
            <Input
                    on:changed={e => {
                        config.advanced.labelMatch = e.detail.value;
                        updated();
                    }
                }
                    options={LABEL_MATCH_OPTIONS}
                    settingKey="Version"
                    settingValue={config.advanced.labelMatch}
                    slot="input"
                    type={itemType.select}
            />
        </Item>
        <Item
                text="保存 Memos 的引用到思源笔记时的显示处理方案"
                title="引用处理方案"
        >
            <Input
                    on:changed={e => {
                        config.advanced.quoteHandle = e.detail.value;
                        updated();
                    }}
                    options={QUOTE_HANDLE_OPTIONS}
                    settingKey="QuoteHandle"
                    settingValue={config.advanced.quoteHandle}
                    slot="input"
                    type={itemType.select}
            />
        </Item>
        <Item
                text="保存 Memos 的图片到思源笔记时的排列处理方案"
                title="图片块排列方案"
        >
            <Input
                    on:changed={e => {
                        config.advanced.imageBlockLayout = e.detail.value;
                        updated();
                    }
                }
                    options={IMAGE_BLOCK_LAYOUT_OPTIONS}
                    settingKey="ImageBlockLayout"
                    settingValue={config.advanced.imageBlockLayout}
                    slot="input"
                    type={itemType.select}
            />
        </Item>
        <Item
                text="识别超链接并转换成可点击的样式"
                title="识别超链接"
        >
            <Input
                    on:changed={e => {
                        config.advanced.isHref = e.detail.value;
                        updated();
                    }
                }
                    settingKey="Href"
                    settingValue={config.advanced.isHref}
                    slot="input"
                    type={itemType.checkbox}
            />
        </Item>
        <Item
                isTip={true}
                text="识别双向链接符号并自动关联对应文档"
                tipTest="只支持文档块的匹配"
                title="识别双向链接符号"
        >
            <Input
                    on:changed={e => {
                        config.advanced.isLinks = e.detail.value;
                        updated();
                    }
                }
                    settingKey="Links"
                    settingValue={config.advanced.isLinks}
                    slot="input"
                    type={itemType.checkbox}
            />
        </Item>
        <Item
                block={true}
                isTip={true}
                text="配置保存识别双向链接时自动创建的文档路径"
                tipTest="若本项为空，则自动创建的文档会直接保存在同步笔记本下"
                title="主题路径"
        >
            <Input
                    block={true}
                    on:changed={e => {
                        config.advanced.subjectPath = e.detail.value;
                        updated();
                    }
                }
                    placeholder="请以'/'开头进行填写"
                    settingKey="SubjectPath"
                    settingValue={config.advanced.subjectPath}
                    slot="input"
                    type={itemType.text}
            />
        </Item>
        <Item
                text="为所有的标签增加一个统一的上级标签"
                title="标签管理优化"
        >
            <Input
                    on:changed={e => {
                        config.advanced.isLabelTop = e.detail.value;
                        updated();
                    }
                }
                    settingKey="LabelTop"
                    settingValue={config.advanced.isLabelTop}
                    slot="input"
                    type={itemType.checkbox}
            />
        </Item>
        <Item
                isTip={true}
                text="配置上级标签的名称"
                tipTest="当打开标签管理优化开关时，此项必填"
                title="上级标签名称"
        >
            <Input
                    on:changed={e => {
                        config.advanced.labelName = e.detail.value;
                        updated();
                    }
                }
                    placeholder="请确认开头和结尾没有'/'"
                    settingKey="LabelName"
                    settingValue={config.advanced.labelName}
                    slot="input"
                    type={itemType.text}
            />
        </Item>
        <Item
                text="识别对应的格式的视频文件并转换成可点击播放的样式"
                title="优化视频样式"
        >
            <Input
                    on:changed={e => {
                        config.advanced.isImproveVideoStyle = e.detail.value;
                        updated();
                    }
                }
                    settingKey="ImproveVideoStyle"
                    settingValue={config.advanced.isImproveVideoStyle}
                    slot="input"
                    type={itemType.checkbox}
            />
        </Item>
        <Item
                block={true}
                text="配置哪些格式的视频文件需要转换"
                title="需要优化的视频格式"
        >
            <Input
                    block={true}
                    height={100}
                    on:changed={e => {
                        config.advanced.videoFormats = e.detail.value;
                        updated();
                    }
                }
                    settingKey="VideoFormats"
                    settingValue={config.advanced.videoFormats ? config.advanced.videoFormats : ""}
                    slot="input"
                    type={itemType.textarea}
            />
        </Item>
    </Panel>

    <Panel display={PANELS[2].key === focusPanel}>

        <Item
                text="当资源（图片）无法正确显示或下载时请选择切换其它模式"
                title="资源下载方案"
        >
            <Input
                    on:changed={e => {
                        config.special.resourceDownload = e.detail.value;
                        updated();
                    }
                }
                    options={RESOURCE_DOWNLOAD_OPTIONS}
                    settingKey="ResourceDownload"
                    settingValue={config.special.resourceDownload}
                    slot="input"
                    type={itemType.select}
            />
        </Item>
    </Panel>

    <Panel display={PANELS[3].key === focusPanel}>
        <Item
                text="开启后将在控制台输出执行日志"
                title="调试模式"
        >
            <Input
                    on:changed={e => {
                        config.debug.isDebug = e.detail.value;
                        updated();
                    }
                }
                    settingKey="Debug"
                    settingValue={config.debug.isDebug}
                    slot="input"
                    type={itemType.checkbox}
            />
        </Item>
        <Item
                text="禁用后，在调试时将不会自动更新上次同步时间"
                title="允许更新上次同步时间"
        >
            <Input
                    on:changed={e => {
                        config.debug.isAutoUpdateTime = e.detail.value;
                        updated();
                    }
                }
                    settingKey="autoUpdateTime"
                    settingValue={config.debug.isAutoUpdateTime}
                    slot="input"
                    type={itemType.checkbox}
            />
        </Item>
        <Item
                text="测试功能"
                title="测试"
        >
            <Input
                    on:clicked={ test }
                    settingKey="Test"
                    settingValue="测试"
                    slot="input"
                    type={itemType.button}
            />
        </Item>
    </Panel>
</Panels>