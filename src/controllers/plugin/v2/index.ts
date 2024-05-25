import {pushErrMsg, pushMsg} from "@/api";


export class PluginSync{
    private isFetching: boolean;

    constructor(){
        this.isFetching = false;
    }

    /**
     * 拉取 Memos 数据
     * @private
     */
    private async fetchMemosData(){
        if (this.isFetching){
            await pushMsg("拉取中, 请稍候……");
            return;
        }else {
            await pushMsg("开始拉取数据……");
            this.isFetching = true;
        }

        try {
            // await getAllMemos();
        } catch (error) {
            await pushErrMsg(error);
        } finally {
            this.isFetching = false;
            await pushMsg("拉取完成");
        }
    }

    /**
     *
     * @private
     */
    public async run(){
        // TODO 拉取数据
        await this.fetchMemosData();

        // TODO 处理数据

        // TODO 保存数据
    }
}