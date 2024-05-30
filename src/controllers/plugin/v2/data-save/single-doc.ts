import {pluginConfigData} from "@/index";
import {
    createDocWithMd,
    getChildBlocks,
    removeDoc,
} from "@/controllers/siyuan/api";
import {IResHandleMemos, IResDataHandleRunV2} from "@/types/memos/v2/handle";
import {debugMessage, isEmptyValue} from "@/utils";
import {contentsType} from "@/constants/plugin";
import {IResGetChildBlock} from "@/types/siyuan/api";
import {SiYuanApiService} from "@/controllers/siyuan";
import {DataSave} from "@/controllers/plugin/v2/data-save/index";


export class SingleDoc extends DataSave{

    async updateDeleteList() {
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

    async deleteOldMemos() {
        for (let path of this.deleteList) {
            await removeDoc(pluginConfigData.base.notebook, path);
        }
    }

    async save(newMemo: IResHandleMemos) {
        let notebookId = pluginConfigData.base.notebook;
        let path = `${pluginConfigData.base.docPath}/${newMemo.title}`;

        let contents = newMemo.contents;
        let markdown = contents.length > 0 ? contents[0].content : "";
        let pageId = await createDocWithMd(notebookId, path, markdown);

        if (isEmptyValue(pageId)) {
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

    public static async runSync(data: IResDataHandleRunV2) {
        let sd = new SingleDoc(data);
        await sd.main();
    }
}
