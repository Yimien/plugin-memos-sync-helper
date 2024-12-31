import {IConfig} from "@/types/config/default";

import {memosSortKey, checkSyncMemosKey, syncPlanKey, tagFilterKey} from "@/constants/components/select"
import {DEFAULT_VERSION} from "@/constants/memos";

export const DEFAULT_CONFIG: IConfig = {
    base: {
        version: DEFAULT_VERSION,
        host: "",
        token: "",
        syncPlan: syncPlanKey.dailyNotes,
        notebook: "",
        docPath: "",
        resourceSavePath: "assets/memos/resources",
        memosSort: memosSortKey.asc,
        checkSyncMemos: checkSyncMemosKey.start
    },
    advanced: {
        isHandleHref: false,
        isHandleBacklinks: false,
        isHandleVideo: false,
        videoFormats: "mp4",
        isSuperLabel: false,
        labelName: "",
    },
    filter: {
        lastSyncTime: "2021-12-08 00:00:00",
        tagFilterMode: tagFilterKey.all,
        tagList: ""
    },
    debug: {
        isDebug: false,
        isAutoUpdateTime: false
    }
}