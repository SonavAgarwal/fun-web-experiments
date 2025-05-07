import { useEffect } from "react";

import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams } from "react-router-dom";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyC5Uns91IexWLwxyyWh1eCk6TCplAfersg",
	authDomain: "sonaviscool.firebaseapp.com",
	databaseURL: "https://sonaviscool-default-rtdb.firebaseio.com",
	projectId: "sonaviscool",
	storageBucket: "sonaviscool.appspot.com",
	messagingSenderId: "199606803575",
	appId: "1:199606803575:web:19b013b95c77b1a045fa72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LinkShortener = () => {
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		async function getLink() {
			// look in database collection "links" for id
			// if found, redirect to link

			const linksCollection = collection(db, "links");
			const docref = doc(linksCollection, id);

			const docSnap = await getDoc(docref);
			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data());

				// redirect to link
				window.location.href = docSnap.data().link;
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}
		getLink();
	}, [id]);

	return <div>:\</div>;
};

export default LinkShortener;
