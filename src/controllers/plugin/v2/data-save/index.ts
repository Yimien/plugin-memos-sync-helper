import {DataSaveBase} from "@/controllers/plugin/common/save";
import {IResHandleMemo, IResDataHandleRun, IContent} from "@/types/memos/v2/handle";
import {appendBlock, setBlockAttrs, updateBlock} from "@/controllers/siyuan/api";
import {SiYuanApiService} from "@/controllers/siyuan";
import {contentsType, deleteMode} from "@/constants/plugin";
import {debugMessage, isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";
import {IResdoOperations} from "@/types/siyuan/api";


export abstract class DataSave extends DataSaveBase {
    protected data : IResDataHandleRun;
    protected memoUidLinkBlockId: {[memosId: string]: string};

    protected constructor(data: IResDataHandleRun) {
        super();
        this.data = data;
        this.memoUidLinkBlockId = {};
    }


    // **************************************** 数据初始化 ****************************************


    /**
     * 初始化数据
     * @protected
     */
    protected async initDict() : Promise<void> {
        await super.initDict();

        let response = await SiYuanApiService.getAttrByName("custom-memo-uid");
        this.generateDict(response, this.memoUidLinkBlockId);
        debugMessage(pluginConfigData.debug.isDebug, "MemoUid: BlockId", this.memoUidLinkBlockId);
    }


    protected async updateDeleteList() {
        if (this.nowDeleteMode === deleteMode.blockId) {
             this.updateDeleteListById();
        } else if (this.nowDeleteMode === deleteMode.path) {
             await this.updateDeleteListByPath();
        }
        debugMessage(pluginConfigData.debug.isDebug, "删除列表", this.deleteList);
    }


    /**
     * 根据 ID 更新删除列表
     * @protected
     */
    protected updateDeleteListById() {
        for (let memo of this.data.old) {
            let memoId = this.getMemoId(memo.name);
            let blockId = this.memoIdLinkBlockId[memoId];
            if (isEmptyValue(blockId)) {
                debugMessage(pluginConfigData.debug.isDebug, "未找到对应删除数据", memoId);
            } else {
                debugMessage(pluginConfigData.debug.isDebug, "已找到对应删除数据", memoId);
                this.deleteList.push(blockId);
            }
        }
    }


    /**
     * 根据路径更新删除列表
     * @protected
     */
    protected async updateDeleteListByPath() {
        for (let memo of this.data.old) {
            let memoId = this.getMemoId(memo.name);
            let response = await SiYuanApiService.getAttributes("custom-memo-id", memoId);
            if (isEmptyValue(response) || response.length === 0) {
                debugMessage(pluginConfigData.debug.isDebug, "未找到对应删除数据", memoId);
            } else {
                debugMessage(pluginConfigData.debug.isDebug, "已找到对应删除数据", memoId);
                let path = response[0].path;
                this.deleteList.push(path);
            }
        }
    }


    // **************************************** 数据保存 ****************************************


    protected async saveData() {
        await super.saveData();

        // 批量处理嵌入内容
        debugMessage(pluginConfigData.debug.isDebug, "正在批量处理嵌入内容...");

        await this.handleEmbeddedContents();

        debugMessage(pluginConfigData.debug.isDebug, "嵌入内容处理完成！");
    }


    /**
     * 批量写入内容
     * @param titleBlockId
     * @param contents
     * @protected
     */
    protected async saveContents(titleBlockId: string, contents: IContent[]) : Promise<void> {
        for (let c of contents) {
            let response: IResdoOperations[] = await appendBlock("markdown", c.content, titleBlockId);
            if (!isEmptyValue(response) && c.type === contentsType.embedded) {
                let blockId = SiYuanApiService.getBlockId(response);
                this.blockIdLinkEmbeddedContent[blockId] = c.content;
            }
        }
    }


    /**
     * 设置块属性
     * @param blockId
     * @param newMemo
     * @protected
     */
    protected async setCustomAttrs(blockId: string, newMemo: IResHandleMemo) {
        debugMessage(pluginConfigData.debug.isDebug, `正在设置块属性...`);

        let attrs = {
            "custom-memo-id": newMemo.id,
            "custom-memo-uid": newMemo.uid
        }
        await setBlockAttrs(blockId, attrs);

        debugMessage(pluginConfigData.debug.isDebug, `设置完成！`);
    }


    /**
     * 更新字典
     * @param blockId
     * @param newMemo
     * @protected
     */
    protected async updateDict(blockId: string, newMemo: IResHandleMemo) {
        debugMessage(pluginConfigData.debug.isDebug, `正在更新字典...`);

        this.memoIdLinkBlockId[newMemo.id] = blockId;
        this.memoUidLinkBlockId[newMemo.uid] = blockId;

        debugMessage(pluginConfigData.debug.isDebug, `更新完成！`);
    }


    protected async handleRelations() : Promise<void> {
        for (let relation of this.data.relations) {
            let memoId = this.getMemoId(relation.memo);
            let relatedMemoId = this.getMemoId(relation.relatedMemo);

            let blockId = this.memoIdLinkBlockId[memoId];
            let relatedBlockId = this.memoIdLinkBlockId[relatedMemoId];

            await this.handleRelation(blockId, relatedBlockId, relatedMemoId);
        }
    }


    /**
     * 批量处理嵌入内容
     * @protected
     */
    protected async handleEmbeddedContents() : Promise<void> {
        for (let blockId in this.blockIdLinkEmbeddedContent) {
            let uid = this.blockIdLinkEmbeddedContent[blockId];
            let relatedBlockId = this.memoUidLinkBlockId[uid];
            await this.handleEmbeddedContent(blockId, relatedBlockId);
        }
    }


    /**
     * 处理嵌入内容
     * @param blockId
     * @param relatedBlockId
     * @protected
     */
    protected async handleEmbeddedContent(blockId: string, relatedBlockId: string) : Promise<void> {
        let content = `{{select * from blocks where id="${relatedBlockId}"}}`;
        await updateBlock("markdown", content, blockId);
    }

    // **************************************** 其它 ****************************************


    /**
     * 获取 Memo Id & Uid
     * @param name
     * @protected
     */
    protected getMemoId(name: string) {
        return name.split('/').pop();
    }
}