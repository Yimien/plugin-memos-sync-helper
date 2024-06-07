import {debugMessage} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";
import {IMemoV2, IResourceV2} from "@/types/memos/v2";
import {formatDateTime, toChinaTime} from "@/utils/misc/time";
import {IResDataHandleRunV2} from "@/types/plugin/v2/handle";
import moment from "moment/moment";
import {IContents} from "@/types/plugin";
import {DataHandleBase} from "@/controllers/plugin/common/handle/DataHandleBase";


export class DataHandleV2 extends DataHandleBase{

    protected getMemoId(memo: IMemoV2) {
        return memo.name.split('/').pop();
    }

    protected getMemoUid(memo: IMemoV2): string {
        return memo.uid;
    }

    protected getUpdateTime(memo: IMemoV2): string {
        return formatDateTime(toChinaTime(memo.updateTime));
    }

    protected handleRelations(memo: IMemoV2): void {
        let relations = memo.relations;
        for (let relation of relations) {
            const exists = this.relations.some(r =>
                relation.memo === r.memo && relation.relatedMemo === r.relatedMemo
            );
            if (!exists) {
                this.relations.push(relation);
            }
        }
    }

    protected handleResources(memo: IMemoV2, contents: IContents): void {
        let resources = memo.resources;
        this.getResourceContents(contents, resources);
        this.resources = this.resources.concat(resources);
    }

    protected getResourcePath(resource: IResourceV2): string {
        let filename = resource.filename;
        let resourceId = resource.name.split('/').pop();
        let timestamp = moment(toChinaTime(resource.createTime)).unix();
        let end = filename.split('.').pop();
        return `${pluginConfigData.base.resourceSavePath}/${resourceId}_${timestamp}.${end}`;
    }


    // **************************************** export ****************************************


    /**
     * 获取路径
     * @param resource
     */
    static getResourcePathString(resource: IResourceV2) {
        let db = new DataHandleV2();
        return db.getResourcePath(resource);
    }


    static async run(data: IResGetMemos) : Promise<IResDataHandleRunV2> {
        let dh = new DataHandleV2();

        await dh.handleMemos(data.new);

        let result: IResDataHandleRunV2 = {
            resources: dh.resources,
            relations: dh.relations,
            oldMemos: data.old,
            newMemos: dh.newMemos
        }

        debugMessage(pluginConfigData.debug.isDebug, "数据处理结果", result);

        return result;
    }
}