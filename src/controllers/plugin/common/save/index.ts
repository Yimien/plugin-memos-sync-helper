import {SiYuanApiService} from "@/controllers/siyuan";
import {
    appendBlock,
    createDocWithMd,
    deleteBlock,
    getChildBlocks,
    prependBlock,
    removeDoc
} from "@/controllers/siyuan/api";
import {pluginConfigData} from "@/index";
import {debugMessage, isEmptyValue} from "@/utils";
import {deleteMode} from "@/constants/plugin";
import {IContent} from "@/types/memos/";
import {IResdoOperations} from "@/types/siyuan/api";
import {memosSortKey} from "@/constants/components/select";


export abstract class DataSaveBase {

    /**
     * 自定义属性名称
     * @protected
     */
    protected CUSTOM_MEMO_ID : string = "custom-memo-id";

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
     * MemoId : BlockId
     * @protected
     */
    protected memoIdLinkBlockId: {[memoId: string]: string};

    /**
     * 清理模式
     * @protected
     */
    protected nowDeleteMode: string | number;

    protected constructor(data: any) {
        this.data = data;
        this.deleteList = [];
        this.memoIdLinkBlockId = {};
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
        await this.initDictByAttrName(this.CUSTOM_MEMO_ID, this.memoIdLinkBlockId)

        debugMessage(pluginConfigData.debug.isDebug, "MemoId: BlockId", this.memoIdLinkBlockId);
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
    protected abstract updateDeleteListById(): Promise<void>;

    /**
     * 更新删除列表 - 路径
     * @protected
     */
    protected abstract updateDeleteListByPath(): Promise<void>;


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
     * 批量保存
     */
    protected abstract batchSave(): Promise<void>;

    protected async getPageId(newMemo: any) {
        let notebookId = pluginConfigData.base.notebook;
        let path = `${pluginConfigData.base.docPath}/${newMemo.title}`;
        let contents = newMemo.contents;
        let markdown = contents.length > 0 ? contents[0].content : "";
        return await createDocWithMd(notebookId, path, markdown);
    }

    protected abstract saveSingleDocument(newMemo: any) : Promise<void>;
    // protected async saveSingleDocument(newMemo: any) {
    //     let pageId = await this.getPageId(newMemo);
    //
    //     if (isEmptyValue(pageId)) {
    //         return;
    //     }
    //
    //     let contents = newMemo.contents.slice(1);
    //     await this.saveContents(pageId, contents);
    //
    //     await this.saveAfter(pageId, newMemo);
    // }

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
    protected abstract saveContents(titleBlockId: string, contents: IContent[]): Promise<void>;
    // protected async saveContents(titleBlockId: string, contents: IContent[]) : Promise<void> {
    //     for (let c of contents) {
    //         await appendBlock("markdown", c.content, titleBlockId);
    //     }
    // }

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
     * @param id
     * @param memo
     * @protected
     */
    protected abstract updateDict(id: string, memo: any): Promise<void>;

    /**
     * 设置块属性
     * @param id
     * @param memo
     * @protected
     */
    protected abstract setCustomAttrs(id: string, memo: any): Promise<void>;

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

