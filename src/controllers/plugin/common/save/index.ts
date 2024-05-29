import {IResdoOperations} from "@/types/siyuan/api";
import {setBlockAttrs} from "@/controllers/siyuan/api";


export function getBlockId(response : IResdoOperations[]) {
    return response[0].doOperations[0].id;
}

export async function setCustomAttr(blockId: string, name: string, memoId: string) {
    let attrs: {[name: string]: string} = {};
    attrs[name] = memoId;
    await setBlockAttrs(blockId, attrs);
}