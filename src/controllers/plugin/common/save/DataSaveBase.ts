import {SiYuanApiService} from "@/controllers/siyuan";
import {
    appendBlock,
    createDocWithMd,
    deleteBlock,
    getChildBlocks,
    prependBlock,
    removeDoc, setBlockAttrs, updateBlock
} from "@/controllers/siyuan/api";
import {pluginConfigData} from "@/index";
import {debugMessage, isEmptyValue} from "@/utils";
import {contentsType, CUSTOM_MEMO_ID, CUSTOM_MEMO_UID, deleteMode} from "@/constants/plugin";
import {IContent, INewMemo} from "@/types/plugin";
import {IResdoOperations, IResGetChildBlock} from "@/types/siyuan/api";
import {memosSortKey, syncPlanKey} from "@/constants/components/select";
import {DataHandleBase} from "@/controllers/plugin/common/handle/DataHandleBase";


export abstract class DataSaveBase {


    /**
     * MemoId : BlockId
     * @protected
     */
    protected memoIdLinkBlockId: {[memoId: string]: string};

    /**
     * MemoUid : BlockId
     * @protected
     */
    protected memoUidLinkBlockId: {[memosId: string]: string};

    /**
     * BlockId : 嵌入内容（uid）
     * @protected
     */
    protected blockIdLinkEmbeddedContent: {};

    /**
     * 处理后的数据
     * @protected
     */
    protected data: any;

    /**
     * 删除列表
     * @protected
     */
    protected deleteList : any[];

    /**
     * 清理模式
     * @protected
     */
    protected nowDeleteMode: string | number;


    protected constructor(data: any) {
        this.memoIdLinkBlockId = {};
        this.memoUidLinkBlockId = {};
        this.blockIdLinkEmbeddedContent = {};
        this.data = data;
        this.deleteList = [];
        if (pluginConfigData.base.syncPlan === syncPlanKey.singleDoc) {
            this.nowDeleteMode = deleteMode.path;
        } else {
            this.nowDeleteMode = deleteMode.blockId;
        }
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
    }

    /**
     * 初始化字典
     * @protected
     */
    protected async initDict(): Promise<void> {
        await this.initDictByAttrName(CUSTOM_MEMO_ID, this.memoIdLinkBlockId)
        debugMessage(pluginConfigData.debug.isDebug, "MemoId: BlockId", this.memoIdLinkBlockId);
        await this.initDictByAttrName(CUSTOM_MEMO_UID, this.memoUidLinkBlockId);
        debugMessage(pluginConfigData.debug.isDebug, "MemoUid: BlockId", this.memoUidLinkBlockId);
    }

    /**
     * 根据属性名称初始化字典
     * @param name
     * @param dict
     * @protected
     */
    protected async initDictByAttrName(name: string, dict: any) {
        let responseData = await SiYuanApiService.getAttrByName(name);
        if (!isEmptyValue(responseData) && responseData.length > 0) {
            for (let a of responseData) {
                dict[a.value] = a.block_id;
            }
        }
    }


    /**
     * 更新删除列表
     * @protected
     */
    protected async updateDeleteList() {
        if (this.nowDeleteMode === deleteMode.blockId) {
            await this.updateDeleteListById();
        } else if (this.nowDeleteMode === deleteMode.path) {
            await this.updateDeleteListByPath();
        }

        debugMessage(pluginConfigData.debug.isDebug, "删除列表", this.deleteList);
    }

