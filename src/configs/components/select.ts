import { IOptions } from "@/types/components/item"

export enum VersionKey {
    v1,
    v2
}

export const versionOptions : IOptions = [
    {
        key: VersionKey.v1,
        text: "v0.21及以下"
    },
    {
        key: VersionKey.v2,
        text: "v0.22及以上"
    }
]

export enum QuoteHandleKey {
    blockRef,
    blockEmbed
}

export const quoteHandleOptions : IOptions = [
    {
        key: QuoteHandleKey.blockRef,
        text: "引用块"
    },
    {
        key: QuoteHandleKey.blockEmbed,
        text: "嵌入块"
    }
]

export enum LabelMatchKey {
    all,
    lastLine
}

export const labelMatchOptions : IOptions = [
    {
        key: LabelMatchKey.all,
        text: "全文匹配"
    },
    {
        key: LabelMatchKey.lastLine,
        text: "最后一行"
    }
]

export enum ResourceDownloadKey {
    uid
}

export const resourceDownloadOptions : IOptions = [
    {
        key: ResourceDownloadKey.uid,
        text: "uid"
    }
]

export enum SyncPlanKey {
    dailyNotes,
    singleDoc,
    oneDoc
}

export const syncPlanOptions : IOptions = [
    {
        key: SyncPlanKey.dailyNotes,
        text: "同步至 Daily Notes"
    },
    {
        key: SyncPlanKey.singleDoc,
        text: "一条记录一份文档"
    },
    {
        key: SyncPlanKey.oneDoc,
        text: "同步至同一份文档中"
    }
]

export enum ImageBlockLayoutKey {
    direction,
    transverse
}

export const imageBlockLayoutOptions : IOptions = [
    {
        key: ImageBlockLayoutKey.direction,
        text: "纵向排列"
    },
    {
        key: ImageBlockLayoutKey.transverse,
        text: "横向排列"
    }
]