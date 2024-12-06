<script lang="ts">
    import Panels from "@/components/libs/Panels.svelte";
    import Panel from "@/components/libs/Panel.svelte";
    import Item from "@/components/libs/Item.svelte";
    import Input from "@/components/libs/Input.svelte";

    import {panelKey, PANELS} from "@/constants/components/panels";
    import {itemType} from "@/constants/components/input";
    import {MEMOS_SORT_OPTIONS, SYNC_PLAN_OPTIONS, VERSION_OPTIONS, TAG_FILTER_OPTIONS, syncPlanKey, tagFilterKey} from "@/constants/components/select";
    import {API_VERSION} from "@/constants/memos";

    import {IOptions} from "@/types/components/item.d";
    import {IConfig} from "@/types/config/default.d";

    import type PluginMemosSyncHelper from "@/index";
    import {checkAccessToken, test} from "@/main";
    import {repair} from "@/controllers/plugin/common/fun/repair";


    export let plugin: InstanceType<typeof PluginMemosSyncHelper>;
    export let config: IConfig;

    export let notebookOptions: IOptions;

    let panels_focus_key = panelKey.base;

    function updated() {
        plugin.updateConfig(config);
    }

    let syncPlanText = ''; // 同步方案的说明文字
    let docPathTitle = "文档路径";
    let docPathIsShow = true;
    let docPathIsRequired = false; // 文档路径是否必须
    let docPathText = ""; // 文档路径的说明文字

    // let subjectPathIsShow = true; // 主题路径是否显示
    let videoFormatsIsShow = true; // 需要优化的视频格式
    let labelNameIsShow = true; // 上级标签名称

    let tagFilterModeIsShow = true; // 是否显示标签过滤模式
    let tagListIsShow = true; // 是否显示标签列表

    let hideTagList = [
        tagFilterKey.all,
        tagFilterKey.syncNoTag,
        tagFilterKey.notSyncNoTag
    ]

    $: {
        switch (config.base.syncPlan) {
            case syncPlanKey.dailyNotes:
                syncPlanText = `请配置同步笔记本，如需更改DailyNote路径请配置文档路径`;
                docPathTitle = "日记存放路径"
                docPathIsShow = true;
                docPathIsRequired = false;
                docPathText = "支持日期格式模板变量，与思源笔记设置一致";
                break;
            case syncPlanKey.singleDoc:
                docPathTitle = "文档路径";
                syncPlanText = `请配置同步笔记本，如需保存至指定文档下请配置文档路径`;
                docPathIsShow = true;
                docPathIsRequired = false;
                docPathText = "将同步数据保存在指定路径的文档下级"
                break;
            case syncPlanKey.sameDoc:
                docPathTitle = "文档路径";
                syncPlanText = `请配置同步笔记本以及文档路径`;
                docPathIsShow = true;
                docPathIsRequired = true;
                docPathText = "将同步数据保存在指定路径的文档中"
                break;
            default:
                syncPlanText = '';
        }

        // subjectPathIsShow = config.advanced.isHandleBacklinks;
        videoFormatsIsShow = config.advanced.isHandleVideo;
        labelNameIsShow = config.advanced.isSuperLabel;

        if (API_VERSION.V2_LabelFilter.includes(config.base.version)) {
            tagFilterModeIsShow = true;
            tagListIsShow = !hideTagList.includes(config.filter.tagFilterMode);
        } else {
            tagFilterModeIsShow = false;
            tagListIsShow = false;
        }
    }


</script>

<Panels
        focus={panels_focus_key}
        let:focus={focusPanel}
        panels={PANELS}
