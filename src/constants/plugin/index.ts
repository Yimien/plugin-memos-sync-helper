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

export const resourceType = {
    image: "image",
    video: "video"
}

export enum deleteMode {
    blockId,
    path
}

export const CUSTOM_MEMO_ID = "custom-memo-id";

export const CUSTOM_MEMO_UID = "custom-memo-uid";