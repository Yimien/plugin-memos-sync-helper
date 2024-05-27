import {MemosServer} from "@/controllers/memos";
import {pushMsg} from "@/controllers/siyuan/api";
import {IResGetMemos} from "@/types/memos";
import {Handle} from "@/controllers/plugin/v2/handle";


export class PluginSync {
    private allMemos: IResGetMemos;

    public async run() {
        // 拉取数据
        this.allMemos = await MemosServer.getMemos();

        // 判断是否有新数据
        if (this.allMemos.new.length <= 0) {
            await pushMsg("暂无新数据！");
            return;
        }

        // 处理数据
        let handleRes = await Handle.run(this.allMemos);

        // TODO 保存数据
    }
}