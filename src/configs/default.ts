import {IConfig} from "@/types/config";

import {
    VersionKey, SyncPlanKey, ResourceDownloadKey, QuoteHandleKey, LabelMatchKey, ImageBlockLayoutKey
} from "@/configs/components/select"

export const DEFAULT_CONFIG:IConfig = {
    base: {
        version: VersionKey.v2,
        host: "",
        token: "",
        lastSyncTime: "2021/12/08 00:00:00",
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
        isImproveVideoStyle: false,
        videoFormats: "mp4"
    },
    special: {
        labelMatch: LabelMatchKey.lastLine,
        resourceDownload: ResourceDownloadKey.uid,
    },
    debug: {
        isDebug: false,
        isAutoUpdateTime: false
    }
}