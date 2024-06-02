import {IMemoV2, IRelationV2, IResourceV2} from "@/types/memos/v2";
import {IContent} from "@/types/plugin";


export interface INewMemoV2{
    id: string,
    uid: string,
    title: string,
    updateTime: string,
    contents: IContent[], // 加上逗号
    memo: IMemoV2
}

export interface IResDataHandleRunV2 {
    resources: IResourceV2[],
    relations: IRelationV2[],
    oldMemos: IMemoV2[],
    newMemos: INewMemoV2[]
}
