import {IOptions} from "@/types/components/item"

export enum versionKey {
    v1,
    stable,
    v0_22_0
}

export const VERSION_OPTIONS: IOptions = [
    {
        key: versionKey.v1,
        text: "v0.21.0 及以下"
    },
    {
        key: versionKey.v0_22_0,
        text: "v0.22.0"
    },
    {
        key: versionKey.stable,
        text: "v0.22.1 及以上"
    }
]

export enum syncPlanKey {
    dailyNotes,
    singleDoc,
    sameDoc
}

export const SYNC_PLAN_OPTIONS: IOptions = [
    {
        key: syncPlanKey.dailyNotes,
        text: "同步至 Daily Notes"
    },
    {
        key: syncPlanKey.singleDoc,
        text: "同步为单独的文档"
    },
    {
        key: syncPlanKey.sameDoc,
        text: "同步至同一份文档"
    }
]

export enum memosSortKey{
    /**
     * 降序
     */
    desc,
    /**
     * 升序
     */
    asc
}

export const  MEMOS_SORT_OPTIONS: IOptions = [
    {
        key: memosSortKey.desc,
        text: "降序"
    },
    {
        key: memosSortKey.asc,
        text: "升序"
    }
]
