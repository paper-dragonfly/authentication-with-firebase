import './App.css';
import { firebaseSignOut, signInWithGoogle } from './Firebase';
import { getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  console.log('app rendered')
  const [health, setHealth] = useState(false)
  const [userToken, setUserToken] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userName,  setUserName] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const { handleSubmit, formState }  = useForm() 


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

  const auth = getAuth();
  function emailPasswordSignIn(){
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      console.log('signing in with user and PW')
      .then((userCredential) => {
        console.log(userCredential)
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      })
    }

  function handleChange(e){
    const {name, value} = e.target
    console.log('handleChange running', name, value)
    if(name==='email'){
      setUserEmail(value)
    }else if(name==='password'){
      setUserPassword(value)
    }
  }

  function submitForm(){
    console.log(userEmail, userPassword)
  }

  // function submitForm(){
  //   console.log('formsubmitting', userEmail, userPassword)
  // }

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
        <form onSubmit={handleSubmit(submitForm)}>
          <label>
            <b>Email</b>
              <input 
                  type='text'
                  name='email'
                  value ={userEmail}
                  onChange={handleChange}
                  className='manual login email'
              />
          </label>
          <br />
          <label>
            <b>Password</b>
              <input 
                  type='password'
                  name='password'
                  value ={userPassword}
                  onChange={handleChange}
                  className='manual login pw'
              />
          </label>
          <button type='submit'>Create User</button>
        </form>

        <button className= "login-with-google-btn"  onClick={signIn}>sign in with google</button>
        <div className = 'showUserToken'>
          <h4> User Token </h4>
          <p>
            {userToken?userToken.substring(0,25)+'...':'no user logged in'}
          </p>
        </div>
        <button onClick={getEmail}> Get Email</button>
        <h4>User Email <br  /> {userEmail?userEmail : "_______"}</h4>
        <button onClick={signOut}>Sign Out</button>
      </div>
  );
}

export default App;
