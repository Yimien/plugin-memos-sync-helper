import {pluginConfigData} from "@/index";
import {GetAuthStatus, ListMemos} from "@/controllers/memos/v2/api"
import {debugMessage, isEmptyValue} from "@/utils";
import {timeIsEarly, timeIsLater, toChinaTime} from "@/utils/misc/time";
import {IResGetMemos} from "@/types/memos";


export class MemosService {
    private username: string;

    /**
     * 初始化数据
     * @private
     */
    public async initData() {
        const userData = await this.getUserData();
        this.username = userData.name;
    }

    /**
     * 获取用户数据
     */
    public async getUserData() {
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
    public async checkAccessToken() {
        const userData = await GetAuthStatus();
        return !isEmptyValue(userData);
    }

    /**
     * 检查新数据
     */
    public async checkNew() {
        const memos = await this.getAllMemos();
        return memos.length > 0;
    }


    /**
     * 获取 Memos 数据
     */
    public async getMemos(): Promise<IResGetMemos> {
        let allMemos = await this.getAllMemos();

        debugMessage(pluginConfigData.debug.isDebug, "正在处理 Memos 数据...");

        const lastSyncTime = pluginConfigData.base.lastSyncTime; // 上次同步时间

        let memosCreatedBeforeLastSync = allMemos.filter(
            memo => timeIsEarly(toChinaTime(memo.createTime), lastSyncTime)
        );

        let result: IResGetMemos = {
            new: allMemos,
            old: memosCreatedBeforeLastSync
        };

        debugMessage(pluginConfigData.debug.isDebug, "处理结果", result);

        return result;
    }

    /**
     * 获取 Memos 数据
     */
    public async getAllMemos() {
        debugMessage(pluginConfigData.debug.isDebug, "正在获取 Memos 数据...");

        await this.initData();

        const lastSyncTime = pluginConfigData.base.lastSyncTime; // 上次同步时间
        const pageSize: number = 200; // 每页最大条数
        let pageToken = undefined;

        let allMemos = [];

        let filters = [
            `creator == "${this.username}"`
        ];

        while (true) {
            // 调用 ListMemos 函数获取一页数据
            const resData = await ListMemos(pageSize, pageToken, filters);

            // 将更新时间大于等于 lastSyncTime 的数据添加到 memos 列表中
            const memos = resData.memos.filter(memo => timeIsLater(toChinaTime(memo.updateTime), lastSyncTime));
            allMemos.push(...memos);

            // 检查当前页是否还有更新时间大于等于 lastSyncTime 的数据，如果没有则退出循环
            if (memos.length < resData.memos.length || !resData.nextPageToken) {
                break;
            }

            // 更新 pageToken 以获取下一页数据
            pageToken = resData.nextPageToken;
        }

        debugMessage(pluginConfigData.debug.isDebug, "获取结果", allMemos);

        return allMemos;
    }
}
