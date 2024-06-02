export interface IResourceV1 {
    id: number,
    name: string,
    uid: string,
    creatorId: number,
    createdTs: number,
    updatedTs: number,
    filename: string,
    externalLink: string,
    type: string,
    size: number
}

export interface IRelationV1 {
    memoId: number,
    relatedMemoId: number,
    type: string
}

export interface IMemoV1 {
    id: number,
    name: string,
    rowStatus: string,
    creatorId: number,
    createdTs: number,
    updatedTs: number,
    displayTs: number,
    content: string,
    visibility: string
    pinned: boolean,
    creatorName: string,
    creatorUsername: string,
    resourceList: IResourceV1[],
    relationList: IRelationV1[]
}