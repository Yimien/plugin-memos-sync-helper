import {DataSaveBase} from "@/controllers/plugin/common/save";
import {IResHandleMemos, IResDataHandleRunV2, IContent} from "@/types/memos/v2/handle";
import {appendBlock, deleteBlock, setBlockAttrs, updateBlock} from "@/controllers/siyuan/api";
import {SiYuanApiService} from "@/controllers/siyuan";
import {contentsType} from "@/constants/plugin";
import {PluginServer} from "@/controllers/plugin";
import {debugMessage, isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";
import {IResdoOperations} from "@/types/siyuan/api";


export abstract class DataSave extends DataSaveBase {
    protected data : IResDataHandleRunV2;
    protected memoUidLinkBlockId: {[memosId: string]: string};

    abstract save(newMemo: IResHandleMemos): Promise<void>;

    constructor(data: IResDataHandleRunV2) {
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
        debugMessage(pluginConfigData.debug.isDebug, "删除列表", this.deleteList);
    }


    /**
     * 排序
     * @protected
     */
    protected async sortNewMemos() : Promise<void> {
        PluginServer.sortMemos(this.data.new);
    }


    // **************************************** 数据保存 ****************************************


    protected async saveData() {
        await super.saveData();

        // 批量处理嵌入内容
        debugMessage(pluginConfigData.debug.isDebug, "正在批量处理嵌入内容...");

        await this.handleEmbeddedContents();

        debugMessage(pluginConfigData.debug.isDebug, "嵌入内容处理完成！");
    }


    protected async batchSave() : Promise<void> {
        for (let newMemo of this.data.new) {
            await this.save(newMemo);
        }
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
    protected async setCustomAttrs(blockId: string, newMemo: IResHandleMemos) {
        let attrs = {
            "custom-memo-id": newMemo.id,
            "custom-memo-uid": newMemo.uid
        }
        await setBlockAttrs(blockId, attrs);
    }


    /**
     * 更新字典
     * @param blockId
     * @param newMemo
     * @protected
     */
    protected async updateDict(blockId: string, newMemo: IResHandleMemos) {
        this.memoIdLinkBlockId[newMemo.id] = blockId;
        this.memoUidLinkBlockId[newMemo.uid] = blockId;
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


    // **************************************** 数据清理 ****************************************


    /**
     * 删除旧数据
     */
    async deleteOldMemos(): Promise<void> {
        for (let blockId of this.deleteList) {
            let r = await deleteBlock(blockId);
            debugMessage(pluginConfigData.debug.isDebug, "删除结果", r);
        }
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