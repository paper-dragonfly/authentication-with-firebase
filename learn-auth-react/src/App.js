import './App.css';
import { signInWithGoogle } from './Firebase';

function App() {
  return (
      <div className="App"> 
        <h1> Hello World</h1>
        <button className= "login-with-google-btn"  onClick={signInWithGoogle}>sign in with google</button>
        <h2>{localStorage.getItem("name")}</h2>
      </div>
  );
}

export default App;
