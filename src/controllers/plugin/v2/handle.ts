import {debugMessage, isEmptyValue} from "@/utils";
import {IResGetMemos} from "@/types/memos";
import {pluginConfigData} from "@/index";

/**
 * 数据处理
 */
export class Handle {

    /**
     * 将内容拆分成分列
     * @param content
     */
    static splitContent(content: string): string[] {
        return content.split('\n').filter(item => !isEmptyValue(item.trim()));
    }


    static main(data: IResGetMemos) {
        debugMessage(pluginConfigData.debug.isDebug, "开始处理数据...");

        let testResult: any;

        let newMemos = data.new;
        let memos = newMemos[0]
        let content = memos.content;
        debugMessage(pluginConfigData.debug.isDebug, "处理前", content);

        testResult = Handle.splitContent(content);

        debugMessage(pluginConfigData.debug.isDebug, "处理结果", testResult);
    }
}