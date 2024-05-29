import {IOptions} from "@/types/components/item"

export enum versionKey {
    v1,
    v2
}

export const VERSION_OPTIONS: IOptions = [
    {
        key: versionKey.v1,
        text: "v0.21及以下"
    },
    {
        key: versionKey.v2,
        text: "v0.22及以上"
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
