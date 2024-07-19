import {pluginConfigData} from "@/index";
import {DownloadResourceByName, GetAuthStatus, GetResourceBinary, ListMemos} from "@/controllers/memos/v2/api"
import {debugMessage, hasCommonElements, isEmptyValue} from "@/utils";
import {toChinaTime, formatDateTime,} from "@/utils/misc/time";
import {IResGetMemos} from "@/types/memos";
import moment from "moment";
import {IMemoV2, IResourceV2} from "@/types/memos/v2";
import {tagFilterKey, versionKey} from "@/constants/components/select";


export class MemosApiServiceV2 {
    private static username: string;

    /**
     * 初始化数据
     * @private
     */
    private static async initData() {
        const userData = await this.getUserData();
        this.username = userData.name;
    }

    private static async tagFilter(memos: IMemoV2[])  {
        const tagFilterMode = pluginConfigData.filter.tagFilterMode;

        // 同步所有数据
        if (tagFilterMode === tagFilterKey.all) {
            return memos;
        }

        // 仅同步无标签的数据
        if (tagFilterMode === tagFilterKey.syncNoTag) {
            console.log("仅同步无标签的数据");
            return memos.filter(memo => memo.property.tags.length === 0)
        }

        // 不同步无标签的数据
        if (tagFilterMode === tagFilterKey.notSyncNoTag) {
            console.log("不同步无标签的数据");
            return memos.filter(memo => memo.property.tags.length > 0)
        }

        let tagListString = pluginConfigData.filter.tagList;
        let tags = tagListString.split(";");

        // 仅同步指定标签的数据
        if (tagFilterMode === tagFilterKey.syncSpecTag) {
            console.log("仅同步指定标签的数据");
            return memos.filter(memo => hasCommonElements(memo.property.tags, tags))
        }

        // 不同步指定标签的数据
        if (tagFilterMode === tagFilterKey.notSyncSpecTag) {
            console.log("不同步指定标签的数据");
            return memos.filter(memo => !hasCommonElements(memo.property.tags, tags))
        }

        // 同步指定标签及无标签的数据
        if (tagFilterMode === tagFilterKey.syncSpecTagAndNoTag) {
            console.log("同步指定标签及无标签的数据");
            return memos.filter(memo => hasCommonElements(memo.property.tags, tags) || memo.property.tags.length === 0)
        }

        // 不同步指定标签及无标签的数据
        if (tagFilterMode === tagFilterKey.notSyncSpecTagAndNoTag) {
            console.log("不同步指定标签及无标签的数据");
            return memos.filter(memo => !hasCommonElements(memo.property.tags, tags) && memo.property.tags.length > 0)
        }

        return memos;
    }

    /**
     * 获取 Memos 数据
     */
    private static async getAllMemos() {
        debugMessage(pluginConfigData.debug.isDebug, "正在获取 Memos 数据...");

        await this.initData();

        const lastSyncTime = pluginConfigData.filter.lastSyncTime; // 上次同步时间
        const pageSize: number = 200; // 每页最大条数
        let pageToken = undefined;

        let allMemos = [];

        let filters = [
            `creator == "${this.username}"`
        ];

        while (true) {
            // 调用 ListMemos 函数获取一页数据
            const resData = await ListMemos(pageSize, pageToken, filters);

            // 将更新时间晚于等于 lastSyncTime 的数据添加到 memos 列表中
            const memos = resData.memos.filter(
                memo => moment(toChinaTime(memo.updateTime)).isSameOrAfter(formatDateTime(lastSyncTime))
            );
            allMemos.push(...memos);

            // 检查当前页是否还有更新时间大于等于 lastSyncTime 的数据，如果没有则退出循环
            if (memos.length < resData.memos.length || !resData.nextPageToken) {
                break;
            }

            // 更新 pageToken 以获取下一页数据
            pageToken = resData.nextPageToken;
        }

        // 标签过滤
        if (pluginConfigData.base.version === versionKey.stable) {
            allMemos = await MemosApiServiceV2.tagFilter(allMemos);
        }

        debugMessage(pluginConfigData.debug.isDebug, "获取结果", allMemos);

        return allMemos;
    }


    // **************************************** export ****************************************


    /**
     * 获取用户数据
     */
    static async getUserData() {
        const userData = await GetAuthStatus();
        return {
            /**
             * 用户名称
             */
            name: userData.name
        }
    }

    /**
     * 授权校验
     */
    static async checkAccessToken() {
        const userData = await GetAuthStatus();
        return !isEmptyValue(userData);
    }

    /**
     * 检查新数据
     */
    static async checkNew() {
        const memos = await this.getAllMemos();
        return memos.length > 0;
    }

    /**
     * 获取 Memos 数据
     */
    static async getMemos(): Promise<IResGetMemos> {
        let allMemos = await this.getAllMemos();

        debugMessage(pluginConfigData.debug.isDebug, "正在整理 Memos 数据...");

        const lastSyncTime = pluginConfigData.filter.lastSyncTime; // 上次同步时间

        let memosCreatedBeforeLastSync = allMemos.filter(
            memo => moment(toChinaTime(memo.createTime)).isBefore(formatDateTime(lastSyncTime))
        );

        let result: IResGetMemos = {
            new: allMemos,
            old: memosCreatedBeforeLastSync
        };

        debugMessage(pluginConfigData.debug.isDebug, "整理结果", result);

        return result;
    }

    static async downloadResource(resource: IResourceV2) {
        if (pluginConfigData.base.version === versionKey.v0_22_0) {
            return await DownloadResourceByName(resource.name);
        } else {
            return await GetResourceBinary(resource.name, resource.filename);
        }
    }
}
