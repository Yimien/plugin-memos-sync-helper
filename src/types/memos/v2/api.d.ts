/**
 * 列出带有分页和过滤器的备忘录
 */
export interface IResListMemos {
    memos: IMemoV2[],
    nextPageToken: string
}