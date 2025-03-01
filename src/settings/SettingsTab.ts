import {
	App,
	ButtonComponent,
	Notice,
	PluginSettingTab,
	Setting,
	TextAreaComponent,
	TextComponent,
} from "obsidian";
import ChatStreamPlugin from "./../AugmentedCanvasPlugin";
import {
	SystemPrompt,
	getImageModels,
	getModels,
} from "./AugmentedCanvasSettings";
import { initLogDebug } from "src/logDebug";

export class SettingsTab extends PluginSettingTab {
	plugin: ChatStreamPlugin;

	constructor(app: App, plugin: ChatStreamPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("AI Model")
			.setDesc("Enter the model name (e.g. Qwen/Qwen2.5-7B-Instruct)")
			.addText((text) =>
				text
					.setPlaceholder("Enter model name")
					.setValue(this.plugin.settings.apiModel)
					.onChange(async (value) => {
						this.plugin.settings.apiModel = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("图像模型")
			.setDesc("选择用于生成图像的 GPT 模型。")
			.addDropdown((cb) => {
				getImageModels().forEach((model) => {
					cb.addOption(model, model);
				});
				cb.setValue(this.plugin.settings.imageModel);
				cb.onChange(async (value) => {
					this.plugin.settings.imageModel = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("API 密钥")
			.setDesc(
				"用于发送请求的 API 密钥 - 从 OpenAI 获取"
			)
			.addText((text) => {
				text.inputEl.type = "password";
				text.setPlaceholder("API 密钥")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("YouTube API 密钥")
			.setDesc("用于获取字幕的 YouTube API 密钥")
			.addText((text) => {
				text.inputEl.type = "password";
				text.setPlaceholder("YouTube API 密钥")
					.setValue(this.plugin.settings.youtubeApiKey)
					.onChange(async (value) => {
						this.plugin.settings.youtubeApiKey = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("默认系统提示词")
			.setDesc(
				`发送给 API 的系统提示词。\n(注意: 您可以通过在笔记流开始时添加以'系统提示词'开头的笔记来覆盖此设置。该笔记的剩余内容将被用作系统提示词。)`
			)
			.addTextArea((component) => {
				component.inputEl.rows = 6;
				// component.inputEl.style.width = "300px";
				// component.inputEl.style.fontSize = "10px";
				component.inputEl.addClass("augmented-canvas-settings-prompt");
				component.setValue(this.plugin.settings.systemPrompt);
				component.onChange(async (value) => {
					this.plugin.settings.systemPrompt = value;
					await this.plugin.saveSettings();
				});
			});

		this.displaySystemPromptsSettings(containerEl);

		new Setting(containerEl)
			.setName("闪卡系统提示词")
			.setDesc(`用于生成闪卡文件的系统提示词。`)
			.addTextArea((component) => {
				component.inputEl.rows = 6;
				// component.inputEl.style.width = "300px";
				// component.inputEl.style.fontSize = "10px";
				component.inputEl.addClass("augmented-canvas-settings-prompt");
				component.setValue(this.plugin.settings.flashcardsSystemPrompt);
				component.onChange(async (value) => {
					this.plugin.settings.flashcardsSystemPrompt = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("相关问题系统提示词")
			.setDesc(
				`用于生成相关问题的系统提示词。`
			)
			.addTextArea((component) => {
				component.inputEl.rows = 6;
				// component.inputEl.style.width = "300px";
				// component.inputEl.style.fontSize = "10px";
				component.inputEl.addClass("augmented-canvas-settings-prompt");
				component.setValue(
					this.plugin.settings.relevantQuestionsSystemPrompt
				);
				component.onChange(async (value) => {
					this.plugin.settings.relevantQuestionsSystemPrompt = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("插入相关问题文件数量")
			.setDesc(
				'"插入相关问题"命令所考虑的文件数量。'
			)
			.addText((text) =>
				text
					.setValue(
						this.plugin.settings.insertRelevantQuestionsFilesCount.toString()
					)
					.onChange(async (value) => {
						const parsed = parseInt(value);
						if (!isNaN(parsed)) {
							this.plugin.settings.insertRelevantQuestionsFilesCount =
								parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("最大输入令牌")
			.setDesc(
				"发送给 API 的最大令牌数（在模型限制内）。0 表示尽可能多的令牌。"
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.maxInputTokens.toString())
					.onChange(async (value) => {
						const parsed = parseInt(value);
						if (!isNaN(parsed)) {
							this.plugin.settings.maxInputTokens = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("最大输出令牌")
			.setDesc(
				"API 返回的最大令牌数。0 表示没有限制。（一个令牌大约是 4 个字符。）"
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.maxResponseTokens.toString())
					.onChange(async (value) => {
						const parsed = parseInt(value);
						if (!isNaN(parsed)) {
							this.plugin.settings.maxResponseTokens = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("Max depth")
			.setDesc(
				"包含祖先笔记的最大深度。0 表示没有限制。"
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.maxDepth.toString())
					.onChange(async (value) => {
						const parsed = parseInt(value);
						if (!isNaN(parsed)) {
							this.plugin.settings.maxDepth = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		new Setting(containerEl)
			.setName("温度")
			.setDesc("采样温度（0-2）。0 表示没有随机性。")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.temperature.toString())
					.onChange(async (value) => {
						const parsed = parseFloat(value);
						if (!isNaN(parsed) && parsed >= 0 && parsed <= 2) {
							this.plugin.settings.temperature = parsed;
							await this.plugin.saveSettings();
						}
					})
			);

		// new Setting(containerEl)
		// 	.setName("API URL")
		// 	.setDesc(
		// 		"The chat completions URL to use. You probably won't need to change this."
		// 	)
		// 	.addText((text) => {
		// 		text.inputEl.style.width = "300px";
		// 		text.setPlaceholder("API URL")
		// 			.setValue(this.plugin.settings.apiUrl)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.apiUrl = value;
		// 				await this.plugin.saveSettings();
		// 			});
		// 	});

		new Setting(containerEl)
			.setName("调试输出")
			.setDesc("在控制台中启用调试输出")
			.addToggle((component) => {
				component
					.setValue(this.plugin.settings.debug)
					.onChange(async (value) => {
						this.plugin.settings.debug = value;
						await this.plugin.saveSettings();
						initLogDebug(this.plugin.settings);
					});
			});
	}

	displaySystemPromptsSettings(containerEl: HTMLElement): void {
		const setting = new Setting(containerEl);

		setting
			.setName("添加系统提示词")
			.setClass("augmented-canvas-setting-item")
			.setDesc(
				`通过提供颜色名称并使用颜色选择器设置十六进制代码值来创建新的高亮颜色。不要忘记在颜色选择器退出之前保存颜色。拖动高亮颜色以更改高亮组件的顺序。`
			);

		const nameInput = new TextComponent(setting.controlEl);
		nameInput.setPlaceholder("Name");
		// colorInput.inputEl.addClass("highlighter-settings-color");

		let promptInput: TextAreaComponent;
		setting.addTextArea((component) => {
			component.inputEl.rows = 6;
			// component.inputEl.style.width = "300px";
			// component.inputEl.style.fontSize = "10px";
			component.setPlaceholder("Prompt");
			component.inputEl.addClass("augmented-canvas-settings-prompt");
			promptInput = component;
		});

		setting.addButton((button) => {
			button
				.setIcon("lucide-plus")
				.setTooltip("Add")
				.onClick(async (buttonEl: any) => {
					let name = nameInput.inputEl.value;
					const prompt = promptInput.inputEl.value;

					// console.log({ name, prompt });

					if (!name || !prompt) {
						name && !prompt
							? new Notice("缺少提示词")
							: !name && prompt
							? new Notice("缺少名称")
							: new Notice("缺少值"); // else
						return;
					}

					// * Handles multiple with the same name
					// if (
					// 	this.plugin.settings.systemPrompts.filter(
					// 		(systemPrompt: SystemPrompt) =>
					// 			systemPrompt.act === name
					// 	).length
					// ) {
					// 	name += " 2";
					// }
					// let count = 3;
					// while (
					// 	this.plugin.settings.systemPrompts.filter(
					// 		(systemPrompt: SystemPrompt) =>
					// 			systemPrompt.act === name
					// 	).length
					// ) {
					// 	name = name.slice(0, -2) + " " + count;
					// 	count++;
					// }

					if (
						!this.plugin.settings.systemPrompts.filter(
							(systemPrompt: SystemPrompt) =>
								systemPrompt.act === name
						).length &&
						!this.plugin.settings.userSystemPrompts.filter(
							(systemPrompt: SystemPrompt) =>
								systemPrompt.act === name
						).length
					) {
						this.plugin.settings.userSystemPrompts.push({
							id:
								this.plugin.settings.systemPrompts.length +
								this.plugin.settings.userSystemPrompts.length,
							act: name,
							prompt,
						});
						await this.plugin.saveSettings();
						this.display();
					} else {
						buttonEl.stopImmediatePropagation();
						new Notice("此系统提示词名称已存在");
					}
				});
		});

		const listContainer = containerEl.createEl("div", {
			cls: "augmented-canvas-list-container",
		});

		this.plugin.settings.userSystemPrompts.forEach(
			(systemPrompt: SystemPrompt) => {
				const listElement = listContainer.createEl("div", {
					cls: "augmented-canvas-list-element",
				});

				const nameInput = new TextComponent(listElement);
				nameInput.setValue(systemPrompt.act);

				const promptInput = new TextAreaComponent(listElement);
				promptInput.inputEl.addClass(
					"augmented-canvas-settings-prompt"
				);
				promptInput.setValue(systemPrompt.prompt);

				const buttonSave = new ButtonComponent(listElement);
				buttonSave
					.setIcon("lucide-save")
					.setTooltip("Save")
					.onClick(async (buttonEl: any) => {
						let name = nameInput.inputEl.value;
						const prompt = promptInput.inputEl.value;

						// console.log({ name, prompt });
						this.plugin.settings.userSystemPrompts =
							this.plugin.settings.userSystemPrompts.map(
								(systemPrompt2: SystemPrompt) =>
									systemPrompt2.id === systemPrompt.id
										? {
												...systemPrompt2,
												act: name,
												prompt,
										  }
										: systemPrompt2
							);
						await this.plugin.saveSettings();
						this.display();
						new Notice("系统提示词已更新");
					});

				const buttonDelete = new ButtonComponent(listElement);
				buttonDelete
					.setIcon("lucide-trash")
					.setTooltip("Delete")
					.onClick(async (buttonEl: any) => {
						let name = nameInput.inputEl.value;
						const prompt = promptInput.inputEl.value;

						// console.log({ name, prompt });
						this.plugin.settings.userSystemPrompts =
							this.plugin.settings.userSystemPrompts.filter(
								(systemPrompt2: SystemPrompt) =>
									systemPrompt2.id !== systemPrompt.id
							);
						await this.plugin.saveSettings();
						this.display();
						new Notice("系统提示词已删除");
					});
			}
		);
	}
}

export default SettingsTab;
