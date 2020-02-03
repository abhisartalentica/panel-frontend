import React from "react";
import "./App.css";
import Form from "./form";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./signIn";
import Home from "./home";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/super" component={Form} exact/>
          <Route path="/form/:email" component={Form} />
          <Route path="/" component={SignIn} exact />
          <Route path="/home" component={Home} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
