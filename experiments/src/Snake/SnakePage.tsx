// disable typescript for this file
// @ts-nocheck

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { COLORS, MAP, MAP_HEIGHT, MAP_WIDTH } from "./snakeMap";
import { OrbitControls } from "@react-three/drei";
import useKeypress from "react-use-keypress";

interface Props {}

const ORIGINAL_APPLES = [...Array(5)].map((_) => {
	let newAppleX = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
	let newAppleY = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
	let newApple = [newAppleX, newAppleY];
	return newApple;
});
export const SnakePage = (props: Props) => {
	const [apples, setApples] = useState(ORIGINAL_APPLES);
	const [showCollision, setShowCollision] = useState(false);
	const [gameRunning, setGameRunning] = useState(true);
	const [score, setScore] = useState(0);

	function replaceApple(oldApple: [number, number]) {
		let newApples = apples.filter((a) => a !== oldApple);
		let newAppleX = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
		let newAppleY = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
		let newApple = [newAppleX, newAppleY];
		newApples = [...newApples, newApple];
		setApples(newApples);
	}

	return (
		<>
			{showCollision && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						backgroundColor: "rgba(255, 255, 255, 0.5)",
						zIndex: 1000,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
						fontSize: "4rem",
						fontWeight: "bold",
						fontFamily: "sans-serif",
					}}
				>
					<h1>Game Over!</h1>
					<h2
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							fontFamily: "sans-serif",
						}}
					>
						Score: {score}
					</h2>
					<button
						onClick={() => {
							// reload the page
							window.location.reload();
							// setGameRunning(true);
							// setApples(ORIGINAL_APPLES);
							// setShowCollision(false);
						}}
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							fontFamily: "sans-serif",
						}}
					>
						New Game!
					</button>
				</div>
			)}

			<Canvas
				// make the canvas fill the whole page
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
				}}
				// set the camera position
				camera={{
					position: [0, 100, 0],
					// point straight down
					rotation: [-Math.PI, 0, 0],

					// fov: 100,
					// rotation: [0, 0, 0],
					// fov: 75,
					// near: 0.1,
					// far: 1000,
				}}
			>
				{/* <SkyBox /> */}
				{/* add axes */}
				{/* <axesHelper args={[500]} /> */}
				<ambientLight intensity={Math.PI / 2} />
				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					decay={0}
					intensity={Math.PI}
				/>
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				{/* <Box position={[-1.2, 0, 0]} />
			<Box position={[1.2, 0, 0]} /> */}

				{/* CREATE THE TERRAIN */}
				{MAP.map((row, rowIndex) => {
					return row.map((cell, colIndex) => {
						if (cell === 1) {
							return (
								<Cube
									position={[rowIndex, 0, colIndex]}
									color={
										(rowIndex + colIndex) % 2 === 0
											? COLORS.LIGHT_GRAY
											: COLORS.DARK_GRAY
									}
								/>
							);
						}
					});
				})}
				{/* CREATE THE FLOOR (USE PLANES) */}
				{MAP.map((row, rowIndex) => {
					return row.map((cell, colIndex) => {
						if (cell === 0) {
							return (
								<mesh
									position={[rowIndex, -0.5, colIndex]}
									rotation={[-Math.PI / 2, 0, 0]}
								>
									<planeGeometry args={[1, 1]} />
									<meshStandardMaterial
										color={
											(rowIndex + colIndex) % 2 === 0
												? COLORS.LIGHT_GREEN
												: COLORS.DARK_GREEN
										}
									/>
								</mesh>
							);
						}
					});
				})}

				<TheSnake
					apples={apples}
					onAppleEaten={(apple) => {
						replaceApple(apple);
						setScore(score + 1);
					}}
					showCollision={() => {
						setGameRunning(false);
						setShowCollision(true);
					}}
					gameRunning={gameRunning}
				></TheSnake>

				{apples.map((apple) => {
					return (
						<Cube
							scale={[0.5, 0.5, 0.5]}
							position={[apple[0], 0, apple[1]]}
							color={COLORS.RED}
							key={apple}
						/>
					);
				})}
			</Canvas>
		</>
	);
};

function Cube(props: any) {
	const meshRef = useRef();

	return (
		<mesh {...props} ref={meshRef}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={props.color} />
		</mesh>
	);
}

