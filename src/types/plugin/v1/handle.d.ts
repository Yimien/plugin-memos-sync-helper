import {IMemoV1, IRelationV1, IResourceV1} from "@/types/memos/v1";
import {IContent} from "@/types/plugin";

export interface INewMemoV1{
    id: string,
    uid: string,
    title: string,
    updateTime: string,
    contents: IContent[], // 加上逗号
    memo: IMemoV1
}

export interface IResDataHandleRunV1{
    resources: IResourceV1[],
    relations: IRelationV1[],
    oldMemos: IMemoV1[],
    newMemos: INewMemosV1
}