// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8j34FpKZ5jJrkWr74qUt5LXCTWXXiZRw",
  authDomain: "mern-blog-425bd.firebaseapp.com",
  projectId: "mern-blog-425bd",
  storageBucket: "mern-blog-425bd.firebasestorage.app",
  messagingSenderId: "478517153975",
  appId: "1:478517153975:web:6fef13ff76efcd2f5f3d32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app