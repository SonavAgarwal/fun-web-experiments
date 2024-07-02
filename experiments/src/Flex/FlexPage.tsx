import { useReducer, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import FlexBox from "./FlexBox";
import "./flexPage.css";
import { Resizable } from "re-resizable";
import { useSelectedStore } from "./useSelectedStore";

export interface FlexBoxTree {
	direction: "row" | "column";
	flex: number;
	width?: number | string;
	height?: number | string;
	justify: "center" | "start" | "end" | "between" | "around";
	align: "center" | "start" | "end" | "between" | "around";
	gap: number;
	padding: number;
	children: FlexBoxTree[];
}

const FlexPage = () => {
	const selected = useSelectedStore((state) => state.selected);
	const setSelected = useSelectedStore((state) => state.setSelected);

	const [_, forceUpdate] = useReducer((x) => x + 1, 0);
	const box = useRef<FlexBoxTree>({
		direction: "column",
		flex: 1,
		justify: "center",
		align: "center",
		gap: 0,
		padding: 0,
		children: [],
	});

	return (
		<div className="h-lvh w-lvw flex flex-row">
			<div className="h-lvh flex-1 flex justify-center items-center">
				<Resizable
					className=""
					defaultSize={{ width: 500, height: 500 }}
					// onResize={(e, data) => {
					// 	console.log(data.size.width, data.size.height);
					// 	setWidth(data.size.width);
					// 	setHeight(data.size.height);
					// }}
				>
					<FlexBox
						box={box.current}
						update={forceUpdate}
						className="w-full h-full"
						after={false}
						parent={null}
					></FlexBox>
				</Resizable>
			</div>
			<div className="w-[20rem] h-lvh bg-gray-200 flex flex-col items-center justify-center p-4 box-border">
				{selected && (
					<>
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
							<option value="center">Center</option>
							<option value="start">Start</option>
							<option value="end">End</option>
							<option value="between">Between</option>
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
							<option value="center">Center</option>
							<option value="start">Start</option>
							<option value="end">End</option>
							<option value="between">Between</option>
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
					</>
				)}
			</div>
		</div>
	);
};

export default FlexPage;
