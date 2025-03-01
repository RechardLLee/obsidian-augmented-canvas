# Obsidian 增强画布

[English](./README.md)|[简体中文](./README.zh-CN.md)

一个为 [Obsidian](https://obsidian.md) 提供 AI 功能增强画布的插件。

您需要 API 密钥才能使用此插件，可以在设置中输入。默认情况下，该插件可以使用 Silicon Flow 的模型，如 `Qwen/Qwen2.5-7B-Instruct`。您可以在设置中指定任何 API 支持的模型名称。此外，您还可以在设置中自定义 API URL，以连接到使用兼容 API 格式的其他 AI 平台。

## 主要功能

此插件为画布视图中的笔记添加了三个操作。

1. 对特定笔记使用 GPT，笔记内容将作为提示。笔记可以是文本笔记、md 文件或 PDF 文件。AI 响应将在提示笔记下方创建一个新笔记。

![Augmented-Canvas-AskAI](./assets/AugmentedCanvas-AskAI.gif)

2. 询问关于笔记的问题。同样使用 GPT 生成新笔记，问题会放在两个笔记之间的连接上。

![Augmented-Canvas-AskquestionswithAI](./assets/AugmentedCanvas-AskquestionwithAI.gif)

3. 使用 GPT 对特定笔记生成问题。生成的问题帮助您轻松深入了解笔记的主题。

![Augmented-Canvas-AIgeneratedquestions](./assets/AugmentedCanvas-AIgeneratedquestions.gif)

笔记之间的连接用于创建发送给 GPT 的聊天历史。

## 附加功能

- 插件在画布中笔记的上下文菜单中添加了创建图像的操作。

- 插件添加了一个名为"对文件夹运行系统提示"的命令。读取该文件夹及其子文件夹中的所有 md 和画布文件，并将响应插入当前画布。

- 插件添加了一个名为"插入系统提示"的命令。此命令将所选系统提示插入当前画布。系统提示从 [f/awesome-chatgpt-prompts (github.com)](https://github.com/f/awesome-chatgpt-prompts) 获取。您也可以在设置中添加自己的系统提示。

![Augmented-Canvas-Insertsystemprompt](./assets/AugmentedCanvas-Insertsystemprompt.gif)

- 插件可以为您创建闪卡，这些闪卡可以使用 [间隔重复插件](https://github.com/st3v3nmw/obsidian-spaced-repetition) 进行复习。右键单击笔记创建闪卡。然后等待 GPT 响应，一个新文件将在设置中指定的文件夹内创建。然后您可以复习这个特定的牌组。请考虑在间隔重复插件的设置中激活"将文件夹转换为牌组和子牌组？"选项。

![Augmented-Canvas-Createflashcards](./assets/AugmentedCanvas-Createflashcards.gif)

- 插件添加了一个名为"插入相关问题"的命令。此命令将 AI 生成的问题插入当前画布。插件读取并发送您的历史活动给 GPT，读取最近修改的 X 个文件（可在设置中配置）。

- 插件在边缘上下文菜单中添加了重新生成 AI 响应的操作。

## 隐私

发送给 GPT 的内容可以通过打开"调试输出"设置查看。消息将显示在控制台中。

## 安装

- 尚未准备好上架
- 可以通过 [Brat](https://github.com/TfTHacker/obsidian42-brat) 插件安装
  您可以在 Ric Raftis 的文章中了解如何操作：https://ricraftis.au/obsidian/installing-the-brat-plugin-in-obsidian-a-step-by-step-guide/
- 手动安装

1. 在此 GitHub 页面上找到发布页面并点击
2. 下载最新的发布 zip 文件
3. 解压缩，将解压后的文件夹复制到 Obsidian 插件文件夹，确保文件夹中有 main.js 和 manifest.json 文件
4. 重启 Obsidian（也必须重启，不能只刷新插件列表），在设置界面启用插件
5. 完成！

## 致谢

- [rpggio/obsidian-chat-stream: Obsidian canvas plugin for using AI completion with threads of canvas nodes (github.com)](https://github.com/rpggio/obsidian-chat-stream)
- [Quorafind/Obsidian-Collapse-Node: A node collapsing plugin for Canvas in Obsidian. (github.com)](https://github.com/quorafind/obsidian-collapse-node)

