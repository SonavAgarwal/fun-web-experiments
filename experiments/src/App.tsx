import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AlienCat from "./AlienCat/AlienCat.tsx";
import { SnakePage } from "./Snake/SnakePage.tsx";
import FlexPage from "./Flex/FlexPage.tsx";

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
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
