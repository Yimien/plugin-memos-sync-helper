import {IMemo, IRelation, IResource} from "@/types/memos/v2/index";


export interface IContent {
    type: string | number,
    content: string
}

export interface IResHandleMemo {
    id: string,
    uid: string,
    title: string,
    contents: IContent[],
    memos: IMemo
}

export interface IResDataHandleRun {
    /**
     * 用于批量下载
     */
    resources: IResource[],
    /**
     * 用于批量关联
     */
    relations: IRelation[],
    /**
     * 用于批量删除
     */
    old: IMemo[],
    /**
     * 用于批量写入
     */
    new: IResHandleMemo[]
}
