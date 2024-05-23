export interface IGeneral {
    version: string | number,
    host: string,
    token: string,
    lastSyncTime: string,
    syncPlan: string | number,
    notebook: string,
    docPath: string
}

export interface IAdvanced {
    isLinks: boolean,
    subjectPath: string,
    isLabelTop: boolean,
    labelName: string,
    quoteHandle: string | number,
    imageBlockLayout: string | number,
    isHref: boolean,
    resourceDownload: string | number,
    isImproveVideoStyle: boolean,
    videoFormats: string
}

export interface IOld {
    labelMatch: string | number
}

export interface IDebug {
    isDebug: boolean,
    isAutoUpdateTime: boolean
}

export interface IConfig {
    general: IGeneral,
    advanced: IAdvanced,
    old: IOld,
    debug: IDebug
}