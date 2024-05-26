export interface IBase {
    /**
     * Memos 版本号
     */
    version: string | number,
    /**
     * 服务器地址
     */
    host: string,
    /**
     * 授权码
     */
    token: string,
    /**
     * 上次同步时间
     */
    lastSyncTime: string,
    /**
     * 同步方案
     */
    syncPlan: string | number,
    /**
     * 笔记本
     */
    notebook: string,
    /**
     * 文档路径
     */
    docPath: string
}

export interface IAdvanced {
    /**
     * 是否识别双链符号
     */
    isLinks: boolean,
    /**
     * 主题路径
     */
    subjectPath: string,
    /**
     * 是否增加统一的上级标签
     */
    isLabelTop: boolean,
    /**
     * 上级标签名称
     */
    labelName: string,
    /**
     * 引用处理方案
     */
    quoteHandle: string | number,
    /**
     * 图片处理方案
     */
    imageBlockLayout: string | number,
    /**
     * 是否识别超链接
     */
    isHref: boolean,
    /**
     * 是否优化视频资源
     */
    isImproveVideoStyle: boolean,
    /**
     * 支持优化的视频格式
     */
    videoFormats: string
}

export interface ISpecial {
    /**
     * 标签匹配范围
     */
    labelMatch: string | number,
    /**
     * 资源下载方案
     */
    resourceDownload: string | number,
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
    special: ISpecial,
    debug: IDebug
}