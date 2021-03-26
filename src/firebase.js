import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/firestore'

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC62whNP9MX27ORO2whL0vceL0xhxrndT0",
    authDomain: "fa-insta.firebaseapp.com",
    databaseURL: "https://fa-insta-default-rtdb.firebaseio.com",
    projectId: "fa-insta",
    storageBucket: "fa-insta.appspot.com",
    messagingSenderId: "830236781029",
    appId: "1:830236781029:web:1ff39ac6010d218b29670c"
  });


  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();


  export  { db, auth, storage };