import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { 
getAuth 
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
getFirestore
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const firebaseConfig = {

apiKey: "AIzaSyCOeYVmV6nmznU9QsuyB2qDrRPOaL7isAQ",

authDomain: "nowy-dziennik.firebaseapp.com",

projectId: "nowy-dziennik",

storageBucket: "nowy-dziennik.firebasestorage.app",

messagingSenderId: "371861155291",

appId: "1:371861155291:web:6ebaeed76c0116b49c4bfe",

measurementId: "G-3GXMKP00MB"

};



const app =
initializeApp(firebaseConfig);



export const auth =
getAuth(app);


export const db =
getFirestore(app);