// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAAw2B9R8kwkapA6pHfXWjpRlkxBnsvOI",
  authDomain: "project1-be0e8.firebaseapp.com",
  databaseURL: "https://project1-be0e8-default-rtdb.firebaseio.com",
  projectId: "project1-be0e8",
  storageBucket: "project1-be0e8.firebasestorage.app",
  messagingSenderId: "789109114653",
  appId: "1:789109114653:web:37a12b4e9fe4f1560c83f4",
  measurementId: "G-S2CT6FERLM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();