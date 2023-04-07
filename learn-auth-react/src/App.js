import './App.css';
import { signInWithGoogle } from './Firebase';
import {useState} from 'react';


function App() {
  const [todos, setTodos] = useState("")

  function checkHealth(){
    const url = 'http://127.0.0.1:8001/health/'
    fetch(url)
      .then((response) => response.json) 
      .then(data => console.log(data))
  }



  function getTodos(){
    const url = 'http://127.0.0.1:8001/todo/'
    //  Storingin local storage is probably bad
    const idToken = localStorage.getItem['googleIdToken']
    fetch(
      url, 
      {headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error)) 

    setTodos('hit getTodos') 
  }

  return (
      <div className="App"> 
        <h1> Hello World</h1>
        <button onClick = {checkHealth}>Check Health</button>
        <br />
        <button className= "login-with-google-btn"  onClick={signInWithGoogle}>sign in with google</button>
        <h2>{localStorage.getItem("name")}</h2>
        <button onClick = {getTodos}>Get Todos</button>
        <p className = 'todos'>
          Todos {todos}
        </p>
      </div>
  );
}

export default App;
