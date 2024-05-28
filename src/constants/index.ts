export enum sync_status {
    /**
     * 等待同步
     */
    waiting,
    /**
     * 同步下载中
     */
    downloading,
    /**
     * 同步完成
     */
    completed
}

export enum contentsType {
    /**
     * 文本
     */
    text,
    /**
     * 嵌入内容
     */
    embedded,
    /**
     * 网址
     */
    href,
    /**
     * 标签
     */
    tag,
    /**
     * 双链
     */
    backlinks
}

export const MEMOS_ASSETS = "assets/memos";