import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyAb9B36Trd9lA0Tr7KhRDgH2J-od4P-mo4",
//     authDomain: "test-27594.firebaseapp.com",
//     projectId: "test-27594",
//     storageBucket: "test-27594.appspot.com",
//     messagingSenderId: "1070321506596",
//     appId: "1:1070321506596:web:b9e6feb03324c859927bb1",
//     measurementId: "G-87RGRCSDF8"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAEVlrE3WEjzrNAUpX3UUo7dcQ4i_NXUo8",
    authDomain: "akwalk-fb2ae.firebaseapp.com",
    projectId: "akwalk-fb2ae",
    storageBucket: "akwalk-fb2ae.appspot.com",
    messagingSenderId: "683987389102",
    appId: "1:683987389102:web:4b86903c3800fcb6abbb3f",
    measurementId: "G-QFCZE45R0K"
};

const Config = initializeApp(firebaseConfig);
export const db = getFirestore(Config);
