import {DataSave} from "@/controllers/plugin/v2/data-save/index";
import {IResDataHandleRun, IResHandleMemo} from "@/types/memos/v2/handle";
import {pluginConfigData} from "@/index";
import {appendBlock, getChildBlocks, prependBlock,} from "@/controllers/siyuan/api";
import {debugMessage, isEmptyValue} from "@/utils";
import {SiYuanApiService} from "@/controllers/siyuan";
import {deleteMode} from "@/constants/plugin";
import {DataHandle} from "@/controllers/plugin/v2/data-handle";
import {IResdoOperations} from "@/types/siyuan/api";
import {memosSortKey} from "@/constants/components/select";


export class SameDoc extends DataSave{

    constructor(data: IResDataHandleRun) {
        super(data);
        this.nowDeleteMode = deleteMode.blockId;
    }

    protected async batchSave(): Promise<void> {
        DataHandle.sortMemos(this.data.new, true);

        for (let newMemo of this.data.new) {
            await this.save(newMemo);
        }
    }

    async save(newMemo: IResHandleMemo): Promise<void> {
        debugMessage(pluginConfigData.debug.isDebug, "正在写入", newMemo);

        let notebookId = pluginConfigData.base.notebook;
        let path = pluginConfigData.base.docPath;

        let pageId = await SiYuanApiService.getDocumentIdByHPath(notebookId, path);

        if (isEmptyValue(pageId)) {
            debugMessage(pluginConfigData.debug.isDebug, `获取文档ID失败`);
            return;
        }

        let title = `- ${newMemo.title}`;
        let response: IResdoOperations[];

        if (pluginConfigData.base.memosSort === memosSortKey.asc) {
            response = await appendBlock("markdown", title, pageId);
        } else if (pluginConfigData.base.memosSort === memosSortKey.desc) {
            response = await prependBlock("markdown", title, pageId);
        } else {
            debugMessage(pluginConfigData.debug.isDebug, `排序错误`);
            return ;
        }

        if (isEmptyValue(response) || response.length === 0) {
            debugMessage(pluginConfigData.debug.isDebug, `获取列表块失败`);
            return ;
        }

        let MemoBlockId = SiYuanApiService.getBlockId(response);

        let childBlocks = await getChildBlocks(MemoBlockId);
        if (isEmptyValue(childBlocks)) {
            debugMessage(pluginConfigData.debug.isDebug, `获取标题块失败`);
            return ;
        }
        let titleBlockId = childBlocks[0].id;

        let contents = newMemo.contents;
        await super.saveContents(titleBlockId, contents);

        await super.updateDict(titleBlockId, newMemo);

        await super.setCustomAttrs(titleBlockId, newMemo);

        debugMessage(pluginConfigData.debug.isDebug, `Memos/${newMemo.id} 写入完成`);
    }

    static async runSync(data: IResDataHandleRun) {
        let sd = new SameDoc(data);
        await sd.main();
    }
}