import classNames from "classnames";
import { FlexBoxTree } from "./FlexPage";
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { Resizable } from "re-resizable";
import { useSelectedStore } from "./useSelectedStore";

interface Props {
	box: FlexBoxTree;
	update: () => void;
	removeSelf?: () => void;
	index?: number;
	parent: FlexBoxTree | null;
	after?: boolean;
	className?: string;
}

const FlexBox = ({
	box,
	update,
	className,
	index,
	parent,
	removeSelf,

	after = true,
}: Props) => {
	const [ref, bounds] = useMeasure();

	const selected = useSelectedStore((state) => state.selected);
	const setSelected = useSelectedStore((state) => state.setSelected);
	const isSelected = selected == box;

	let isResizable = box.flex === 0;
	const enabledDirections = {
		top: isResizable && parent?.direction === "column",
		right: isResizable && parent?.direction === "row",
		bottom: isResizable && parent?.direction === "column",
		left: isResizable && parent?.direction === "row",
		topRight: false,
		bottomRight: false,
		bottomLeft: false,
		topLeft: false,
	};
	const handleClasses = {
		top: enabledDirections.top ? undefined : "hidden",
		right: enabledDirections.right ? undefined : "hidden",
		bottom: enabledDirections.bottom ? undefined : "hidden",
		left: enabledDirections.left ? undefined : "hidden",
		topRight: undefined,
		bottomRight: undefined,
		bottomLeft: undefined,
		topLeft: undefined,
	};
	const size = {
		width: isResizable && parent?.direction === "row" ? box.width : "100%",
		height: isResizable && parent?.direction === "column" ? box.height : "100%",
	};

	return (
		<>
			<Resizable
				// handleWrapperClass={"hidden"}
				handleClasses={handleClasses}
				size={size}
				onResizeStop={(e, direction, ref, d) => {
					box.width = d.width;
					box.height = d.height;
				}}
				enable={enabledDirections}
				className={classNames(
					// "ring-1 ring-black box-border"
					"h-full w-full"
					// "relative",
				)}
				style={{
					flex: box.flex,
				}}
			>
				<div
					onClick={(e) => {
						setSelected(box);
						e.stopPropagation();
					}}
					className={classNames(
						// "ring-1 ring-black box-border"
						"h-full w-full",
						"border-[1px] border-solid border-black box-border",
						"hover:border-blue-300 hover:shadow-lg",
						{ "!border-blue-700 shadow-lg": isSelected }
						// "border-[1px] border-solid border-black box-border"
						// "relative",
					)}
					style={{
						display: "flex",
						flexDirection: box.direction,
						// flex: box.flex,
						justifyContent: box.justify,
						alignItems: box.align,
						gap: box.gap,
						padding: box.padding + 8,
					}}
				>
					{box.children.length >= 1 && (
						<>
							<AddButton
								box={box}
								update={update}
								className={"absolute w-2 h-full left-0 top-0"}
								position="left"
								removeSelf={removeSelf}
								parent={parent}
							/>
							<AddButton
								box={box}
								update={update}
								className={"absolute w-2 h-full right-0 top-0"}
								position="right"
								removeSelf={removeSelf}
								parent={parent}
							/>
							<AddButton
								box={box}
								update={update}
								className={"absolute h-2 w-full left-0 top-0"}
								position="top"
								removeSelf={removeSelf}
								parent={parent}
							/>
							<AddButton
								box={box}
								update={update}
								className={"absolute h-2 w-full left-0 bottom-0"}
								position="bottom"
								removeSelf={removeSelf}
								parent={parent}
							/>
						</>
					)}
					{box.children.length === 0 && (
						<AddButton
							box={box}
							update={update}
							position="inside"
							removeSelf={removeSelf}
							parent={parent}
						></AddButton>
					)}
					{box.children.map((child, index) => (
						<FlexBox
							parent={box}
							key={index}
							box={child}
							update={update}
							removeSelf={() => {
								box.children.splice(index, 1);

								update();
							}}
							// no after if we are the last child
							after={index !== box.children.length - 1}
							index={index}
						></FlexBox>
					))}
				</div>
			</Resizable>
			{after && (
				<AddButton
					box={box}
					update={update}
					className={classNames("", {
						"w-2 h-full": parent?.direction === "row",
						"w-full h-2": parent?.direction === "column",
					})}
					position="between"
					index={index}
					isAfter
					removeSelf={removeSelf}
					parent={parent}
				/>
			)}
		</>
	);
};

