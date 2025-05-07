import { Physics } from "@react-three/cannon";
// import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Cylinder = () => {
	// // Define the Cylinder's physics body inside the Canvas context
	// const [ref] = useCylinder(() => ({
	// 	mass: 1,
	// 	position: [0, 5, 0],
	// 	args: [1, 1, 2, 32], // Cylinder args: radiusTop, radiusBottom, height, radialSegments
	// }));

	return (
		<mesh ref={null}>
			<cylinderGeometry args={[1, 1, 2, 32]} />
			<meshStandardMaterial color="orange" />
		</mesh>
	);
};

// const Plane = () => {
// 	// A static plane to catch the cylinder
// 	const [ref] = useCylinder(() => ({
// 		type: "Static",
// 		position: [0, 0, 0],
// 		args: [100, 100, 0.1, 32], // A thin plane
// 	}));

// 	return (
// 		<mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
// 			<planeGeometry args={[100, 100]} />
// 			<meshStandardMaterial color="lightblue" />
// 		</mesh>
// 	);
// };

const CoinsPage = () => {
	return (
		<div className="h-screen">
			<Canvas className="bg-gray-900 h-full">
				{/* Add lighting */}
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.3} />

				{/* Add physics world */}
				<Physics>
					{/* Falling cylinder */}
					<Cylinder />

					{/* Plane for the cylinder to fall on */}
					{/* <Plane /> */}
				</Physics>

				{/* Orbit controls for camera interaction */}
				{/* <OrbitControls /> */}
			</Canvas>
		</div>
	);
};

export default CoinsPage;
