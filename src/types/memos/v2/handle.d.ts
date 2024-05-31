import {IMemo, IRelation, IResource} from "@/types/memos/v2/index";
import {INewMemoBase, IResHandleDataBase, IContent} from "@/types/memos";


export interface INewMemoV2 extends INewMemoBase {
    id: string,
    uid: string,
    title: string,
    updateTime: string,
    contents: IContent[], // 加上逗号
    memo: IMemo
}

export type INewMemosV2 = INewMemoV2[];


export interface IResHandleDataV2 extends IResHandleDataBase {
    resources: IResource[],
    relations: IRelation[],
    oldMemos: IMemo[],
    newMemos: INewMemosV2
}
