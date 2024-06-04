import {INewMemoV1, IResDataHandleRunV1} from "@/types/plugin/v1/handle";
import {INewMemoV2, IResDataHandleRunV2} from "@/types/plugin/v2/handle";

export interface IItemCondition {
    text: string,
    flag: boolean,
    value: any
}

export interface IContent {
    type: string | number,
    content: string
}

export type IResDataHandleRun = IResDataHandleRunV1 | IResDataHandleRunV2;

export type INewMemo = INewMemoV1 | INewMemoV2;

export type INewMemos = INewMemoV1[] | INewMemoV2[];

export type IContents = IContent[];