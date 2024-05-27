import {IMemos, IRelation, IResource} from "@/types/memos/v2/index";


export interface IContent {
    type: string | number,
    content: string
}

export interface IResHandleMemos {
    memosId: string,
    title: string,
    contents: IContent[],
    resources: IResource[],
    memos: IMemos
}

export interface IResRun {
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
    old: IMemos[],
    /**
     * 用于批量写入
     */
    new: IResHandleMemos[]
}