function AddButton({
	box,
	update,
	position,
	isAfter,
	className,
	removeSelf,
	index,
	parent,
}: {
	box: FlexBoxTree;
	update: () => void;
	position?: "top" | "bottom" | "left" | "right" | "inside" | "between";
	index?: number;
	isAfter?: boolean;
	className?: string;
	removeSelf?: () => void;

	parent: FlexBoxTree | null;
}) {
	const [inverted, setInverted] = useState(false);
	useHotkeys(
		"shift",
		() => {
			if (position === "inside") setInverted(isHotkeyPressed("shift"));
		},
		{
			keydown: true,
			keyup: true,
		}
	);

	const [optionPressed, setOptionPressed] = useState(false);
	useHotkeys(
		"f",
		() => {
			setOptionPressed(isHotkeyPressed("f"));
		},
		{
			keydown: true,
			keyup: true,
		}
	);
	const [sPressed, setSPressed] = useState(false);
	useHotkeys(
		"s",
		() => {
			setSPressed(isHotkeyPressed("s"));
		},
		{
			keydown: true,
			keyup: true,
		}
	);

	// const [gapPressed, setGapPressed] = useState(false);
	// useHotkeys(
	// 	"g",
	// 	() => {
	// 		setGapPressed(isHotkeyPressed("g"));
	// 	},
	// 	{
	// 		keydown: true,
	// 		keyup: true,
	// 	}
	// );
	// const [paddingPressed, setPaddingPressed] = useState(false);
	// useHotkeys(
	// 	"w",
	// 	() => {
	// 		setPaddingPressed(isHotkeyPressed("w"));
	// 	},
	// 	{
	// 		keydown: true,
	// 		keyup: true,
	// 	}
	// );

	function getButtonText() {
		if (optionPressed) {
			if (box.flex === 0) {
				return "f";
			} else {
				return "u";
			}
		} else if (inverted) {
			return "⨯";
		} else {
			return "+";
		}
	}

	const onClick = () => {
		if (sPressed) return;

		// // HANDLE CHANGING PADDING AND GAP
		// if (paddingPressed) {
		// 	if (inverted) box.padding = Math.max(0, box.padding - 1);
		// 	else box.padding += 1;
		// 	update();
		// 	return;
		// }
		// if (gapPressed) {
		// 	if (inverted) box.gap = Math.max(0, box.gap - 1);
		// 	else box.gap += 1;
		// 	update();
		// 	return;
		// }

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
				if (optionPressed) {
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

	return (
		<button
			className={classNames(
				"flex items-center justify-center min-w-2 min-h-2 transition-all duration-100 ease-in-out outline-none opacity-0 hover:opacity-100",
				{
					"bg-blue-300": !inverted,
					"bg-red-300": inverted,
					"bg-yellow-300": optionPressed && position === "inside",
					"!bg-transparent": sPressed,
					// // green to black vertical gradient
					// "bg-gradient-to-b from-green-300 to-gray-600":
					// 	gapPressed && !inverted,
					// // flipped direction
					// "bg-gradient-to-t from-green-300 to-gray-600": gapPressed && inverted,
					// // orange to black vertical gradient
					// "bg-gradient-to-b from-orange-300 to-gray-600":
					// 	paddingPressed && !inverted,
					// // flipped direction
					// "bg-gradient-to-t from-orange-300 to-gray-600":
					// 	paddingPressed && inverted,
				},
				{
					"w-full": position === "inside",
					"h-full": position === "inside",
					"flex-1": box.children.length === 0 && !isAfter,
				},
				className
			)}
			onClick={onClick}
		>
			{/* {getButtonText()} */}
		</button>
	);
}

export default FlexBox;
