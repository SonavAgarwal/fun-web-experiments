import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AlienCat from "./AlienCat/AlienCat.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <div>home</div>,
	},
	{
		path: "/aliencat",
		element: <AlienCat></AlienCat>,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
