import {DataSave} from "@/controllers/plugin/v2/data-save/index";
import {IResDataHandleRunV2, IResHandleMemos} from "@/types/memos/v2/handle";
import {pluginConfigData} from "@/index";
import {getChildBlocks, prependBlock,} from "@/controllers/siyuan/api";
import {debugMessage, isEmptyValue} from "@/utils";
import {SiYuanApiService} from "@/controllers/siyuan";


export class SameDoc extends DataSave{

    async save(newMemo: IResHandleMemos): Promise<void> {
        debugMessage(pluginConfigData.debug.isDebug, "正在写入", newMemo);

        let notebookId = pluginConfigData.base.notebook;
        let path = pluginConfigData.base.docPath;

        let pageId = await SiYuanApiService.getDocumentIdByHPath(notebookId, path);

        if (isEmptyValue(pageId)) {
            debugMessage(pluginConfigData.debug.isDebug, `获取文档ID失败`);
            return;
        }

        let title = `- ${newMemo.title}`;
        let response = await prependBlock("markdown", title, pageId);
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

        debugMessage(pluginConfigData.debug.isDebug, `正在更新字典...`);

        await super.updateDict(titleBlockId, newMemo);

        debugMessage(pluginConfigData.debug.isDebug, `更新完成！`);

        debugMessage(pluginConfigData.debug.isDebug, `正在设置块属性...`);

        await super.setCustomAttrs(titleBlockId, newMemo);

        debugMessage(pluginConfigData.debug.isDebug, `设置完成！`);

        debugMessage(pluginConfigData.debug.isDebug, `Memos/${newMemo.id} 写入完成`);
    }

    static async runSync(data: IResDataHandleRunV2) {
        let sd = new SameDoc(data);
        await sd.main();
    }
}