import {DataSaveBase} from "@/controllers/plugin/common/save/DataSaveBase";
import {IMemoV2} from "@/types/memos/v2";
import {IResDataHandleRunV2} from "@/types/plugin/v2/handle";
import {debugMessage} from "@/utils";
import {pluginConfigData} from "@/index";
import {API_VERSION, RELATION_TYPE} from "@/constants/memos";


export class DataSaveV2 extends DataSaveBase {

    protected getMemoId(memo: IMemoV2) {
        return memo.name.split('/').pop();
    }

    protected async handleRelations() : Promise<void> {
        debugMessage(pluginConfigData.debug.isDebug, "需处理的引用列表", this.data.relations);
        for (let relation of this.data.relations) {
            if (relation.type === RELATION_TYPE.comment) {
                debugMessage(pluginConfigData.debug.isDebug, "该条引用位于评论，跳过处理", relation);
                continue;
            }
            let memoId;
            let relatedMemoId ;

            if (API_VERSION.V2_Y2025_M02_D05.includes(pluginConfigData.base.version)) {
                memoId = relation.memo.uid;
                relatedMemoId = relation.relatedMemo.uid;
            } else {
                memoId = relation.memo.split('/').pop();
                relatedMemoId = relation.relatedMemo.split('/').pop()
            }

            let blockId = this.memoIdLinkBlockId[memoId];
            let relatedBlockId = this.memoIdLinkBlockId[relatedMemoId];
            await this.handleRelation(blockId, relatedBlockId, relatedMemoId);
        }
    }

    static async run(data: IResDataHandleRunV2) {
        let ds = new DataSaveV2(data);
        await ds.main();
    }
}