import {MemosServer} from "@/controllers/memos";
import {pushMsg} from "@/controllers/siyuan/api";
import {IResGetMemos} from "@/types/memos";
import {Handle} from "@/controllers/plugin/v2/handle";
import {debugMessage} from "@/utils";
import {pluginConfigData} from "@/index";

export class PluginSync {
    private allMemos: IResGetMemos;

    public async run() {
        debugMessage(pluginConfigData.debug.isDebug, "【V2】开始同步...", "", true);

        // 拉取数据
        this.allMemos = await MemosServer.getMemos();

        // 判断是否有新数据
        if (this.allMemos.new.length <= 0) {
            await pushMsg("暂无新数据！");
            return;
        }

        // TODO 处理数据
        Handle.main(this.allMemos);

        // TODO 保存数据

        debugMessage(pluginConfigData.debug.isDebug, "【V2】同步结束", "", true);
    }
}