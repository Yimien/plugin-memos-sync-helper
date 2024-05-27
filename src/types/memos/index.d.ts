import {IMemos, IRelation, IResource} from "@/types/memos/v2";


// **************************************** 方法响应 ****************************************


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
