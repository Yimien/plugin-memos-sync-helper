import {SiYuanApiService} from "@/controllers/siyuan";
import {CUSTOM_MEMO_ID, CUSTOM_MEMO_UID} from "@/constants/plugin";
import {isEmptyValue} from "@/utils";
import {pluginConfigData} from "@/index";
import {versionKey} from "@/constants/components/select";
import {getBlockAttrs, pushErrMsg, pushMsg, setBlockAttrs} from "@/controllers/siyuan/api";
import {GetMemoById} from "@/controllers/memos/v1/api";
import {IMemoV2} from "@/types/memos/v2";
import {GetMemo} from "@/controllers/memos/v2/api";
import {IMemoV1} from "@/types/memos/v1";


let isRepair = false;

export async function repair() {
    if (isRepair) {
        await pushMsg("修复中，请稍候……");
        return;
    } else {
        await pushMsg("正在检测是否有可修复的数据");
        isRepair = true;
    }

    let memosIdLinkBlockIdList = await check();

    if (isEmptyValue(memosIdLinkBlockIdList)) {
        isRepair = false;
        return;
    }

    if (memosIdLinkBlockIdList.length === 0) {
        await pushMsg("暂无可修复数据！");
        isRepair = false;
        return;
    }

    await pushMsg("修复开始");

    // debugMessage(pluginConfigData.debug.isDebug, "属性查询", memosIdLinkBlockIdList);
    if (pluginConfigData.base.version === versionKey.v1) {
        for (let m of memosIdLinkBlockIdList) {
            let memo: IMemoV1 = await GetMemoById(m.memoId);
            if (isEmptyValue(memo)) {
                continue;
            }
            m.uid = memo.name;
            // debugMessage(pluginConfigData.debug.isDebug, "memo", memo);
        }

    } else if (pluginConfigData.base.version === versionKey.v2) {
        for (let m of memosIdLinkBlockIdList) {
            let memo : IMemoV2 = await GetMemo(m.memoId);
            if (isEmptyValue(memo)) {
                continue;
            }
            m.uid = memo.uid;
            // debugMessage(pluginConfigData.debug.isDebug, "memo", memo);
        }
    } else {
        await pushErrMsg("Memos 版本错误");
    }

    // debugMessage(pluginConfigData.debug.isDebug, "memosIdLinkBlockIdList", memosIdLinkBlockIdList);
    for (let m of memosIdLinkBlockIdList) {
        let attrs = {}
        attrs[CUSTOM_MEMO_UID] = m.uid;
        await setBlockAttrs(m.blockId, attrs);
    }

    await pushMsg("修复完成");
    isRepair = false;
}

async function check(){
    let needRepairList = [];
    let checkKeys = [CUSTOM_MEMO_ID, CUSTOM_MEMO_UID];

    let responseData = await SiYuanApiService.getAttrByName(CUSTOM_MEMO_ID);

    if (isEmptyValue(responseData)) {
        await pushErrMsg("无法获取块属性！");
        return;
    }

    if (responseData.length === 0) {
        await pushMsg("暂无可修复数据！");
        return;
    }

    for (let r of responseData) {
        let blockId = r.block_id;
        let responseData = await getBlockAttrs(blockId);
        if (isEmptyValue(responseData)) {
            return;
        }
        let isNeedRepair = !checkKeysAndValues(responseData, checkKeys);
        if (isNeedRepair) {
            let dict = {
                memoId: r.value,
                blockId: blockId
            }
            needRepairList.push(dict);
        }
        // debugMessage(pluginConfigData.debug.isDebug, "responseData", responseData);
    }

    return needRepairList;
}

function checkKeysAndValues(jsonObj: any, keys: string[]): boolean {
    for (const key of keys) {
        if (!(key in jsonObj) || isEmptyValue(jsonObj[key])) {
            return false; // 如果键不存在或值为空，则返回 false
        }
    }
    return true; // 所有键都存在且对应的值不为空
}
