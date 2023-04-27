import "./AlienCat.css";

import AlienCatBackground from "./assets/AlienCat.png";
import AlienCatOverlay from "./assets/AlienCatSpotlightFixed.png";

document.oncontextmenu = function () {
	return false;
};

const AlienCat = () => {
	return (
		<div id="alienCatPage">
			<div id="alienCatContainer">
				<img id="alienCatSizer" src={AlienCatBackground} />
				<img id="alienCatBackground" src={AlienCatBackground} />
				<img className="alienCatOverlay" src={AlienCatOverlay} />
				<img className="alienCatOverlayExtra" src={AlienCatOverlay} />
				{/* <img className="alienCatOverlay" src={AlienCatOverlay} /> */}

				<p>Hover and press.</p>
			</div>
		</div>
	);
};

export default AlienCat;
