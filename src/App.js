import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css';

import Button from './components/button'
import Channel from './components/channel';



firebase.initializeApp({
  apiKey: "AIzaSyDFA7tRmzExlrX_EfxQ7Izc9FwogMxQBB0",
  authDomain: "firechat-f067d.firebaseapp.com",
  projectId: "firechat-f067d",
  storageBucket: "firechat-f067d.appspot.com",
  messagingSenderId: "337890778603",
  appId: "1:337890778603:web:699a3450e6c8f7d452cdae"
})

const auth = firebase.auth();
const db = firebase.firestore();


function App() {
  const [user, setUser] = useState(() => auth.currentUser)
  const [initializing, setInitialzing] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user)
      }
      else {
        setUser(null)
      }
      
      if (initializing) {
        setInitialzing(false)
      }
    })
    return unsubscribe;
  }, [])
  const signInWithGoogle = async() => {
    
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();
  
  

    try {
      await auth.signInWithPopup(provider);
    } catch(error)  {
      console.error(error)
    }
  }

  const signOut = async() => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (initializing) return 'Loading...';
  return (
    
    <div>
      {user ? (
        <>
        <Button onClick = {signOut}>Sign Out</Button><br></br>
        <Channel user = {user} db = {db}/>
        </>
      ) : (<Button onClick = {signInWithGoogle}>Sign in with google</Button>)}
    </div>

  );
}

export default App;
