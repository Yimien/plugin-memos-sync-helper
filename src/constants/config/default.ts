import {IConfig} from "@/types/config/default";

import {syncPlanKey, versionKey} from "@/constants/components/select"

export const DEFAULT_CONFIG: IConfig = {
    base: {
        version: versionKey.v2,
        host: "",
        token: "",
        syncPlan: syncPlanKey.dailyNotes,
        notebook: "",
        docPath: ""
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