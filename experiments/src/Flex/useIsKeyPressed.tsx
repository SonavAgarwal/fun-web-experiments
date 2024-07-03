import { useState } from "react";
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook";

export const useIsKeyPressed = (key: string) => {
	const [isKeyPressed, setIsKeyPressed] = useState(false);

	useHotkeys(
		key,
		() => {
			// console.log("in useIsKeyPressed for key: " + key, event, handler);
			// console.log("in useIsKeyPressed for key: " + key, isHotkeyPressed(key));
			setIsKeyPressed(isHotkeyPressed(key, "+"));
			// setIsKeyPressed((prev) => {
			// 	console.log("in useIsKeyPressed for key: " + key, !prev);
			// 	return !prev;
			// });
		},
		{
			keydown: true,
			keyup: true,
			ignoreModifiers: key.length === 1,
			preventDefault: true,
		}
	);

	return isKeyPressed;
};
