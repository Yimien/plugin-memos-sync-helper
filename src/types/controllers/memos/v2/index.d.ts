import {ListMemos} from "@/controllers/memos/v2/api";

export interface IResListMemos {
    memos: any[],
    nextPageToken: string
}

export interface IResMemos {
    new: any[],
    update: any[]
}