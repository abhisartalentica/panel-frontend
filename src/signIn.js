import React, { Component } from "react";
import "./App.css";
import raw from "./apiService";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  setEmail = email => this.setState({ email });
  setPassword = password => this.setState({ password });

  signIn = () => {
    const { email, password } = this.state;
    raw
      .post("http://172.19.101.133:3000/validate", {
        email: email,
        password: password
      })
      .then(r => {
        if (r.status){ this.props.history.push("/home") }else alert("Invalid Credentials !!!");
      });
  };

  render() {
    return (
      <div className="container_login">
        <div className="login"> LOGIN</div>
        <div className="pt2">
          <input
            id="email"
            placeholder="username"
            label="Email Address"
            name="email"
            type="text"
            className="input_login"
            onChange={e => this.setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            id="password"
            placeholder="password"
            label="password"
            name="password"
            type="password"
            className="input_login"
            onChange={e => this.setPassword(e.target.value)}
          />
        </div>
        <div className="pt2">
          <button className="button-secondary" onClick={this.signIn}>
            LOGIN
          </button>
        </div>
      </div>
    );
  }
}

export default Form;
