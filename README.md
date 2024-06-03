
# Memos 同步助手

### 功能介绍

> 将 Memos 的数据同步到思源笔记。[<<更新日志](https://github.com/Yimien/plugin-memos-sync-helper/blob/main/CHANGELOG.md)

1. 支持将 Memos 的数据同步到思源笔记中，包括但不限于文本、图片、标签、引用等。
2. 支持新版 V1 API（原V2），兼容旧版 V1 API。
3. 支持三种同步保存方案：Daily Notes、单独的文档、同一份文档。
4. 支持识别 Memos 的嵌入内容、引用。
5. 支持识别双向链接。
6. 支持标签管理。

#### 请注意

与 Memos 同步插件相比，本插件删减调整了部分功能，具体说明如下：

1. 移除了标签匹配范围功能，调整了标签匹配规则，目前仅支持识别以 `#` 开头，以 `空白字符` 结尾的标签。例如：#标签 。
2. 移除了引用处理方案功能，改为保存 Memos 引用为思源笔记块引用，Memos 嵌入内容为思源笔记嵌入块。
3. 移除了图片块布局功能，不再将所有图片保存至同一个内容块中，而是改为将不同的图片保存至单独的块。
4. 移除了资源下载模式功能，目前 v0.21及以下版本仅支持最新可用的资源下载模式。

与 Memos 同步插件相比，本插件增加以下功能：

1. 增加了 Memos 版本自选功能，目前有两个选择：v0.21及以下，v0.22及以上，分别对应旧版 V1 API，新版 V1 API。
2. 增加了数据排序功能，根据更新日期对同步的数据选择升序、降序。
3. 增加了修复旧数据功能，修复 Memos 同步插件同步的数据以兼容 Memos 嵌入内容功能。

### 使用说明

1. 安装插件。
2. 填写 `服务器地址` 和 `Access Token` ，点击 `校验` 按钮。
3. 按需调整插件配置，带 `*` 标识为必填项。
4. 点击顶栏插件图标开始同步。

### 特别感谢

本项目受到诸多开源项目的帮助，特此感谢。

- [frostime](https://github.com/frostime) ：[plugin-sample-vite-svelte](https://github.com/siyuan-note/plugin-sample-vite-svelte)
- [winter60](https://github.com/winter60)：[plugin-flomo-sync](https://github.com/winter60/plugin-flomo-sync)
- [Yingyi / 颖逸](https://github.com/Zuoqiu-Yingyi)：[siyuan-packages-monorepo](https://github.com/Zuoqiu-Yingyi/siyuan-packages-monorepo)

### 最后的话

本插件功能以自身需求出发，可能无法满足各位的所有需求。

如果出现 Bug 或者有好的想法，欢迎提交 issues，当然，也欢迎各位大手子提交 PR。
