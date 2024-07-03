export type JustifyOptionsType =
	| "center"
	| "start"
	| "end"
	| "space-between"
	| "space-around"
	| "space-evenly";
export const JUSTIFY_OPTIONS: JustifyOptionsType[] = [
	"center",
	"start",
	"end",
	"space-between",
	"space-around",
	"space-evenly",
];

export type AlignOptionsType =
	| "stretch"
	| "center"
	| "start"
	| "end"
	| "baseline";
export const ALIGN_OPTIONS: AlignOptionsType[] = [
	"stretch",
	"center",
	"start",
	"end",
	"baseline",
];

export type DirectionOptionsType = "row" | "column";
export const DIRECTION_OPTIONS: DirectionOptionsType[] = ["row", "column"];

export type FlexOptionsType = 0 | 1;
export const FLEX_OPTIONS: FlexOptionsType[] = [0, 1];

export interface FlexBoxTree {
	direction: DirectionOptionsType;
	flex: FlexOptionsType;
	width?: number | string;
	height?: number | string;
	justify: JustifyOptionsType;
	align: AlignOptionsType;
	gap: number;
	padding: number;
	children: FlexBoxTree[];
	text?: string;
}

export function createFlexBoxTree(): FlexBoxTree {
	return {
		direction: "column",
		flex: 1,
		justify: "center",
		align: "stretch",
		gap: 0,
		padding: 0,
		children: [],
	};
}

const justifyMap: { [key in FlexBoxTree["justify"]]: string } = {
	center: "justify-center",
	start: "justify-start",
	end: "justify-end",
	"space-between": "justify-between",
	"space-around": "justify-around",
	"space-evenly": "justify-evenly",
};

const alignMap: { [key in FlexBoxTree["align"]]: string } = {
	center: "items-center",
	start: "items-start",
	end: "items-end",
	baseline: "items-baseline",
	stretch: "items-stretch",
};

export function translateToTailwind(
	flexBoxTree: FlexBoxTree | null,
	parent: FlexBoxTree | null = null,
	indentLevel = 0,
	_ = 0
): string {
	if (!flexBoxTree) return "";
	const {
		direction,
		flex,
		width,
		height,
		justify,
		align,
		gap,
		padding,
		children,
		text,
	} = flexBoxTree;

	const getWidth = () => {
		if (
			useNumberWidth(parent) &&
			typeof width === "number" &&
			!!width &&
			width > 0
		)
			return `w-${numberToTailwindNumber(width)}`;
		return "w-full";
	};
	const getHeight = () => {
		if (
			useNumberHeight(parent) &&
			typeof height === "number" &&
			!!height &&
			height > 0
		)
			return `h-${numberToTailwindNumber(height)}`;
		return "h-full";
	};

	const classes = [
		`flex`,
		direction === "row" ? "flex-row" : "flex-col",
		flex > 0 && `flex-${flex}`,
		justifyMap[justify],
		alignMap[align],
		gap ? `gap-${numberToTailwindNumber(gap)}` : "",
		padding ? `p-${numberToTailwindNumber(padding)}` : "",
		getWidth(),
		getHeight(),
	]
		.filter(Boolean)
		.join(" ");

	let childDivs = children
		.map((child) => translateToTailwind(child, flexBoxTree, indentLevel + 1))
		.join("\n");
	if (children.length === 0 && text) {
		// comment with text
		childDivs = `<!-- ${text} -->`;
	}
	let childDivLines = childDivs.split("\n");
	childDivs = childDivLines.map((line) => `\t${line}`).join("\n");

	return `<div class="${classes}">\n${childDivs}\n</div>`;
}

function numberToTailwindNumber(num: number) {
	return Math.round(num / 16) * 4;
}

export function useNumberWidth(parent: FlexBoxTree | null) {
	if (!parent) return false;
	return parent.direction === "row" || parent.align !== "stretch";
}
export function useNumberHeight(parent: FlexBoxTree | null) {
	if (!parent) return false;
	return parent.direction === "column" || parent.align !== "stretch";
}
