import './App.css';
import { firebaseSignOut, signInWithGoogle } from './Firebase';
import {useEffect, useState} from 'react';

const API_URL = 'http://127.0.0.1:8000'

function App() {
  console.log('app rendered')
  const [health, setHealth] = useState(false)
  // const [googleIdToken, setGoogleIdToken]  = useState(null)
  // const [loggedIn, setLoggedIn] = useState(false)
  const [userToken, setUserToken] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userName,  setUserName] = useState("")

  function checkHealth(){
    const url = API_URL+'/health/'
    fetch(url)
      .then(response => response.json()) 
      .then(data => {
        if(data['status_code']===200){
          setHealth(true)
        }else{
          setHealth(false)
        }
        console.log('Health', data)
      })
      .catch(error => {
        console.error(error)
        setHealth(false)})
  }

  function signIn(){
    signInWithGoogle()
      .then((result) => {
        console.log(result)
        setUserName(result.user.displayName)
        const idToken = result._tokenResponse.idToken
        return idToken
      })
      .then((idToken) => {
        const url = API_URL+'/login/'
        fetch(
          url, 
          {headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setUserToken(data["body"]["user_token"])
          })
          .catch(error => console.error(error)) 
        
      })
  }

  function getEmail(){
    const url = API_URL+'/email/'
    fetch(
      url,
      {headers: 
        {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // localStorage.setItem("userEmail", data["body"]["user_email"])
        setUserEmail(data["body"]["user_email"])
      })

  }

  function signOut(){
    firebaseSignOut()
      .then(() => {
        console.log('signed out')
        setUserToken("")
        setUserName("")
        setUserEmail("")
      })
  }

  return (
      <div className="App"> 
        <h1> Hello {userName? userName: 'World'}</h1>
        <button className = {health?'btn-success':'btn-danger'} onClick = {checkHealth}>Check API Connection</button>
        <br />
        <button className= "login-with-google-btn"  onClick={signIn}>sign in with google</button>
        <p className = 'showUserToken'>
          User  Token
          <br />
          {userToken.substring(0,25)}
        </p>
        <button onClick={getEmail}> Get Email</button>
        {/* <h4>User Email <br  /> {localStorage.userEmail?localStorage.userEmail : "_______"}</h4> */}
        <h4>User Email <br  /> {userEmail?userEmail : "_______"}</h4>
        <button onClick={signOut}>Sign Out</button>
      </div>
  );
}

export default App;
