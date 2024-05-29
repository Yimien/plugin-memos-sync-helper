import {pluginConfigData} from "@/index";
import {
    appendBlock,
    createDocWithMd,
    getChildBlocks,
    removeDoc,
    updateBlock
} from "@/controllers/siyuan/api";
import {IResHandleMemos, IResRun} from "@/types/memos/v2/handle";
import {debugMessage, isEmptyValue} from "@/utils";
import {contentsType, CUSTOM_ATTR} from "@/constants/plugin";
import {PluginServer} from "@/controllers/plugin";
import {IResdoOperations, IResGetChildBlock} from "@/types/siyuan/api";
import {setCustomAttr, getBlockId} from "@/controllers/plugin/common/save/index";
import {IMemos, IRelation} from "@/types/memos/v2";
import {SiYuanApiService} from "@/controllers/siyuan";


export class SingleDoc {
    data: IResRun;
    blockIdLinkEmbeddedContent : {[blockId: string]: string};
    memoIdLinkBlockId: {[memosId: string]: string};
    memoUidLinkBlockId: {[memosUid: string]: string};


    constructor(data: IResRun) {
        this.data = data;
        this.blockIdLinkEmbeddedContent = {};
        this.memoIdLinkBlockId = {};
        this.memoUidLinkBlockId = {};
    }


    /**
     * 写入思源同时设置块属性
     * @param handleMemo
     */
    async save(handleMemo: IResHandleMemos) {
        debugMessage(pluginConfigData.debug.isDebug, "正在保存...", handleMemo);

        let notebookId = pluginConfigData.base.notebook;
        let path = `${pluginConfigData.base.docPath}/${handleMemo.title}`;
        let contents = handleMemo.contents;
        let markdown = contents.length > 0 ? contents[0].content : "";
        let pageId = await createDocWithMd(notebookId, path, markdown);

        if (isEmptyValue(pageId)) {
            return;
        }

        this.memoIdLinkBlockId[handleMemo.id] = pageId;
        this.memoUidLinkBlockId[handleMemo.uid] = pageId;

        if (contents[0].type === contentsType.embedded) {
            let response: IResGetChildBlock[] = await getChildBlocks(pageId);
            if (!isEmptyValue(response) && response.length > 0) {
                let blockId = response[0].id;
                this.blockIdLinkEmbeddedContent[blockId] = contents[0].content;
            }
        }

        for (let i = 1; i < contents.length; i++) {
            let memo = contents[i];
            let response: IResdoOperations[] = await appendBlock("markdown", memo.content, pageId);
            if (!isEmptyValue(response) && memo.type === contentsType.embedded) {
                let blockId = getBlockId(response);
                this.blockIdLinkEmbeddedContent[blockId] = memo.content;
            }
        }

        await setCustomAttr(pageId, "custom-memo-id", handleMemo.id);
        await setCustomAttr(pageId, "custom-memo-uid", handleMemo.uid);

        debugMessage(pluginConfigData.debug.isDebug, "保存成功");
    }

    /**
     * 处理嵌入内容
     * @private
     */
    private async handleEmbeddedContent() {
        debugMessage(pluginConfigData.debug.isDebug, "正在处理嵌入内容...");

        for (let blockId in this.blockIdLinkEmbeddedContent) {
            let uid = this.blockIdLinkEmbeddedContent[blockId];
            let relatedBlockId = this.memoUidLinkBlockId[uid];

            let content = `{{select * from blocks where id="${relatedBlockId}"}}`;
            await updateBlock("markdown", content, blockId);
        }

        debugMessage(pluginConfigData.debug.isDebug, "嵌入内容处理完成");
    }

    /**
     * 处理引用
     * @param relations
     */
    async handleRelations(relations: IRelation[]){
        debugMessage(pluginConfigData.debug.isDebug, "正在处理引用...");

        for (let relation of relations) {
            let memoId = this.getMemoId(relation.memo);
            let relatedMemoId = this.getMemoId(relation.relatedMemo);

            let blockId = this.memoIdLinkBlockId[memoId];
            let relatedBlockId = this.memoIdLinkBlockId[relatedMemoId];

            let content = `((${relatedBlockId} "@${relatedMemoId}"))`;
            await appendBlock("markdown", content, blockId);
        }
        debugMessage(pluginConfigData.debug.isDebug, "引用处理完成");
    }

    getMemoId(name: string) {
        return name.split('/').pop();
    }

    async initData() {
        let memoIdResponse = await SiYuanApiService.getAttrByName(CUSTOM_ATTR.memoId);
        if (!isEmptyValue(memoIdResponse) && memoIdResponse.length > 0) {
            debugMessage(pluginConfigData.debug.isDebug, "查询成功，开始初始化 MemoId-BlockId", memoIdResponse);
            for (let a of memoIdResponse) {
                this.memoIdLinkBlockId[a.value] = a.block_id;
            }
        }

        let memoUidResponse = await SiYuanApiService.getAttrByName(CUSTOM_ATTR.memoUid);
        if (!isEmptyValue(memoUidResponse) && memoUidResponse.length > 0) {
            debugMessage(pluginConfigData.debug.isDebug, "查询成功，开始初始化 MemoUid-BlockId", memoIdResponse);
            for (let a of memoUidResponse) {
                this.memoUidLinkBlockId[a.value] = a.block_id;
            }
        }
        debugMessage(pluginConfigData.debug.isDebug, "初始化完成 MemosId-BlockId", this.memoIdLinkBlockId);
        debugMessage(pluginConfigData.debug.isDebug, "初始化完成 MemosUid-BlockId", this.memoUidLinkBlockId);
    }

    async deleteOldMemos(memos: IMemos) {
        debugMessage(pluginConfigData.debug.isDebug, "正在删除旧数据...");
        for (let memo of memos) {
            let memoId = this.getMemoId(memo.name);
            let response = await SiYuanApiService.getAttr(CUSTOM_ATTR.memoId, memoId);
            if (!isEmptyValue(response) && response.length > 0) {
                debugMessage(pluginConfigData.debug.isDebug, "查询成功，开始删除", memoId);
                let path = response[0].path;
                await removeDoc(pluginConfigData.base.notebook, path);
            } else {
                debugMessage(pluginConfigData.debug.isDebug, "查询失败，不进行删除", memoId);
            }
        }
        debugMessage(pluginConfigData.debug.isDebug, "旧数据删除完成");
    }

     async main() {
         // 提取
         let oldMemos = this.data.old; // 旧数据，用于删除
         let newMemos = this.data.new; // 新数据，用于新增
         let relations = this.data.relations; // 引用

         // 删除旧数据
         await this.deleteOldMemos(oldMemos);

         // 初始化
         await this.initData();

         // 排序
         PluginServer.sortMemos(newMemos);

         // 循环写入
         for (let handleMemo of newMemos) {
             await this.save(handleMemo);
         }

         // 嵌入内容处理
         await this.handleEmbeddedContent();

         // 引用处理
         await this.handleRelations(relations);
    }

    static async runSync(data: IResRun) {
        let sd = new SingleDoc(data);
        await sd.main();
    }
}
