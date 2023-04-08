import './App.css';
import { signInWithGoogle } from './Firebase';
import {useState} from 'react';

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [userToken, setUserToken] = useState("")
  const [userEmail, setUserEmail] = useState("")

  function checkHealth(){
    const url = API_URL+'/health/'
    fetch(url)
      .then((response) => response.json) 
      .then(data => console.log(data))
  }

  function signIn(){
    signInWithGoogle()
    const url = API_URL+'/login/'
    const idToken = localStorage.googleIdToken
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

    setUserToken() 
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
        setUserEmail(data["body"]["user_email"])
      })

  }

  return (
      <div className="App"> 
        <h1> Hello World</h1>
        <button onClick = {checkHealth}>Check Health</button>
        <br />
        <button className= "login-with-google-btn"  onClick={signIn}>sign in with google</button>
        <h2>{localStorage.getItem("name")}</h2>
        <p className = 'showUserToken'>
          User  Token {userToken}
        </p>
        <button onClick={getEmail}> Get Email</button>
        <h4>User Email {userEmail}</h4>
      </div>
  );
}

export default App;
