import { Suspense, lazy } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LinkShortener from "./Links/LinkShortener.tsx";
// import CoinsPage from "./ThickCoins/CoinsPage.tsx";
// import AlienCat from "./AlienCat/AlienCat.tsx";
// import { SnakePage } from "./Snake/SnakePage.tsx";
// import FlexPage from "./Flex/FlexPage.tsx";

const AlienCat = lazy(() => import("./AlienCat/AlienCat.tsx"));
const SnakePage = lazy(() => import("./Snake/SnakePage.tsx"));
const FlexPage = lazy(() => import("./Flex/FlexPage.tsx"));
const CoinsPage = lazy(() => import("./ThickCoins/CoinsPage.tsx"));

const Redirect = () => {
	// go to sonavagarwal.com
	window.location.href = "https://sonavagarwal.com";

	return null;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Redirect></Redirect>,
	},
	{
		path: "/aliencat",
		element: <AlienCat></AlienCat>,
	},
	{
		path: "/snake",
		element: <SnakePage></SnakePage>,
	},
	{
		path: "/flex",
		element: <FlexPage></FlexPage>,
	},
	{
		path: "/coins",
		element: <CoinsPage></CoinsPage>,
	},
	{
		path: "/l/:id",
		element: <LinkShortener></LinkShortener>,
	},
]);

function App() {
	return (
		<Suspense fallback={<div></div>}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default App;
