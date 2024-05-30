import {SiYuanApiService} from "@/controllers/siyuan";
import {appendBlock} from "@/controllers/siyuan/api";
import {pluginConfigData} from "@/index";
import {debugMessage, isEmptyValue} from "@/utils";


export abstract class DataSaveBase {
    /**
     * 删除列表
     * @protected
     */
    protected deleteList : any[];
    /**
     * blockId : 嵌入内容（uid）
     * @protected
     */
    protected blockIdLinkEmbeddedContent : {[blockId: string]: string};

    /**
     * MemoId : BlockId
     * @protected
     */
    protected memoIdLinkBlockId: {[memosId: string]: string};

    /**
     * 更新删除列表
     */
    protected abstract updateDeleteList(): Promise<void>;

    /**
     * 排序新数据
     */
    protected abstract sortNewMemos(): Promise<void>;

    /**
     * 批量保存
     */
    protected abstract batchSave(): Promise<void>;

    /**
     * 批量处理引用
     */
    protected abstract handleRelations(): Promise<void>;

    /**
     * 删除旧数据
     */
    protected abstract deleteOldMemos(): Promise<void>;


    protected constructor() {
        this.blockIdLinkEmbeddedContent = {};
        this.memoIdLinkBlockId = {};
        this.deleteList = [];
    }


    async main() : Promise<void> {
        await this.initData();
        await this.saveData();
        await this.clearData();
    }


    // **************************************** 数据初始化 ****************************************


    /**
     * 初始化数据
     * @protected
     */
    protected async initData(): Promise<void> {
        // 初始化数据
        debugMessage(pluginConfigData.debug.isDebug, "正在初始化数据...");

        await this.initDict();

        debugMessage(pluginConfigData.debug.isDebug, "初始化完成！");

        // 更新删除列表
        debugMessage(pluginConfigData.debug.isDebug, "正在更新删除列表...");

        await this.updateDeleteList();

        debugMessage(pluginConfigData.debug.isDebug, "更新完成！");

        // 排序
        debugMessage(pluginConfigData.debug.isDebug, "正在排序新数据...");

        await this.sortNewMemos();

        debugMessage(pluginConfigData.debug.isDebug, "排序完成！");
    }


    /**
     * 初始化字典
     * @protected
     */
    protected async initDict(): Promise<void> {
        let response = await SiYuanApiService.getAttrByName("custom-memo-id");
        this.generateDict(response, this.memoIdLinkBlockId);
        debugMessage(pluginConfigData.debug.isDebug, "MemoId: BlockId", this.memoIdLinkBlockId);
    }


    /**
     * 生成字典
     * @param response
     * @param dict
     * @protected
     */
    protected generateDict(response: any[], dict: any) {
        if (!isEmptyValue(response) && response.length > 0) {
            for (let a of response) {
                dict[a.value] = a.block_id;
            }
        }
    }


    // **************************************** 数据保存 ****************************************


    /**
     * 保存数据
     * @protected
     */
    protected async saveData(): Promise<void> {
        // 批量写入
        debugMessage(pluginConfigData.debug.isDebug, "正在批量写入思源...");

        await this.batchSave();

        debugMessage(pluginConfigData.debug.isDebug, "写入完成！");

        // 批量处理引用
        debugMessage(pluginConfigData.debug.isDebug, "正在批量处理引用...");

        await this.handleRelations();

        debugMessage(pluginConfigData.debug.isDebug, "引用处理完成！");
    }


    /**
     * 处理引用
     * @param blockId
     * @param relatedBlockId
     * @param relatedMemoId
     * @protected
     */
    protected async handleRelation(blockId: string, relatedBlockId: string, relatedMemoId: string) {
        const content = `((${relatedBlockId} "@${relatedMemoId}"))`;
        await appendBlock("markdown", content, blockId);
    }


    // **************************************** 数据清理 ****************************************


    /**
     * 清理数据
     * @protected
     */
    protected async clearData(): Promise<void>{
        // 清理旧数据
        debugMessage(pluginConfigData.debug.isDebug, "正在清理旧数据...");

        await this.deleteOldMemos();

        debugMessage(pluginConfigData.debug.isDebug, "清理完成！");
    }
}

