import { IOptions } from "@/types/components/item"

export enum versionKey {
    v1,
    v2
}

export const versionOptions : IOptions = [
    {
        key: versionKey.v1,
        text: "v0.21及以下"
    },
    {
        key: versionKey.v2,
        text: "v0.22及以上"
    }
]

export enum quoteHandleKey {
    blockRef,
    blockEmbed
}

export const quoteHandleOptions : IOptions = [
    {
        key: quoteHandleKey.blockRef,
        text: "引用块"
    },
    {
        key: quoteHandleKey.blockEmbed,
        text: "嵌入块"
    }
]

export enum labelMatchKey {
    all,
    lastLine
}

export const labelMatchOptions : IOptions = [
    {
        key: labelMatchKey.all,
        text: "全文匹配"
    },
    {
        key: labelMatchKey.lastLine,
        text: "最后一行"
    }
]

export enum resourceDownloadKey {
    uid
}

export const resourceDownloadOptions : IOptions = [
    {
        key: resourceDownloadKey.uid,
        text: "uid"
    }
]

export enum syncPlanKey {
    dailyNotes,
    singleDoc,
    oneDoc
}

export const syncPlanOptions : IOptions = [
    {
        key: syncPlanKey.dailyNotes,
        text: "同步至 Daily Notes"
    },
    {
        key: syncPlanKey.singleDoc,
        text: "一条记录一份文档"
    },
    {
        key: syncPlanKey.oneDoc,
        text: "同步至同一份文档中"
    }
]

export enum imageBlockLayoutKey {
    direction,
    transverse
}

export const imageBlockLayoutOptions : IOptions = [
    {
        key: imageBlockLayoutKey.direction,
        text: "纵向排列"
    },
    {
        key: imageBlockLayoutKey.transverse,
        text: "横向排列"
    }
]