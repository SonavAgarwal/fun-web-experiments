export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;
// 2D array
export const MAP = Array.from({ length: MAP_HEIGHT }, () =>
	Array.from({ length: MAP_WIDTH }, () => 0)
);

// Set walls
for (let i = 0; i < MAP_HEIGHT; i++) {
	MAP[i][0] = 1;
	MAP[i][MAP_WIDTH - 1] = 1;
}
for (let i = 0; i < MAP_WIDTH; i++) {
	MAP[0][i] = 1;
	MAP[MAP_HEIGHT - 1][i] = 1;
}

export const COLORS = {
	DARK_GRAY: "#333333",
	LIGHT_GRAY: "#CCCCCC",
	LIGHT_GREEN: "#00FF00",
	DARK_GREEN: "#00AA00",
	RED: "#FF0000",
	SNAKE_1: "#0000FF",
	SNAKE_2: "#0000AA",
};
