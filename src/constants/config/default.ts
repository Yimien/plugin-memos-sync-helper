import {IConfig} from "@/types/config/default";

import {memosSortKey, syncPlanKey, versionKey} from "@/constants/components/select"

export const DEFAULT_CONFIG: IConfig = {
    base: {
        version: versionKey.stable,
        host: "",
        token: "",
        syncPlan: syncPlanKey.dailyNotes,
        notebook: "",
        docPath: "",
        resourceSavePath: "assets/memos/resources",
        memosSort: memosSortKey.asc
    },
    advanced: {
        isHandleHref: false,
        isHandleBacklinks: false,
        subjectPath: "",
        isHandleVideo: false,
        videoFormats: "mp4",
        isSuperLabel: false,
        labelName: "",
    },
    filter: {
        lastSyncTime: "2021-12-08 00:00:00",
    },
    debug: {
        isDebug: false,
        isAutoUpdateTime: false
    }
}