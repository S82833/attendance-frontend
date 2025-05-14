import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBp67hp-QQsGwRq76EMAgxgoxR2gOTBX7Q",
  authDomain: "talent-edge-attendance.firebaseapp.com",
  projectId: "talent-edge-attendance",
  storageBucket: "talent-edge-attendance.firebasestorage.app",
  messagingSenderId: "210989242809",
  appId: "1:210989242809:web:d114e8d6d0baa68e807e68"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };