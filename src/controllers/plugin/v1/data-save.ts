import {DataSaveBase} from "@/controllers/plugin/common/save/DataSaveBase";
import {IMemoV1} from "@/types/memos/v1";
import {IResDataHandleRunV1} from "@/types/plugin/v1/handle";


export class DataSaveV1 extends DataSaveBase {

    protected getMemoId(memo: IMemoV1) {
        return memo.id.toString();
    }

    protected async handleRelations() : Promise<void> {
        for (let relation of this.data.relations) {
            let memoId = relation.memoId.toString();
            let relatedMemoId = relation.relatedMemoId.toString();

            let blockId = this.memoIdLinkBlockId[memoId];
            let relatedBlockId = this.memoIdLinkBlockId[relatedMemoId];

            await this.handleRelation(blockId, relatedBlockId, relatedMemoId);
        }
    }

    static async run(data: IResDataHandleRunV1) {
        let ds = new DataSaveV1(data);
        await ds.main();
    }
}