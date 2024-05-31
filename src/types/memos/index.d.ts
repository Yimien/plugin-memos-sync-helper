import {IContent} from "@/types/memos/v2/handle";


export interface IResGetMemos {
    /**
     * 用于新增的数据
     */
    new: any[],

    /**
     * 用于删除的数据
     */
    old: any[]
}

export interface IContent {
    type: string | number,
    content: string
}

export interface INewMemoBase {
    id: string,
    uid: string,
    title: string,
    updateTime: string,
    contents: IContent[], // 加上逗号
    memo: any[]
}


export type INewMemosBase = INewMemoBase[];

export interface IResHandleDataBase {
    resources: any[],
    relations: any[],
    oldMemos: any[],
    newMemos: INewMemosBase
}
