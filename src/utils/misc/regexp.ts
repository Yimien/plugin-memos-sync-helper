export default {
    id: /^\d{14}-[0-9a-z]{7}$/, // 块 ID 正则表达式
    url: /^siyuan:\/\/blocks\/(\d{14}-[0-9a-z]{7})/, // 思源 URL Scheme 正则表达式
    snippet: /^\d{14}-[0-9a-z]{7}$/, // 代码片段 ID
    created: /^\d{10}$/, // 文件历史创建时间
    history: /[\/\\]history[\/\\]\d{4}-\d{2}-\d{2}-\d{6}-(clean|update|delete|format|sync|replace)([\/\\]\d{14}-[0-9a-z]{7})+\.sy$/, // 历史文档路径
    snapshot: /^[0-9a-f]{40}$/, // 快照对象 ID
    shorthand: /^\d{13}$/, // 收集箱项 ID
}