    /**
     * 更新删除列表 - ID
     * @protected
     */
    protected async updateDeleteListById() {
        for (let memo of this.data.oldMemos) {
            let memoId = this.getMemoId(memo);
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
     * 更新删除列表 - 路径
     * @protected
     */
    protected async updateDeleteListByPath() {
        for (let memo of this.data.oldMemos) {
            let memoId = this.getMemoId(memo);
            let response = await SiYuanApiService.getAttributes(CUSTOM_MEMO_ID, memoId);
            if (isEmptyValue(response) || response.length === 0) {
                debugMessage(pluginConfigData.debug.isDebug, "未找到对应删除数据", memoId);
            } else {
                debugMessage(pluginConfigData.debug.isDebug, "已找到对应删除数据", memoId);
                let path = response[0].path;
                this.deleteList.push(path);
            }
        }
    }

    /**
     * 获取 Memo id
     * @param memo
     * @protected
     */
    protected abstract getMemoId(memo: any) : string;


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

        // 批量处理嵌入内容
        debugMessage(pluginConfigData.debug.isDebug, "正在批量处理嵌入内容...");

        await this.handleEmbeddedContents();

        debugMessage(pluginConfigData.debug.isDebug, "嵌入内容处理完成！");
    }

    /**
     * 批量保存
     */
    protected async batchSave(): Promise<void> {
        if (pluginConfigData.base.syncPlan === syncPlanKey.singleDoc) {
            await this.batchSaveSingleDocument();
        } else if (pluginConfigData.base.syncPlan === syncPlanKey.sameDoc) {
            await this.batchSaveSameDocument();
        } else if (pluginConfigData.base.syncPlan === syncPlanKey.dailyNotes) {
            await this.batchSaveDailyNotes();
        }
    };


    protected async batchSaveSingleDocument() {
        if (pluginConfigData.base.memosSort === memosSortKey.asc) {
            DataHandleBase.sortMemos(this.data.newMemos, true);
        } else if (pluginConfigData.base.memosSort === memosSortKey.desc) {
            DataHandleBase.sortMemos(this.data.newMemos, false);
        }

        for (let newMemo of this.data.newMemos) {
            await this.saveSingleDocument(newMemo);
        }
    }

    /**
     * 保存为单独的文档
     * @param newMemo
     * @protected
     */
    protected async saveSingleDocument(newMemo: any) {
        let notebookId = pluginConfigData.base.notebook;
        let path = `${pluginConfigData.base.docPath}/${newMemo.title}`;
        let contents = newMemo.contents;
        let markdown = contents.length > 0 ? contents[0].content : "";

        let pageId = await createDocWithMd(notebookId, path, markdown);

        if (isEmptyValue(pageId)) {
            debugMessage(pluginConfigData.debug.isDebug, `获取页面失败！`);
            return;
        }

        if (contents[0].type === contentsType.embedded) {
            let response: IResGetChildBlock[] = await getChildBlocks(pageId);
            if (!isEmptyValue(response) && response.length > 0) {
                let blockId = response[0].id;
                this.blockIdLinkEmbeddedContent[blockId] = contents[0].content;
            }
        }

        let newContents = contents.slice(1);
        await this.saveContents(pageId, newContents);

        await this.saveAfter(pageId, newMemo);
    }


    protected async batchSaveSameDocument() {
        DataHandleBase.sortMemos(this.data.newMemos, true);

        for (let newMemo of this.data.newMemos) {
            debugMessage(pluginConfigData.debug.isDebug, "正在写入", newMemo);

            await this.saveSameDocument(newMemo);

            debugMessage(pluginConfigData.debug.isDebug, `Memos/${newMemo.id} 写入完成`);
        }
    }

    /**
     * 保存到同一份文档
     * @param newMemo
     * @protected
     */
    protected async saveSameDocument(newMemo: any) {
        let notebookId = pluginConfigData.base.notebook;
        let path = pluginConfigData.base.docPath;
        let response: IResdoOperations[];
        let title = `- ${newMemo.title}`;

        // 获取页面ID
        let pageId = await SiYuanApiService.getDocumentIdByHPath(notebookId, path);
        if (isEmptyValue(pageId)) {
            debugMessage(pluginConfigData.debug.isDebug, "文档ID获取失败", pageId);
            return ;
        }

        // 添加标题
        if (pluginConfigData.base.memosSort === memosSortKey.asc) {
            response = await appendBlock("markdown", title, pageId);
        } else if (pluginConfigData.base.memosSort === memosSortKey.desc) {
            response = await prependBlock("markdown", title, pageId);
        } else {
            return;
        }

        await this.saveBlocks(response, newMemo);
    }


    protected async batchSaveDailyNotes() {
        DataHandleBase.sortMemos(this.data.newMemos, true);

        for (let newMemo of this.data.newMemos) {
            debugMessage(pluginConfigData.debug.isDebug, "正在写入", newMemo);

            await this.saveDailyNotes(newMemo);

            debugMessage(pluginConfigData.debug.isDebug, `Memos/${newMemo.id} 写入完成`);
        }
    }

    /**
     * 保存为 Daily Notes
     * @param newMemo
     * @protected
     */
    protected async saveDailyNotes(newMemo: any) {
        let notebookId = pluginConfigData.base.notebook;
        let title = `- ${newMemo.title}`;
        let datetime = newMemo.updateTime;
        let response: IResdoOperations[];
        if (pluginConfigData.base.memosSort === memosSortKey.asc) {
            response = await SiYuanApiService.appendDailyNoteBlockByDatetime(notebookId, title, datetime);
        } else if (pluginConfigData.base.memosSort === memosSortKey.desc) {
            response = await SiYuanApiService.prependDailyNoteBlockByDatetime(notebookId, title, datetime);
        } else {
            return;
        }
        await this.saveBlocks(response, newMemo);
    }

    /**
     * 保存为块
     * @param response
     * @param newMemo
     * @protected
     */
    protected async saveBlocks(response: IResdoOperations[], newMemo: any) {
        if (isEmptyValue(response) || response.length === 0) {
            debugMessage(pluginConfigData.debug.isDebug, "列表块ID获取失败", response)
            return ;
        }

        let ListBlockId = SiYuanApiService.getBlockId(response);

        let childBlocks = await getChildBlocks(ListBlockId);

        if (isEmptyValue(childBlocks) || childBlocks.length === 0) {
            debugMessage(pluginConfigData.debug.isDebug, "标题块ID获取失败", childBlocks)
            return ;
        }

        let titleBlockId = childBlocks[0].id;
        let contents = newMemo.contents;
        await this.saveContents(titleBlockId, contents);

        await this.saveAfter(titleBlockId, newMemo);
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
     * 保存后处理
     * @param id
     * @param memo
     * @protected
     */
    protected async saveAfter(id: string, memo: any) {
        await this.updateDict(id, memo);
        await this.setCustomAttrs(id, memo);
    }


    /**
     * 更新字典
     * @param blockId
     * @param newMemo
     * @protected
     */
    protected async updateDict(blockId: string, newMemo: INewMemo) {
        debugMessage(pluginConfigData.debug.isDebug, `正在更新字典...`);

        this.memoIdLinkBlockId[newMemo.id] = blockId;
        this.memoUidLinkBlockId[newMemo.uid] = blockId;

        debugMessage(pluginConfigData.debug.isDebug, `更新完成！`);
    }

    /**
     * 设置块属性
     * @param blockId
     * @param newMemo
     * @protected
     */
    protected async setCustomAttrs(blockId: string, newMemo: any) {
        debugMessage(pluginConfigData.debug.isDebug, `正在设置块属性...`);

        let attrs = {};
        attrs[CUSTOM_MEMO_ID] = newMemo.id;
        // attrs[CUSTOM_MEMO_UID] = newMemo.uid;
        await setBlockAttrs(blockId, attrs);

        debugMessage(pluginConfigData.debug.isDebug, `设置完成！`);
    }

    /**
     * 批量处理引用
     */
    protected abstract handleRelations(): Promise<void>;

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
     * 清理数据
     * @protected
     */
    protected async clearData(): Promise<void>{
        // 清理旧数据
        debugMessage(pluginConfigData.debug.isDebug, "正在清理旧数据...");

        if (this.nowDeleteMode === deleteMode.blockId) {
            await this.deleteIdList();
        } else if (this.nowDeleteMode === deleteMode.path) {
            await this.deletePathList();
        }

        debugMessage(pluginConfigData.debug.isDebug, "清理完成！");
    }

    /**
     * 根据 BlockId 删除旧数据
     */
    async deleteIdList() : Promise<void> {
        for (let blockId of this.deleteList) {
            await deleteBlock(blockId);
        }
    }

    /**
     * 根据路径删除旧数据
     */
    async deletePathList() : Promise<void> {
        for (let path of this.deleteList) {
            await removeDoc(pluginConfigData.base.notebook, path);
        }
    }
}

