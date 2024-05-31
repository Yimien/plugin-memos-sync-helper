import {pluginConfigData} from "@/index";
import {
    createDocWithMd,
    getChildBlocks,
} from "@/controllers/siyuan/api";
import {IResHandleMemo, IResDataHandleRun} from "@/types/memos/v2/handle";
import {debugMessage, isEmptyValue} from "@/utils";
import {contentsType, deleteMode} from "@/constants/plugin";
import {IResGetChildBlock} from "@/types/siyuan/api";
import {DataSave} from "@/controllers/plugin/v2/data-save/index";
import {DataHandle} from "@/controllers/plugin/v2/data-handle";
import {memosSortKey} from "@/constants/components/select";


export class SingleDoc extends DataSave{

    constructor(data: IResDataHandleRun) {
        super(data);
        this.nowDeleteMode = deleteMode.path;
    }


    protected async batchSave() {
        if (pluginConfigData.base.memosSort === memosSortKey.asc) {
            DataHandle.sortMemos(this.data.new, true);
        } else if (pluginConfigData.base.memosSort === memosSortKey.desc) {
            DataHandle.sortMemos(this.data.new, false);
        }

        for (let newMemo of this.data.new) {
            await this.save(newMemo);
        }
    }


    async save(newMemo: IResHandleMemo) {
        debugMessage(pluginConfigData.debug.isDebug, "正在写入", newMemo);

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
        await super.saveContents(pageId, newContents);

        await super.updateDict(pageId, newMemo);
        await super.setCustomAttrs(pageId, newMemo);
    }

    public static async runSync(data: IResDataHandleRun) {
        let sd = new SingleDoc(data);
        await sd.main();
    }
}
