import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { logDebug } from "src/logDebug";

export type Message = {
	role: string;
	content: string;
};

export const streamResponse = async (
	apiKey: string,
	messages: ChatCompletionMessageParam[],
	{
		max_tokens,
		model,
		temperature,
	}: {
		max_tokens?: number;
		model?: string;
		temperature?: number;
	} = {},
	cb: any
) => {
	logDebug("Calling AI :", {
		messages,
		model,
		max_tokens,
		temperature,
		isJSON: false,
	});

	const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: model || "Qwen/Qwen2.5-7B-Instruct",
			messages,
			max_tokens,
			temperature,
			stream: true,
		}),
	});

	const reader = response.body?.getReader();
	if (!reader) {
		throw new Error("Failed to get response reader");
	}

	const decoder = new TextDecoder();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			cb(null);
			break;
		}

		const chunk = decoder.decode(value);
		const lines = chunk.split('\n').filter(line => line.trim());
		
		for (const line of lines) {
			if (line.startsWith('data: ')) {
				const content = line.slice(6);
				if (content.trim() === '[DONE]') {
					continue;
				}
				try {
					const data = JSON.parse(content);
					cb(data.choices[0]?.delta?.content || "");
				} catch (e) {
					logDebug("Error parsing JSON:", { content, error: e });
					continue;
				}
			}
		}
	}
};

export const getResponse = async (
	apiKey: string,
	messages: ChatCompletionMessageParam[],
	{
		model,
		max_tokens,
		temperature,
		isJSON,
	}: {
		model?: string;
		max_tokens?: number;
		temperature?: number;
		isJSON?: boolean;
	} = {}
) => {
	logDebug("Calling AI :", {
		messages,
		model,
		max_tokens,
		temperature,
		isJSON,
	});

	const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: model || "Qwen/Qwen2.5-7B-Instruct",
			messages,
			max_tokens,
			temperature,
			response_format: isJSON ? { type: "json_object" } : undefined,
		}),
	});

	const completion = await response.json();

	logDebug("AI response", { completion });
	return isJSON
		? JSON.parse(completion.choices[0].message.content)
		: completion.choices[0].message.content;
};

let count = 0;
export const createImage = async (
	apiKey: string,
	prompt: string,
	{
		isVertical = false,
		model,
	}: {
		isVertical?: boolean;
		model?: string;
	}
) => {
	logDebug("Calling AI :", {
		prompt,
		model,
	});
	const openai = new OpenAI({
		apiKey: apiKey,
		dangerouslyAllowBrowser: true,
	});

	count++;
	// console.log({ createImage: { prompt, count } });
	const response = await openai.images.generate({
		model: model || "dall-e-3",
		prompt,
		n: 1,
		size: isVertical ? "1024x1792" : "1792x1024",
		response_format: "b64_json",
	});
	logDebug("AI response", { response });
	// console.log({ responseImg: response });
	return response.data[0].b64_json!;
};
