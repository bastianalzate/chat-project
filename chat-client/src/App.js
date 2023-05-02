import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { UserProvider } from './context/UserContext';

function App() {

  return (
    <UserProvider>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={Chat} />
        {/* <Route path="/contact" component={Contact} /> */}
        {/* <Route component={NotFound} /> */}
      </Switch>
    </UserProvider>
  );
}

export default App;
