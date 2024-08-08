import {downloadResourceByUid, GetCurrentUser, GetMemosWithFilters} from "@/controllers/memos/v1/api";
import {debugMessage, isEmptyValue} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";
import moment from "moment/moment";
import {formatDateTime} from "@/utils/misc/time";


export class MemosApiServiceV1 {

    private static async getAllMemos() {
        debugMessage(pluginConfigData.debug.isDebug, "正在获取 Memos 数据...");

        const lastSyncTime = pluginConfigData.filter.lastSyncTime; // 上次同步时间
        const limit: number = 10; // 每页最大条数
        let offset = 0;

        let allMemos = [];

        while (true) {
            let filters = {
                offset: offset,
                limit: limit
            };

            // 调用 ListMemos 函数获取一页数据
            const resData = await GetMemosWithFilters(filters);

            debugMessage(pluginConfigData.debug.isDebug, "resData", resData);

            // 将更新时间晚于等于 lastSyncTime 的数据添加到 memos 列表中
            const memos = resData.filter(
                // memo => moment(formatDate(memo.updatedTs)).isSameOrAfter(formatDateTime(lastSyncTime))
                memo => moment(formatDateTime(memo.updatedTs)).isSameOrAfter(formatDateTime(lastSyncTime))
            );
            allMemos.push(...memos);

            debugMessage(pluginConfigData.debug.isDebug, "memos", memos);

            // 检查当前页是否还有数据，如果没有则退出循环
            if (resData.length === 0) {
                break;
            }

            // 更新 offset 以获取下一页数据
            offset += limit;
        }

        debugMessage(pluginConfigData.debug.isDebug, "获取结果", allMemos);

        return allMemos;
    }


    // **************************************** export ****************************************


    /**
     * 检查 Access Token
     */
    static async checkAccessToken() {
        const userData = await GetCurrentUser();
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
            memo => moment(formatDateTime(memo.createdTs)).isBefore(formatDateTime(lastSyncTime))
        );

        let result: IResGetMemos = {
            new: allMemos,
            old: memosCreatedBeforeLastSync
        };

        debugMessage(pluginConfigData.debug.isDebug, "整理结果", result);

        return result;
    }

    static async downloadResource(uid: string | number) {
        return await downloadResourceByUid(uid);
    }
}