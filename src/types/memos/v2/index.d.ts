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

export interface IRelations {
    memo: string,
    relatedMemo: string,
    type: string
}

export interface IReactions {
    id: number,
    creator: string,
    contentId: string,
    reactionType: string
}

export interface IMemos {
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
    relations: IRelations[],
    reactions: IReactions[]
}

export interface IResListMemos {
    memos: IMemos[],
    nextPageToken: string
}
