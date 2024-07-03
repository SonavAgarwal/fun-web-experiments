import cN from "classnames";
import { Resizable } from "re-resizable";
import useMeasure from "react-use-measure";
import {
	CommandState,
	nothingPressed,
	onInsideButtonClick,
	onOuterButtonClick,
	showButtons,
	stateToButtonClasses,
	stateToButtonText,
} from "./buttons";
import { FlexBoxTree, useNumberHeight, useNumberWidth } from "./flexUtil";
import { useIsKeyPressed } from "./useIsKeyPressed";
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
	after = true,
}: Props) => {
	const [ref, bounds] = useMeasure();

	const selected = useSelectedStore((state) => state.selected);
	const setSelected = useSelectedStore((state) => state.setSelected);
	const isSelected = selected == box;

	// const ePressed = useIsKeyPressed("e");
	const vPressed = useIsKeyPressed("v");
	// const aPressed = useIsKeyPressed("a");
	// const sPressed = useIsKeyPressed("s");
	// const dPressed = useIsKeyPressed("d");
	// const fPressed = useIsKeyPressed("f");
	const commandPressed = useIsKeyPressed("meta");
	const commandShift = useIsKeyPressed("meta+shift");

	const commandState: CommandState = {
		command: commandPressed,
		commandShift: commandShift,
		v: vPressed,
		a: false,
		s: false,
		d: false,
		f: false,
	};
	// console.log("commandState", commandState);

	let isResizable = box.flex === 0 && vPressed;
	const enabledDirections = {
		top: isResizable && useNumberHeight(parent),
		right: isResizable && useNumberWidth(parent),
		bottom: isResizable && useNumberHeight(parent),
		left: isResizable && useNumberWidth(parent),
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
		width: box.flex === 0 && useNumberWidth(parent) ? box.width || 50 : "100%",
		height:
			box.flex === 0 && useNumberHeight(parent) ? box.height || 50 : "100%",
	};

	return (
		<>
			<Resizable
				handleClasses={handleClasses}
				size={size}
				onResizeStop={() => {
					box.width = bounds.width;
					box.height = bounds.height;
					update();
				}}
				enable={enabledDirections}
				className={cN("h-full w-full")}
				style={{
					flex: box.flex,
				}}
			>
				<div
					ref={ref}
					onClick={(e) => {
						setSelected(box);
						e.stopPropagation();
					}}
					className={cN(
						"h-full w-full bg-white",
						"ring-[1px] ring-inset ring-solid ring-black box-border",
						{ "!ring-blue-700 bg-blue-200 shadow-lg": isSelected },
						"hover:ring-blue-300 hover:shadow-lg",
						className
					)}
					style={{
						display: "flex",
						flexDirection: box.direction,
						// flex: box.flex,
						justifyContent: box.justify,
						alignItems: box.align,
						gap: showButtons(commandState, "other") ? 0 : box.gap * 4,
						padding: showButtons(commandState, "other") ? 12 : box.padding * 4,
					}}
				>
					{box.children.length >= 1 && showButtons(commandState, "other") && (
						<>
							<button
								className={cN(
									"fb absolute h-full w-3 left-0 top-0",
									stateToButtonClasses(commandState, "left")
								)}
								onClick={() => {
									onOuterButtonClick(
										commandState,
										box,
										"left",
										update,
										parent,
										index
									);
								}}
							>
								{stateToButtonText(commandState, "left")}
							</button>
							<button
								className={cN(
									"fb absolute h-full w-3 right-0 top-0",
									stateToButtonClasses(commandState, "left")
								)}
								onClick={() => {
									onOuterButtonClick(
										commandState,
										box,
										"right",
										update,
										parent,
										index
									);
								}}
							>
								{stateToButtonText(commandState, "right")}
							</button>
							<button
								className={cN(
									"fb absolute w-full h-3 left-0 top-0",
									stateToButtonClasses(commandState, "top")
								)}
								onClick={() => {
									onOuterButtonClick(
										commandState,
										box,
										"top",
										update,
										parent,
										index
									);
								}}
							>
								{stateToButtonText(commandState, "top")}
							</button>
							<button
								className={cN(
									"fb absolute w-full h-3 left-0 bottom-0",
									stateToButtonClasses(commandState, "bottom")
								)}
								onClick={() => {
									onOuterButtonClick(
										commandState,
										box,
										"bottom",
										update,
										parent,
										index
									);
								}}
							>
								{stateToButtonText(commandState, "bottom")}
							</button>
						</>
					)}
					{box.children.length === 0 && (
						<button
							className={cN(
								"fb absolute inset-3",
								stateToButtonClasses(commandState, "inside")
							)}
							onClick={() => {
								onInsideButtonClick(commandState, box, update, parent, index);
							}}
						>
							{stateToButtonText(commandState, "inside")}
						</button>
					)}
					{box.children.map((child, index) => (
						<FlexBox
							parent={box}
							key={index}
							box={child}
							update={update}
							after={index !== box.children.length - 1}
							index={index}
						></FlexBox>
					))}
					{box.children.length === 0 && nothingPressed(commandState) && (
						<textarea
							className="absolute inset-0 w-full h-full p-2 bg-transparent border-none text-center resize-none"
							value={box.text}
							onClick={(e) => {
								setSelected(box);
								e.stopPropagation();
							}}
							onChange={(e) => {
								box.text = e.target.value;
								update();
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === "Escape") {
									e.preventDefault();
									e.currentTarget.blur();
								}
							}}
						/>
					)}
				</div>
			</Resizable>
			{after && showButtons(commandState, "other") && (
				<button
					className={cN("fb", stateToButtonClasses(commandState, "between"), {
						"h-full w-3": parent?.direction === "row",
						"h-3 w-full": parent?.direction === "column",
					})}
					onClick={() => {
						onOuterButtonClick(
							commandState,
							box,
							"between",
							update,
							parent,
							index
						);
					}}
				>
					{stateToButtonText(commandState, "between")}
				</button>
			)}
		</>
	);
};

export default FlexBox;
