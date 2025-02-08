import {versionKey} from "@/constants/components/select";

export const API_VERSION = {
    V1: [versionKey.v0_21_0],
    V2: [versionKey.v0_22_0, versionKey.v0_22_1, versionKey.v0_23_0, versionKey.v0_24_0],
    V2_LabelFilter: [versionKey.v0_22_1, versionKey.v0_23_0],
    V2_DownloadResourceByName: [versionKey.v0_22_0],
    V2_MemosViewFull: [versionKey.v0_23_0],
    /**
     * `/api/v1/memos` 修改了输入参数
     */
    V2_Y2025_M02_D05: [versionKey.v0_24_0]
}

export const DEFAULT_VERSION = versionKey.v0_24_0;

export const RELATION_TYPE = {
    reference: "REFERENCE",
    comment: "COMMENT"
}