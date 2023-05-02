import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import { UserProvider } from './context/UserContext';
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <UserProvider>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={Dashboard} />
        {/* <Route path="/" component={UserList} /> */}
        {/* <Route path="/contact" component={Contact} /> */}
        {/* <Route component={NotFound} /> */}
      </Switch>
    </UserProvider>
  );
}

export default App;
