import { App, Canvas, Menu } from "obsidian";
import { CanvasNode } from "./obsidian/canvas-internal";
import { AugmentedCanvasSettings } from "./settings/AugmentedCanvasSettings";
import { CustomQuestionModal } from "./CustomQuestionModal";
import {
	handleCallGPT_Question,
	handleCallGPT_Questions,
} from "./advancedCanvas";
import { handleCanvasMenu_Loaded, handleCanvasMenu_Loading } from "./utils";
import { getResponse } from "./chatgpt";

export const handlePatchNoteMenu = async (
	buttonEl_AskQuestions: HTMLButtonElement,
	menuEl: HTMLElement,
	{
		app,
		settings,
		canvas,
	}: {
		app: App;
		settings: AugmentedCanvasSettings;
		canvas: Canvas;
	}
) => {
	const pos = buttonEl_AskQuestions.getBoundingClientRect();
	if (!buttonEl_AskQuestions.hasClass("has-active-menu")) {
		buttonEl_AskQuestions.toggleClass("has-active-menu", true);
		const menu = new Menu();
		// const containingNodes =
		// 	this.canvas.getContainingNodes(
		// 		this.selection.bbox
		// 	);

		const node = <CanvasNode | undefined>(
			Array.from(canvas.selection)?.first()
		);
		if (!node) return;

		handleCanvasMenu_Loading(
			menu,
			node.unknownData.questions,
			async (question) => {
				if (!question) {
					let modal = new CustomQuestionModal(
						app,
						(question2: string) => {
							handleCallGPT_Question(
								app,
								settings,
								// @ts-expect-error
								<CanvasNode>(
									Array.from(canvas.selection)?.first()!
								),
								question2
							);
							// Handle the input
						}
					);
					modal.open();
				} else {
					handleCallGPT_Question(
						app,
						settings,
						// @ts-expect-error
						<CanvasNode>Array.from(canvas.selection)?.first(),
						question
					);
				}

				let modal = new CustomQuestionModal(
					app,
					(question2: string) => {
						handleCallGPT_Question(
							app,
							settings,
							// @ts-expect-error
							<CanvasNode>Array.from(canvas.selection)?.first()!,
							question2
						);
						// Handle the input
					}
				);
				modal.open();
			}
		);
		menu.setParentElement(menuEl).showAtPosition({
			x: pos.x,
			y: pos.bottom,
			width: pos.width,
			overlap: true,
		});

		if (node.unknownData.questions) return;

		const questions = await handleCallGPT_Questions(app, settings, node);
		node.unknownData.questions = questions;

		menu.hide();

		const menu2 = new Menu();

		handleCanvasMenu_Loaded(menu2, questions, async (question?: string) => {
			if (!question) {
				let modal = new CustomQuestionModal(
					app,
					(question2: string) => {
						handleCallGPT_Question(
							app,
							settings,
							// @ts-expect-error
							<CanvasNode>Array.from(canvas.selection)?.first()!,
							question2
						);
						// Handle the input
					}
				);
				modal.open();
			} else {
				handleCallGPT_Question(
					app,
					settings,
					// @ts-expect-error
					<CanvasNode>Array.from(canvas.selection)?.first(),
					question
				);
			}
		});
		menu2.setParentElement(menuEl).showAtPosition({
			x: pos.x,
			y: pos.bottom,
			width: pos.width,
			overlap: true,
		});
	}
};
