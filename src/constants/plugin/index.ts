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
    backlinks,
    /**
     * 资源
     */
    resource
}

export enum deleteMode {
    blockId,
    path
}