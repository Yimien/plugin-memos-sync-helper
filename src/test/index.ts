import {ListMemos} from "@/memos/v2/api";

export async function main() {
    let pageSize = 5;
    let filter = [
        `creator == "users/2"`
    ];
    console.log(typeof filter);
    console.log('----- 1');
    let result = await ListMemos(pageSize, '', filter);
    let result2 = await ListMemos();
    console.log(result);
    console.log(result2);
    console.log('----- 1');
}