>
    <Panel display={PANELS[0].key === focusPanel}>
        <Item
                title="Access Token 校验"
                text="校验 Access Token 是否有效"
        >
            <Input
                    slot="input"
                    type={itemType.button}
                    settingKey="Check"
                    settingValue="校验"
                    on:clicked={ checkAccessToken }
            />
        </Item>
        <Item
                title="Memos 版本"
                text="当前服务器上运行的 Memos 版本"
                isTip={false}
                tipTest="v0.22及以上版本不适用于docker版思源笔记"
        >
            <Input
                    slot="input"
                    type={itemType.select}
                    settingKey="Version"
                    settingValue={config.base.version}
                    options={VERSION_OPTIONS}
                    on:changed={e => {
                        config.base.version = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="服务器地址"
                text="访问 Memos 的地址"
                block={true}
                isRequired={true}
        >
            <Input
                    slot="input"
                    type={itemType.text}
                    settingKey="Host"
                    settingValue={config.base.host}
                    placeholder="支持域名和IP地址，注意不要以 '/' 结尾"
                    block={true}
                    on:changed={e => {
                        config.base.host = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="Access Token"
                text="请在 Memos 设置页面获取"
                block={true}
                isRequired={true}
        >
            <Input
                    slot="input"
                    type={itemType.text}
                    settingKey="Token"
                    settingValue={config.base.token}
                    block={true}
                    on:changed={e => {
                        config.base.token = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>

        <Item
                title="同步方案"
                text={syncPlanText}
        >
            <Input
                    slot="input"
                    type={itemType.select}
                    settingKey="SyncPlan"
                    settingValue={config.base.syncPlan}
                    options={SYNC_PLAN_OPTIONS}
                    on:changed={e => {
                        config.base.syncPlan = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>

        <Item
                title="同步笔记本"
                text="保存同步数据的笔记本"
                isRequired={true}
        >
            <Input
                    slot="input"
                    type={itemType.select}
                    settingKey="notebook"
                    settingValue={config.base.notebook}
                    options={notebookOptions}
                    on:changed={e => {
                        config.base.notebook = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title={docPathTitle}
                text={docPathText}
                isRequired={docPathIsRequired}
                isShow={docPathIsShow}
        >
            <Input
                    slot="input"
                    type={itemType.text}
                    settingKey="docPath"
                    settingValue={config.base.docPath}
                    placeholder="请以'/'开头进行填写"
                    on:changed={e => {
                        config.base.docPath = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>

        <Item
                title="资源保存路径"
                text="保存 Memos 资源的路径"
                isRequired={true}
                isShow={true}
        >
            <Input
                    slot="input"
                    type={itemType.text}
                    settingKey="resourceSavePath"
                    settingValue={config.base.resourceSavePath}
                    placeholder="开头和结尾请不要保存 '/'"
                    on:changed={e => {
                        config.base.resourceSavePath = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>

        <Item
                title="数据排序"
                text="根据更新日期对同步的数据进行升序或降序排序"
                isTip={true}
                tipTest="当同步方案为 {SYNC_PLAN_OPTIONS[1].text} 时，本功能不生效"
        >
            <Input
                    slot="input"
                    type={itemType.select}
                    settingKey="MemosSort"
                    settingValue={config.base.memosSort}
                    options={MEMOS_SORT_OPTIONS}
                    on:changed={e => {
                        config.base.memosSort = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>

    <Panel display={PANELS[1].key === focusPanel}>
        <Item
                title="修复"
                text="修复旧版插件同步的数据以兼容嵌入内容功能"
        >
            <Input
                    slot="input"
                    type={itemType.button}
                    settingKey="Repair"
                    settingValue="修复"
                    on:clicked={ repair }
            />
        </Item>
        <Item
                title="识别超链接"
                text="识别超链接并转换成可点击打开的样式"
        >
            <Input
                    slot="input"
                    type={itemType.checkbox}
                    settingKey="Href"
                    settingValue={config.advanced.isHandleHref}
                    on:changed={e => {
                        config.advanced.isHandleHref = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="识别双向链接"
                text="识别双向链接符号<code class='fn__code'>((</code> <code class='fn__code'>))</code>并自动关联对应文档"
                isTip={true}
                tipTest="只支持文档块的匹配"
        >
            <Input
                    slot="input"
                    type={itemType.checkbox}
                    settingKey="Links"
                    settingValue={config.advanced.isHandleBacklinks}
                    on:changed={e => {
                        config.advanced.isHandleBacklinks = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
<!--        <Item-->
<!--                title="主题路径"-->
<!--                text="配置保存识别双向链接时自动创建的文档路径"-->
<!--                isTip={true}-->
<!--                tipTest="若本项为空，则自动创建的文档会直接保存在同步笔记本下"-->
<!--                block={true}-->
<!--                isShow={subjectPathIsShow}-->
<!--        >-->
<!--            <Input-->
<!--                    slot="input"-->
<!--                    type={itemType.text}-->
<!--                    settingKey="SubjectPath"-->
<!--                    settingValue={config.advanced.subjectPath}-->
<!--                    placeholder="请以 / 开头进行填写"-->
<!--                    block={true}-->
<!--                    on:changed={e => {-->
<!--                        config.advanced.subjectPath = e.detail.value;-->
<!--                        updated();-->
<!--                    }-->
<!--                }-->
<!--            />-->
<!--        </Item>-->
        <Item
                title="优化视频样式"
                text="识别指定格式的视频文件并转换成可点击播放的样式"
        >
            <Input
                    slot="input"
                    type={itemType.checkbox}
                    settingKey="ImproveVideoStyle"
                    settingValue={config.advanced.isHandleVideo}
                    on:changed={e => {
                        config.advanced.isHandleVideo = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="需要优化的视频格式"
                text="配置需要转换的视频文件格式，以英文分号 <code class='fn__code'>;</code> 分隔"
                block={true}
                isRequired={true}
                isShow={videoFormatsIsShow}
        >
            <Input
                    slot="input"
                    type={itemType.textarea}
                    settingKey="VideoFormats"
                    settingValue={config.advanced.videoFormats ? config.advanced.videoFormats : ""}
                    block={true}
                    height={100}
                    on:changed={e => {
                        config.advanced.videoFormats = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="优化标签管理"
                text="为所有的标签增加一个统一的上级标签"
        >
            <Input
                    slot="input"
                    type={itemType.checkbox}
                    settingKey="LabelTop"
                    settingValue={config.advanced.isSuperLabel}
                    on:changed={e => {
                        config.advanced.isSuperLabel = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
        <Item
                title="标签名称"
                text="自定义上级标签的名称"
                isRequired={true}
                isShow={labelNameIsShow}
        >
            <Input
                    slot="input"
                    type={itemType.text}
                    settingKey="LabelName"
                    settingValue={config.advanced.labelName}
                    placeholder="请确认开头和结尾没有 '/'"
                    on:changed={e => {
                        config.advanced.labelName = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>

    <Panel display={PANELS[2].key === focusPanel}>
        <Item
                title="上次同步时间"
                text="在同步完成后自动更新"

        >
            <Input
                    slot="input"
                    type={itemType.text}
                    settingKey="LastSyncTime"
                    settingValue={config.filter.lastSyncTime}
                    placeholder="YYYY/MM/DD HH:mm:ss"
                    on:changed={e => {
                        config.filter.lastSyncTime = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>

        <Item
                title="标签过滤模式"
                text="对数据进行标签过滤"
                isShow={tagFilterModeIsShow}
        >
            <Input
                    slot="input"
                    type={itemType.select}
                    settingKey="tagFilterMode"
                    settingValue={config.filter.tagFilterMode}
                    options={TAG_FILTER_OPTIONS}
                    on:changed={e => {
                        config.filter.tagFilterMode = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>

        <Item
                title="配置标签"
                text="配置允许同步或不允许同步的标签，以英文分号 <code class='fn__code'>;</code> 分隔"
                block={true}
                isRequired={true}
                isShow={tagListIsShow}
        >
            <Input
                    slot="input"
                    type={itemType.textarea}
                    settingKey="tagList"
                    settingValue={config.filter.tagList ? config.filter.tagList : ""}
                    block={true}
                    height={100}
                    on:changed={e => {
                        config.filter.tagList = e.detail.value;
                        updated();
                    }
                }
            />
        </Item>
    </Panel>

    <Panel display={PANELS[3].key === focusPanel}>
        <Item
                title="调试模式"
                text="开启后将在控制台输出操作日志"
        >
            <Input
                    slot="input"
                    type={itemType.checkbox}
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
                text="禁用后，在调试时将不会自动更新上次同步时间"
                title="允许更新上次同步时间"
                isShow={config.debug.isDebug}
        >
            <Input
                    slot="input"
                    type={itemType.checkbox}
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
                isShow={false}
        >
            <Input
                    slot="input"
                    type={itemType.button}
                    settingKey="Test"
                    settingValue="测试"
                    on:clicked={ test }
            />
        </Item>
    </Panel>
</Panels>