import {IConfig} from "@/types/config";

import {
    VersionKey, SyncPlanKey, ResourceDownloadKey, QuoteHandleKey, LabelMatchKey, ImageBlockLayoutKey
} from "@/configs/components/select"

export const DEFAULT_CONFIG:IConfig = {
    general: {
        version: VersionKey.v2,
        host: "",
        token: "",
        lastSyncTime: "",
        syncPlan: SyncPlanKey.dailyNotes,
        notebook: "",
        docPath: ""
    },
    advanced: {
        isLinks: false,
        subjectPath: "",
        isLabelTop: false,
        labelName: "",
        quoteHandle: QuoteHandleKey.blockRef,
        imageBlockLayout: ImageBlockLayoutKey.direction,
        isHref: false,
        resourceDownload: ResourceDownloadKey.uid,
        isImproveVideoStyle: false,
        videoFormats: "mp4"
    },
    old: {
        labelMatch: LabelMatchKey.lastLine
    },
    debug: {
        isDebug: false,
        isAutoUpdateTime: false
    }
}