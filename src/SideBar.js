import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./App.css";

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { props } = this.props;
    console.log("hre", props.history)
    return (
      <div>
        <div className="sidebar">
          <div className="header">ProPanel</div>
          <div className="options">
            <ul>
              <Link className={`link ${window.location.pathname === "/home" ? "active" : null}`} to="./home">Home</Link>
              <Link className={`link ${window.location.pathname === "/super" ? "active" : null}`} to="./super"><li>Manage</li></Link>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBar;
