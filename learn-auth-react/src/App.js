import './App.css';
import { signInWithGoogle } from './Firebase';
import {useState} from 'react';

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [health, setHealth] = useState(false)
  const [userToken, setUserToken] = useState("")
  const [userEmail, setUserEmail] = useState("")

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
        <h1> Hello {localStorage.name? localStorage.name: 'World'}</h1>
        <button className = {health?'btn-success':'btn-danger'} onClick = {checkHealth}>Check API Connection</button>
        <br />
        <button className= "login-with-google-btn"  onClick={signIn}>sign in with google</button>
        <p className = 'showUserToken'>
          User  Token
          <br />
          {userToken.substring(0,25)}
        </p>
        <button onClick={getEmail}> Get Email</button>
        <h4>User Email <br  /> {userEmail}</h4>
      </div>
  );
}

export default App;
