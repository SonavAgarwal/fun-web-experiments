import classNames from "classnames";
import { FlexBoxTree } from "./flexUtil";
import { useIsKeyPressed } from "./useIsKeyPressed";

function AddButton({
	box,
	update,
	position,
	isAfter,
	className,
	removeSelf,
	index,
	parent,
	show = true,
}: {
	box: FlexBoxTree;
	update: () => void;
	position?: "top" | "bottom" | "left" | "right" | "inside" | "between";
	index?: number;
	isAfter?: boolean;
	className?: string;
	removeSelf?: () => void;
	show?: boolean;
	parent: FlexBoxTree | null;
	onClick?: () => void;
}) {
	const inverted = useIsKeyPressed("shift");
	const fPressed = useIsKeyPressed("f");
	const vPressed = useIsKeyPressed("v");

	function getButtonText() {
		if (vPressed) return "";
		if (fPressed && position === "inside") {
			if (box.flex === 0) {
				return "↔";
			} else {
				return "↮";
			}
		} else if (inverted) {
			return "⨯";
		} else {
			return "+";
		}
	}

	const onClick = () => {
		// HANDLE ADDING NEW BOXES

		let newBox: FlexBoxTree = {
			direction: "row",
			flex: 1,
			justify: "center",
			align: "center",
			gap: 0,
			padding: 0,
			children: [],
		};

		let newBox2: FlexBoxTree = {
			direction: "row",
			flex: 1,
			justify: "center",
			align: "center",
			gap: 0,
			padding: 0,
			children: [],
		};

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
			case "inside":
				if (fPressed) {
					box.flex = box.flex === 0 ? 1 : 0;
				} else if (inverted) {
					removeSelf!();
				} else {
					box.children.push(newBox);
				}
				break;
			case "between":
				parent?.children.splice(index! + 1, 0, newBox);
				break;
		}

		update();
	};

	if (!show) return null;

	return (
		<button
			disabled={vPressed || !show}
			className={classNames(
				"flex items-center justify-center min-w-2 min-h-2 transition-all duration-100 ease-in-out outline-none opacity-0 hover:opacity-100 text-sm",
				{
					"pointer-events-none": vPressed,
					"bg-blue-300": !inverted,
					"bg-red-300": inverted,
					"bg-yellow-300": fPressed && position === "inside",
					"!bg-transparent": vPressed,
				},
				{
					// "hover:opacity-0": !show,
					"w-full": position === "inside",
					"h-full": position === "inside",
					"flex-1": box.children.length === 0 && !isAfter,
				},
				{
					"w-0": !show,
					"h-0": !show,
				},
				{
					"text-xl": position === "inside",
				},
				className
			)}
			onClick={onClick}
		>
			{getButtonText()}
		</button>
	);
}

export default AddButton;
