import {IConfig} from "@/types/config/default";

import {
    imageBlockLayoutKey,
    labelMatchKey,
    quoteHandleKey,
    resourceDownloadKey,
    syncPlanKey,
    versionKey
} from "@/constants/components/select"

export const DEFAULT_CONFIG: IConfig = {
    base: {
        version: versionKey.v2,
        host: "",
        token: "",
        lastSyncTime: "2021-12-08 00:00:00",
        syncPlan: syncPlanKey.dailyNotes,
        notebook: "",
        docPath: ""
    },
    advanced: {
        labelMatch: labelMatchKey.lastLine,
        isLinks: false,
        subjectPath: "",
        isLabelTop: false,
        labelName: "",
        quoteHandle: quoteHandleKey.blockRef,
        imageBlockLayout: imageBlockLayoutKey.direction,
        isHref: false,
        isImproveVideoStyle: false,
        videoFormats: "mp4"
    },
    special: {
        resourceDownload: resourceDownloadKey.uid,
    },
    debug: {
        isDebug: false,
        isAutoUpdateTime: false
    }
}