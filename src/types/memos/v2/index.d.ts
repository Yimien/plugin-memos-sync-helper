export interface IResourceV2 {
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

export interface IRelationV2 {
    memo: string,
    relatedMemo: string,
    type: string
}

/**
 * 评论
 */
export interface IReactionV2 {
    id: number,
    creator: string,
    contentId: string,
    reactionType: string
}

/**
 * Memos
 */
export interface IMemoV2 {
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
    resources: IResourceV2[],
    relations: IRelationV2[],
    reactions: IReactionV2[]
}
