import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AlienCat from "./AlienCat/AlienCat.tsx";
import { SnakePage } from "./Snake/SnakePage.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <div>home</div>,
	},
	{
		path: "/aliencat",
		element: <AlienCat></AlienCat>,
	},
	{
		path: "/snake",
		element: <SnakePage></SnakePage>,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
