import { useState } from "react";
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook";

export const useIsKeyPressed = (key: string) => {
	const [isKeyPressed, setIsKeyPressed] = useState(false);

	useHotkeys(
		key,
		(event, handler) => {
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

function isHotkeyPressed2(key: string, handler: any) {
	key = key.toLowerCase();
	let keyParts = key.split("+");
	let keys = keyParts.filter((key) => key.length === 1);
	let modifiers = keyParts.filter((key) => key.length > 1);

	console.log("keys", keys);
	console.log("modifiers", modifiers);

	// check that keys === handler.keys
	if (keys.length !== handler.keys.length) {
		return false;
	}
	for (const key of keys) {
		if (!handler.keys.includes(key)) {
			console.log("key", key);
			return false;
		}
	}

	// go through all keys of the handler object
	let handlerKeys = Object.keys(handler);
	console.log("handlerKeys", handlerKeys);
	for (const handlerKey of handlerKeys) {
		// skip the key "keys"
		if (handlerKey === "keys") {
			continue;
		}

		// if handler[handlerKey] is true then it should be in the modifiers
		if (!!handler[handlerKey] !== modifiers.includes(handlerKey)) {
			console.log("handlerKey", handlerKey);
			console.log("handler[handlerKey]", handler[handlerKey]);
			console.log(
				"modifiers.includes(handlerKey)",
				modifiers.includes(handlerKey)
			);
			console.log(
				"equals",
				!!handler[handlerKey] == modifiers.includes(handlerKey)
			);
			return false;
		}
	}
	return true;
}
