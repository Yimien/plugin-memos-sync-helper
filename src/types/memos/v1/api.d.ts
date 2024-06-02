/**
 * API GetMemos 参数
 */
export interface IParamGetMemosWithFilters {
    creatorId ?: number,
    creatorUsername ?: string,
    rowStatus ?: string,
    pinned ?: boolean,
    tag ?: string,
    content ?: string,
    limit ?: number,
    offset ?: number
}

