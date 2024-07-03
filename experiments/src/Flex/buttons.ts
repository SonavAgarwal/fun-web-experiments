import { exp } from "three/examples/jsm/nodes/Nodes.js";
import { FlexBoxTree, createFlexBoxTree } from "./flexUtil";

export type ButtonPosition =
	| "top"
	| "bottom"
	| "left"
	| "right"
	| "inside"
	| "between"
	| "other";

export interface CommandState {
	command: boolean;
	commandShift: boolean;
	v: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
	f: boolean;
}

export function stateToButtonClasses(
	state: CommandState,
	position: ButtonPosition
) {
	// if we're an outside button
	if (["top", "bottom", "left", "right"].includes(position)) {
		return {
			"bg-transparent": nothingPressed(state),
			"pointer-events-none":
				nothingPressed(state) ||
				(state.v && !state.command && !state.commandShift),
			"bg-blue-500": state.command,
		};
	}
	// if we're an inside button
	else if (["inside", "between"].includes(position)) {
		return {
			"bg-transparent": nothingPressed(state),
			"pointer-events-none":
				nothingPressed(state) ||
				(state.v && !state.command && !state.commandShift),
			"bg-blue-500": state.command,
			"bg-red-300 !inset-0 w-full h-full": state.commandShift,
		};
	}
}

export function showButtons(state: CommandState, position: ButtonPosition) {
	if (["top", "bottom", "left", "right", "other"].includes(position)) {
		return state.v || state.command || state.commandShift;
	} else {
		return state.command || state.commandShift;
	}
}

export function stateToButtonText(
	state: CommandState,
	position: ButtonPosition
) {
	if (["inside"].includes(position)) {
		if (state.commandShift) {
			return "⨯";
		} else if (state.command) {
			return "+";
		} else {
			return "";
		}
	}
	if (["top", "bottom", "left", "right", "between"].includes(position)) {
		if (state.command) {
			return "+";
		} else {
			return "";
		}
	}
	return "";
}

export function nothingPressed(state: CommandState) {
	for (const key in state) {
		if (state[key as keyof CommandState]) {
			return false;
		}
	}
	return true;
}

export function onOuterButtonClick(
	state: CommandState,
	box: FlexBoxTree,
	position: "top" | "bottom" | "left" | "right",
	update: () => void
) {
	let newBox: FlexBoxTree = createFlexBoxTree();

	let newBox2: FlexBoxTree = createFlexBoxTree();

	switch (position) {
		case "top":
			if (box.children.length <= 1 || box.direction === "column") {
				box.direction = "column";
				box.children.unshift(newBox);
			} else {
				newBox2.direction = box.direction;
				newBox2.children = box.children;
				box.children = [newBox2];
				box.direction = "column";
				box.children.unshift(newBox);
			}

			break;
		case "bottom":
			if (box.children.length <= 1 || box.direction === "column") {
				box.direction = "column";
				box.children.push(newBox);
			} else {
				newBox2.direction = box.direction;
				newBox2.children = box.children;
				box.children = [newBox2];
				box.direction = "column";
				box.children.push(newBox);
			}
			break;
		case "left":
			if (box.children.length <= 1 || box.direction === "row") {
				box.direction = "row";
				box.children.unshift(newBox);
			} else {
				newBox2.direction = box.direction;
				newBox2.children = box.children;
				box.children = [newBox2];
				box.direction = "row";
				box.children.unshift(newBox);
			}
			break;
		case "right":
			if (box.children.length <= 1 || box.direction === "row") {
				box.direction = "row";
				box.children.push(newBox);
			} else {
				newBox2.direction = box.direction;
				newBox2.children = box.children;
				box.children = [newBox2];
				box.direction = "row";
				box.children.push(newBox);
			}
			break;
	}
	update();
}

export function onInsideButtonClick(
	state: CommandState,
	box: FlexBoxTree,
	update: () => void,
	parent: FlexBoxTree | null = null,
	index: number = -1
) {
	if (state.commandShift) {
		if (parent) {
			parent.children.splice(index, 1);
		}
		update();
		return;
	}

	let newBox: FlexBoxTree = createFlexBoxTree();

	if (index === -1) {
		box.children.push(newBox);
	} else {
		if (parent) {
			parent.children.splice(index, 0, newBox);
		}
	}

	update();
}