function TheSnake(props: any) {
	const ORIGINAL_SNAKE = [
		[5, 5],
		[4, 5],
		[3, 5],
	];
	const [snake, setSnake] = useState(ORIGINAL_SNAKE);

	enum Direction {
		UP,
		DOWN,
		LEFT,
		RIGHT,
	}

	const [direction, setDirection] = useState(Direction.RIGHT);
	function changeDirection(newDirection: Direction) {
		setDirection(newDirection);
	}

	function movePosition(position: [number, number], direction: Direction) {
		let newPosition = [...position];
		switch (direction) {
			case Direction.UP:
				newPosition[1] -= 1;
				break;
			case Direction.DOWN:
				newPosition[1] += 1;
				break;
			case Direction.LEFT:
				newPosition[0] -= 1;
				break;
			case Direction.RIGHT:
				newPosition[0] += 1;
				break;
		}
		return newPosition;
	}

	function cameraLookAtPositionInDirection(camera) {
		let cameraPosition = camera.position;
		let newLookAtPosition = new THREE.Vector3(
			cameraPosition.x,
			cameraPosition.y,
			cameraPosition.z
		);
		switch (direction) {
			case Direction.UP:
				newLookAtPosition.z -= 1;
				break;
			case Direction.DOWN:
				newLookAtPosition.z += 1;
				break;
			case Direction.LEFT:
				newLookAtPosition.x -= 1;
				break;
			case Direction.RIGHT:
				newLookAtPosition.x += 1;
				break;
		}
		return newLookAtPosition;
	}

	function rotateDirection(direction: Direction, degrees: number) {
		let newDirection = direction;
		switch (degrees) {
			case 90:
				switch (direction) {
					case Direction.UP:
						newDirection = Direction.RIGHT;
						break;
					case Direction.DOWN:
						newDirection = Direction.LEFT;
						break;
					case Direction.LEFT:
						newDirection = Direction.UP;
						break;
					case Direction.RIGHT:
						newDirection = Direction.DOWN;
						break;
				}
				break;
			case -90:
				switch (direction) {
					case Direction.UP:
						newDirection = Direction.LEFT;
						break;
					case Direction.DOWN:
						newDirection = Direction.RIGHT;
						break;
					case Direction.LEFT:
						newDirection = Direction.DOWN;
						break;
					case Direction.RIGHT:
						newDirection = Direction.UP;
						break;
				}
				break;
		}
		return newDirection;
	}

	const camera = useThree((state) => state.camera);

	const oldPosition = useRef(new THREE.Vector3(0, 0, 0));
	const oldQuaternion = useRef(new THREE.Quaternion());
	const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
	const targetQuaternion = useRef(new THREE.Quaternion());

	const lastMoveTime = useRef(0);
	const changedDirection = useRef(false);
	const [showHead, setShowHead] = useState(true);

	useKeypress("ArrowLeft", () => {
		if (changedDirection.current) return;
		changeDirection(rotateDirection(direction, -90));
		changedDirection.current = true;
	});
	useKeypress("ArrowRight", () => {
		if (changedDirection.current) return;
		changeDirection(rotateDirection(direction, 90));
		changedDirection.current = true;
	});

	const fallingInWorldCountdown = useRef(500);
	function moveSnake(state, delta: number) {
		if (fallingInWorldCountdown.current === 500) {
			let currentHead = snake[0];
			targetPosition.current = new THREE.Vector3(
				currentHead[0],
				0,
				currentHead[1]
			);
			camera.position.set(-100, 200, 0);
			camera.lookAt(new THREE.Vector3(0, 0, 0));
			oldPosition.current = camera.position.clone();
			oldQuaternion.current = camera.quaternion.clone();

			const tempObject = new THREE.PerspectiveCamera();
			tempObject.position.copy(oldPosition.current);
			tempObject.lookAt(cameraLookAtPositionInDirection(camera));
			tempObject.updateMatrix();
			tempObject.updateMatrixWorld();
			const newQuaternion = new THREE.Quaternion();
			newQuaternion.setFromRotationMatrix(tempObject.matrixWorld);
			targetQuaternion.current = newQuaternion;
			// delete tempObject;
			tempObject.clear();
			// return;
		}
		if (fallingInWorldCountdown.current > 0) {
			// print current position and target position
			console.log(
				"current",
				camera.position.x,
				camera.position.y,
				camera.position.z
			);
			console.log(
				"target",
				targetPosition.current.x,
				targetPosition.current.y,
				targetPosition.current.z
			);
			camera.position.lerp(targetPosition.current, delta * 1.5);
			camera.quaternion.slerp(targetQuaternion.current, delta * 0.5);
			fallingInWorldCountdown.current -= 1;
			return;
		}

		setShowHead(false);

		let newSnake = [...snake];
		let newHead = [...newSnake[0]];

		if (state.clock.elapsedTime - lastMoveTime.current > 0.15) {
			lastMoveTime.current = state.clock.elapsedTime;
			changedDirection.current = false;

			// deep copy the head
			newHead = movePosition(newHead, direction);
			newSnake = [newHead, ...newSnake];

			// check for apples
			let appleEaten = false;
			props.apples.forEach((apple: [number, number]) => {
				if (apple[0] === newHead[0] && apple[1] === newHead[1]) {
					appleEaten = true;
					props.onAppleEaten(apple);
				}
			});
			if (!appleEaten) newSnake.pop();

			// check for collision
			let collision = false;
			newSnake.forEach((cell: [number, number], ind: number) => {
				if (ind === 0) return;
				if (cell[0] === newHead[0] && cell[1] === newHead[1]) {
					collision = true;
					console.log("collision with " + cell);
				}
			});
			if (MAP[newHead[1]][newHead[0]] === 1) {
				collision = true;
			}
			if (collision) {
				setTimeout(() => {
					props.showCollision();
				}, 20);
			}

			setSnake(newSnake);

			oldPosition.current = camera.position.clone();
			oldQuaternion.current = camera.quaternion.clone();
			// set the target position
			targetPosition.current = new THREE.Vector3(newHead[0], 0, newHead[1]);
			// save the current quaternion to get the new quaternion

			const tempObject = new THREE.PerspectiveCamera();
			tempObject.position.copy(oldPosition.current);
			tempObject.lookAt(cameraLookAtPositionInDirection(camera));
			tempObject.updateMatrix();
			tempObject.updateMatrixWorld();
			const newQuaternion = new THREE.Quaternion();
			newQuaternion.setFromRotationMatrix(tempObject.matrixWorld);
			targetQuaternion.current = newQuaternion;
			// delete tempObject;
			tempObject.clear();
		}

		// camera.position.set(newHead[0], 0, newHead[1]);
		// // print the rotation
		// camera.lookAt(cameraLookAtPositionInDirection(camera));
		// // camera.lookAt(new THREE.Vector3(newHead[0], 0, newHead[1]));

		// smooth camera movement

		camera.position.lerp(targetPosition.current, delta * 10);
		camera.quaternion.slerp(targetQuaternion.current, delta * 10);
	}

	useFrame((state, delta) => {
		// console.log("state", state);
		if (!props.gameRunning) return;
		moveSnake(state, delta);
	});

	useEffect(() => {
		if (props.gameRunning) {
			setSnake(ORIGINAL_SNAKE);
		}
	}, [props.gameRunning]);

	return (
		<>
			{snake.map((cell, ind) => {
				// don't render the head
				if (ind === 0 && !showHead) return;

				return (
					<Cube
						position={[cell[0], 0, cell[1]]}
						color={ind % 2 == 0 ? COLORS.SNAKE_1 : COLORS.SNAKE_2}
					/>
				);
			})}
		</>
	);
}

// Loads the skybox texture and applies it to the scene.
function SkyBox() {
	// highlight-start
	const { scene } = useThree();
	const loader = new THREE.CubeTextureLoader();
	// The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
	const texture = loader.load([
		"https://6izyu.csb.app/4b.jpg",
		"https://6izyu.csb.app/3.jpg",
		"https://6izyu.csb.app/4b.jpg",
		"https://6izyu.csb.app/4.jpg",
		"https://6izyu.csb.app/5.jpg",
		"https://6izyu.csb.app/2.jpg",
	]);

	// Set the scene background property to the resulting texture.
	scene.background = texture;
	// highlight-end
	return null;
}
