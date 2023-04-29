import logo from './logo.svg';
import './App.css';
import db from './utils/firebase';
import { collection, getDocs } from "firebase/firestore";

const getCollection = async () => {
  const querySnapshot = await getDocs(collection(db, "messages"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().text}`);
  });
}

getCollection();

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
