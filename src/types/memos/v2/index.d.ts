/**
 * 资源
 */
export interface IResource {
    name: string,
    uid: string,
    createTime: string,
    filename: string,
    content: string,
    externalLink: string,
    type: string,
    size: string,
    memo: string
}

/**
 * 引用
 */
export interface IRelation {
    memo: string,
    relatedMemo: string,
    type: string
}

/**
 * 评论
 */
export interface IReactions {
    id: number,
    creator: string,
    contentId: string,
    reactionType: string
}

/**
 * Memos
 */
export interface IMemo {
    name: string,
    uid: string,
    rowStatus: string,
    creator: string,
    createTime: string,
    updateTime: string,
    displayTime: string,
    content: string,
    nodes: any,
    visibility: string,
    tags: any,
    pinned: boolean,
    parentId?: number,
    resources: IResource[],
    relations: IRelation[],
    reactions: IReactions[]
}

export type IMemos = IMemo[];

/**
 * 列出带有分页和过滤器的备忘录
 */
export interface IResListMemos {
    memos: IMemo[],
    nextPageToken: string
}
