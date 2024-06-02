import {DataSaveBase} from "@/controllers/plugin/common/save/DataSaveBase";
import {IMemoV2} from "@/types/memos/v2";
import {IResDataHandleRunV2} from "@/types/plugin/v2/handle";


export class DataSaveV2 extends DataSaveBase {

    protected getMemoId(memo: IMemoV2) {
        return memo.name.split('/').pop();
    }

    protected async handleRelations() : Promise<void> {
        for (let relation of this.data.relations) {
            let memoId = relation.memo.split('/').pop();
            let relatedMemoId = relation.relatedMemo.split('/').pop();

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