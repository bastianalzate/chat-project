import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import Login from './pages/Login';

function App() {

  return (
    <Switch>
      <Route exact path="/" component={Login} />
      {/* <Route path="/about" component={About} /> */}
      {/* <Route path="/contact" component={Contact} /> */}
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

export default App;
