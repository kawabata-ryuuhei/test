import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHgQQsbFcqSkU7fx5DD4TwEKLWVuqt9Fw",
  authDomain: "my-first-react-app-b2547.firebaseapp.com",
  databaseURL: "https://my-first-react-app-b2547.firebaseio.com",
  projectId: "my-first-react-app-b2547",
  storageBucket: "my-first-react-app-b2547.appspot.com",
  messagingSenderId: "514625748715",
  appId: "1:514625748715:web:a2243c24b5e1eea6edc8ae",
  measurementId: "G-JY0LVMMJBN"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
