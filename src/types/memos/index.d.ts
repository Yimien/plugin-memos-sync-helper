import {IMemoV1, IRelationV1, IResourceV1} from "@/types/memos/v1";
import {IMemoV2, IRelationV2, IResourceV2} from "@/types/memos/v2";


export interface IResGetMemos {
    new: any[],
    old: any[]
}

export type IResource = IResourceV1 | IResourceV2;

export type IResources = IResourceV1[] | IResourceV2[];

export type IRelation = IRelationV1 | IRelationV2;

export type IRelations = IRelationV1[] | IRelationV2[];

export type IMemo = IMemoV1 | IMemoV2;

export type IMemos = IMemoV1[] | IMemoV2[];

