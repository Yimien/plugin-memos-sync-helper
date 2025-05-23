import {IOptions} from "@/types/components/item"

export enum versionKey {
    v0_21_0,
    v0_22_0,
    v0_22_1,
    v0_23_0,
    v0_24_0
}

export const VERSION_OPTIONS: IOptions = [
    {
        key: versionKey.v0_21_0,
        text: "v0.21.0 及以下"
    },
    {
        key: versionKey.v0_22_0,
        text: "v0.22.0"
    },
    {
        key: versionKey.v0_22_1,
        text: "v0.22.1~0.22.5"
    },
    {
        key: versionKey.v0_23_0,
        text: "v0.23.0"
    },
    {
        key: versionKey.v0_24_0,
        text: "v0.24.0 及以上"
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

export enum checkSyncMemosKey{
    /**
     * 禁止检查可同步的数据
     */
    no,
    /**
     * 启动后检查可同步的数据
     */
    start
}

export const CHECK_SYNC_MEMOS_OPTIONS: IOptions = [
    {
        key: checkSyncMemosKey.start,
        text: "启动后检查可同步的数据"
    },
    {
        key: checkSyncMemosKey.no,
        text: "禁止检查可同步的数据"
    }
]

export enum tagFilterKey {
    /**
     * 同步所有数据
     */
    all,
    /**
     * 仅同步无标签的数据
     */
    syncNoTag,
    /**
     * 不同步无标签的数据
     */
    notSyncNoTag,
    /**
     * 仅同步指定标签的数据
     */
    syncSpecTag,
    /**
     * 不同步指定标签的数据
     */
    notSyncSpecTag,
    /**
     * 同步指定标签及无标签的数据
     */
    syncSpecTagAndNoTag,
    /**
     * 不同步指定标签及无标签的数据
     */
    notSyncSpecTagAndNoTag
}

export const TAG_FILTER_OPTIONS: IOptions = [
    {
        key: tagFilterKey.all,
        text: "同步所有数据"
    },
    {
        key: tagFilterKey.syncNoTag,
        text: "仅同步无标签的数据"
    },
    {
        key: tagFilterKey.notSyncNoTag,
        text: "不同步无标签的数据"
    },
    {
        key: tagFilterKey.syncSpecTag,
        text: "仅同步指定标签的数据"
    },
    {
        key: tagFilterKey.notSyncSpecTag,
        text: "不同步指定标签的数据"
    },
    {
        key: tagFilterKey.syncSpecTagAndNoTag,
        text: "同步指定标签及无标签的数据"
    },
    {
        key: tagFilterKey.notSyncSpecTagAndNoTag,
        text: "不同步指定标签及无标签的数据"
    }
]
