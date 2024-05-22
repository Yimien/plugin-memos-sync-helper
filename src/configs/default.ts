import {IConfig} from "@/types/config";

import {
    versionKey, syncPlanKey, resourceDownloadKey, quoteHandleKey, labelMatchKey, imageBlockLayoutKey
} from "@/configs/components/input"

export const DEFAULT_CONFIG:IConfig = {
    general: {
        version: versionKey.v2,
        host: "",
        token: "",
        syncPlan: syncPlanKey.dailyNotes,
        notebook: "",
        docPath: ""
    },
    advanced: {
        lastSyncTime: "",
        isLinks: false,
        subjectPath: "",
        isLabelTop: false,
        labelName: "",
        quoteHandle: quoteHandleKey.blockRef,
        imageBlockLayout: imageBlockLayoutKey.direction,
        isHref: false,
        resourceDownload: resourceDownloadKey.uid,
        isImproveVideoStyle: false,
        videoFormats: "mp4"
    },
    old: {
        labelMatch: labelMatchKey.lastLine
    },
    debug: {
        isDebug: false,
        isAutoUpdateTime: false
    }
}