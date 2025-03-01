import { App, setIcon, setTooltip } from "obsidian";
import { getTokenLimit, noteGenerator } from "./noteGenerator";
import { AugmentedCanvasSettings } from "../../settings/AugmentedCanvasSettings";
import { CanvasNode } from "../../obsidian/canvas-internal";
import { getResponse } from "../../utils/chatgpt";
import { getActiveCanvas, getActiveCanvasNodes } from "src/utils";

const SYSTEM_PROMPT_QUESTIONS = `
Generate a list of relevant questions based on the given content.
Each question should be on a new line.
Number each question.
Questions should be open-ended and encourage deeper thinking.
The response must be in the same language as the input.
`.trim();

export const addAskAIButton = async (
	app: App,
	settings: AugmentedCanvasSettings,
	menuEl: HTMLElement
) => {
	const buttonEl_AskAI = createEl("button", "clickable-icon gpt-menu-item");
	setTooltip(buttonEl_AskAI, "Ask AI", {
		placement: "top",
	});
	setIcon(buttonEl_AskAI, "lucide-sparkles");
	menuEl.appendChild(buttonEl_AskAI);

	buttonEl_AskAI.addEventListener("click", async () => {
		const { generateNote } = noteGenerator(app, settings);

		await generateNote();
	});
};

export const handleCallGPT_Question = async (
	app: App,
	settings: AugmentedCanvasSettings,
	node: CanvasNode,
	question: string
) => {
	if (node.unknownData.type === "group") {
		return;
	}

	const { generateNote } = noteGenerator(app, settings);
	await generateNote(question);
};

export const handleCallGPT_Questions = async (
	app: App,
	settings: AugmentedCanvasSettings,
	node: CanvasNode
) => {
	const { buildMessages } = noteGenerator(app, settings);
	const { messages, tokenCount } = await buildMessages(node, {
		systemPrompt: SYSTEM_PROMPT_QUESTIONS,
	});
	if (messages.length <= 1) return;

	try {
		const response = await getResponse(
			settings.apiKey,
			messages,
			{
				model: settings.apiModel,
				max_tokens: settings.maxResponseTokens || undefined,
				temperature: settings.temperature,
			}
		);

		const lines = response.split('\n').filter(line => line.trim());
		const questions = lines.map(line => {
			return line.replace(/^\d+[\.\)]\s*/, '').trim();
		}).filter(q => q.length > 0);

		return questions;
	} catch (error) {
		logDebug("Error generating questions:", error);
		new Notice("Failed to generate questions");
		return [];
	}
};

const handleRegenerateResponse = async (
	app: App,
	settings: AugmentedCanvasSettings
) => {
	const activeNode = getActiveCanvasNodes(app)![0];

	const { generateNote } = noteGenerator(
		app,
		settings,
		activeNode.from.node,
		activeNode.to.node
	);

	await generateNote();
};

export const addRegenerateResponse = async (
	app: App,
	settings: AugmentedCanvasSettings,
	menuEl: HTMLElement
) => {
	const buttonEl_AskAI = createEl("button", "clickable-icon gpt-menu-item");
	setTooltip(buttonEl_AskAI, "Regenerate response", {
		placement: "top",
	});
	setIcon(buttonEl_AskAI, "lucide-rotate-cw");
	menuEl.appendChild(buttonEl_AskAI);

	buttonEl_AskAI.addEventListener("click", () =>
		handleRegenerateResponse(app, settings)
	);
};
