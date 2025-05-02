export interface IBase {
    /**
     * Memos 版本号
     */
    version: number,
    /**
     * 服务器地址
     */
    host: string,
    /**
     * 授权码
     */
    token: string,
    /**
     * 同步方案
     */
    syncPlan: number,
    /**
     * 笔记本
     */
    notebook: string,
    /**
     * 文档路径
     */
    docPath: string,
    /**
     * 是否使用模板
     */
    useTemplate: boolean,
    /**
     * 资源保存路径
     */
    resourceSavePath,
    /**
     * 排序
     */
    memosSort: number
    /**
     * 检查可同步的数据
     */
    checkSyncMemos: number
}

export interface IAdvanced {
    /**
     * 格式化标题时间
     */
    formatDataTime: string;
    /**
     * 是否识别超链接
     */
    isHandleHref: boolean,
    /**
     * 是否识别双向链接
     */
    isHandleBacklinks: boolean,
    /**
     * 是否处理视频资源
     */
    isHandleVideo: boolean,
    /**
     * 支持优化的视频格式
     */
    videoFormats: string
    /**
     * 是否增加统一上级标签
     */
    isSuperLabel: boolean,
    /**
     * 上级标签名称
     */
    labelName: string,
}

export interface IFilter {
    /**
     * 上次同步时间
     */
    lastSyncTime: string,
    /**
     * 标签过滤模式
     */
    tagFilterMode: number,
    /**
     * 标签列表
     */
    tagList: string,
}

export interface IDebug {
    /**
     * 是否开启调试模式
     */
    isDebug: boolean,
    /**
     * 是否自动更新上次同步时间
     */
    isAutoUpdateTime: boolean
}

export interface IConfig {
    base: IBase,
    advanced: IAdvanced,
    filter: IFilter,
    debug: IDebug
}