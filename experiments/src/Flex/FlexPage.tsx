import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Resizable } from "re-resizable";
import { useReducer, useRef } from "react";
import { CopyBlock, atomOneLight } from "react-code-blocks";
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook";
import FlexBox from "./FlexBox";
import "./flexPage.css";
import {
	ALIGN_OPTIONS,
	DIRECTION_OPTIONS,
	FLEX_OPTIONS,
	FlexBoxTree,
	JUSTIFY_OPTIONS,
	createFlexBoxTree,
	translateToTailwind,
} from "./flexUtil";
import { useSelectedStore } from "./useSelectedStore";
import toast, { Toaster } from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { useIsKeyPressed } from "./useIsKeyPressed";

const FlexPage = () => {
	const selected = useSelectedStore((state) => state.selected);
	const setSelected = useSelectedStore((state) => state.setSelected);

	const [updateCount, forceUpdate] = useReducer((x) => x + 1, 0);
	const box = useRef<FlexBoxTree>(createFlexBoxTree());

	useHotkeys("escape", () => {
		setSelected(null);
	});
	// useHotkeys(
	// 	["meta+s", ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `meta+${i}`)],
	// 	() => {
	//
	// 	},
	// 	{
	// 		preventDefault: true,
	// 	}
	// );

	//
	// 	"JUSTIFY_OPTIONS.map((_, i) => `meta+s+${i}`)",
	// 	JUSTIFY_OPTIONS.map((_, i) => `meta+s+${i}`)
	// );

	useHotkeys(
		[...JUSTIFY_OPTIONS.map((_, i) => `s+${i + 1}`)],
		(_, handler) => {
			if (!selected) return;
			if (!handler || !handler.keys) return;

			let index = handler.keys?.findIndex((key) => !isNaN(parseInt(key)));
			if (!index || index < 0) return;

			let num = parseInt(handler.keys[index]) - 1;
			selected.justify = JUSTIFY_OPTIONS[num];
			forceUpdate();
		},
		{
			preventDefault: true,
			ignoreModifiers: true,
		}
	);

	useHotkeys(
		[...ALIGN_OPTIONS.map((_, i) => `a+${i + 1}`)],
		(_, handler) => {
			if (!selected) return;
			if (!handler || !handler.keys) return;

			let index = handler.keys?.findIndex((key) => !isNaN(parseInt(key)));
			if (!index || index < 0) return;

			let num = parseInt(handler.keys[index]) - 1;
			selected.align = ALIGN_OPTIONS[num];
			forceUpdate();
		},
		{
			preventDefault: true,
			ignoreModifiers: true,
		}
	);

	useHotkeys(
		[...DIRECTION_OPTIONS.map((_, i) => `d+${i + 1}`)],
		(_, handler) => {
			console.log("handler", handler);
			if (!selected) return;
			if (!handler || !handler.keys) return;

			let index = handler.keys?.findIndex((key) => !isNaN(parseInt(key)));
			if (!index || index < 0) return;

			let num = parseInt(handler.keys[index]) - 1;
			selected.direction = DIRECTION_OPTIONS[num];
			console.log("selected.direction", selected.direction);
			forceUpdate();
		},
		{
			preventDefault: true,
			ignoreModifiers: true,
		}
	);

	useHotkeys(
		[...FLEX_OPTIONS.map((_, i) => `f+${i + 1}`)],
		(_, handler) => {
			if (!selected) return;
			if (!handler || !handler.keys) return;

			let index = handler.keys?.findIndex((key) => !isNaN(parseInt(key)));
			if (!index || index < 0) return;

			let num = parseInt(handler.keys[index]) - 1;
			selected.flex = FLEX_OPTIONS[num];
			forceUpdate();
		},
		{
			preventDefault: true,
			ignoreModifiers: true,
		}
	);

	return (
		<div>
			<Toaster />
			<div className="h-lvh w-lvw flex flex-row">
				<div className="h-lvh flex-1 flex justify-center items-center">
					<Resizable
						className=""
						defaultSize={{ width: 500, height: 500 }}
						// onResize={(e, data) => {
						//
						// 	setWidth(data.size.width);
						// 	setHeight(data.size.height);
						// }}
					>
						<FlexBox
							box={box.current}
							update={forceUpdate}
							className={"w-full h-full"}
							after={false}
							parent={null}
						></FlexBox>
					</Resizable>
				</div>
				<div className="w-[20rem] h-lvh bg-gray-200 flex flex-col p-4 box-border">
					{selected && (
						<>
							<label className="mb-2 w-full text-left">Direction</label>
							<select
								value={selected.direction}
								onChange={(e) => {
									if (!selected) return;
									selected.direction = e.target.value as any;
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							>
								{DIRECTION_OPTIONS.map((option) => (
									<option value={option} className="capitalize">
										{option}
									</option>
								))}
							</select>
							<label className="mb-2 w-full text-left">Flex</label>
							<select
								value={selected.flex}
								onChange={(e) => {
									if (!selected) return;
									selected.flex = e.target.value as any;
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							>
								{FLEX_OPTIONS.map((option) => (
									<option value={option} className="capitalize">
										{option}
									</option>
								))}
							</select>
							<label className="mb-2 w-full text-left">Justify</label>
							<select
								value={selected.justify}
								onChange={(e) => {
									if (!selected) return;
									selected.justify = e.target.value as any;
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							>
								{JUSTIFY_OPTIONS.map((option) => (
									<option value={option} className="capitalize">
										{option}
									</option>
								))}
							</select>
							<label className="mb-2 w-full text-left">Align</label>
							<select
								value={selected.align}
								onChange={(e) => {
									if (!selected) return;
									selected.align = e.target.value as any;
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							>
								{ALIGN_OPTIONS.map((option) => (
									<option value={option} className="capitalize">
										{option}
									</option>
								))}
							</select>
							<label className="mb-2 w-full text-left">Padding</label>
							<input
								type="number"
								value={selected.padding}
								onChange={(e) => {
									if (!selected) return;
									selected.padding = parseInt(e.target.value);
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							/>
							<label className="mb-2 w-full text-left">Gap</label>
							<input
								type="number"
								value={selected.gap}
								onChange={(e) => {
									if (!selected) return;
									selected.gap = parseInt(e.target.value);
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							/>

							{/* width and height */}
							<label className="mb-2 w-full text-left">Width</label>
							<input
								type="number"
								value={selected.width}
								onChange={(e) => {
									if (!selected) return;
									selected.width = parseInt(e.target.value);
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							/>
							<label className="mb-2 w-full text-left">Height</label>
							<input
								type="number"
								value={selected.height}
								onChange={(e) => {
									if (!selected) return;
									selected.height = parseInt(e.target.value);
									forceUpdate();
								}}
								className="w-full h-12 border-none bg-white rounded-lg p-4 box-border mb-4 "
							/>
						</>
					)}
				</div>
			</div>
			<div className="w-full p-4 bg-gray-200 relative">
				<button
					onClick={() => {
						// copy to clipboard
						let code = translateToTailwind(
							selected || box.current,
							null,
							0,
							updateCount
						);
						navigator.clipboard.writeText(code);
						toast.success("Copied to clipboard");
					}}
					className="p-4 bg-blue-500 text-white rounded-lg absolute top-8 right-8"
				>
					<FaCopy className="" />
				</button>
				<SyntaxHighlighter
					// codeBlockStyle={{
					// 	width: "100%",
					// 	boxSizing: "border-box",
					// 	padding: "1rem",
					// }}
					language="tsx"
					// showLineNumbers={false}
					// wrapLines
					// wrapLongLines
					// theme={atomOneLight}
					// wrapLongLines
					customStyle={{
						marginTop: 0,
						borderRadius: "0.5rem",
					}}
				>
					{translateToTailwind(selected || box.current, 0, updateCount)}{" "}
				</SyntaxHighlighter>
			</div>
		</div>
	);
};

export default FlexPage;
