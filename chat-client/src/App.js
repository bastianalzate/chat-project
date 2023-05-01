import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import Login from './pages/Login';
import SignUp from './pages/Signup';

function App() {

  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/signup" component={SignUp} />
      {/* <Route path="/contact" component={Contact} /> */}
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

export default App;
