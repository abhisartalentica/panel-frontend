import React, { Component } from "react";
import "./App.css";
import raw from "./apiService";
import SideBar from "./SideBar";
import Header from "./Header";
import Expand from "./expand";
import Responses from "./Responses";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveysRes: [],
      surveys: []
    };
  }

  getAllSurveys = () => {
    raw
      .get("http://172.19.101.133:3000/get_all_surveys")
      .then(r => this.setState({ surveys: r }));
  };
  // getAllResponses = () => {
  //   raw
  //     .get("http://172.19.101.133:3000/get_all_responses")
  //     .then(r => this.setState({ surveysRes: r }));
  // };
  getAllUsers = () => {
    raw
      .get("http://172.19.101.133:3000/users")
      .then(r => this.setState({ users: r }));
  };

  componentDidMount() {
    this.getAllSurveys();
   // this.getAllResponses();
    this.getAllUsers();
  }

  render() {
    const s = [
      {
        name: "survey 1",
        created_on: "22/06/2019",
        recepients:
          "karan@gmail.com,ram@gmail.com,laxman@gmail.com,karan@gmail.com,ram@gmail.com,laxman@gmail.com,karan@gmail.com,ram@gmail.com,laxman@gmail.com",
        responders: "karan@gmail.com"
      },
      {
        name: "survey 2",
        created_on: "22/06/2019",
        recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
        responders: "karan@gmail.com,laxman@gmail.com"
      },
      {
        name: "survey 3",
        created_on: "22/06/2019",
        recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
        responders: "karan@gmail.com"
      },
      {
        name: "survey 4",
        created_on: "22/06/2019",
        recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
        responders: "karan@gmail.com,laxman@gmail.com"
      },
      {
        name: "survey 5",
        created_on: "22/06/2019",
        recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
        responders: "karan@gmail.com"
      },
      {
        name: "survey 6",
        created_on: "22/06/2019",
        recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
        responders: "karan@gmail.com"
      }
    ];
    const { surveys } = this.state;
    return (
      <div>
        <div class="main_container">
          <SideBar props={this.props}></SideBar>
          <div className="body-content">
            <Header />

            <div>
              {/* <table>
                <tr>
                  <th>Name</th>
                  <th>Created on</th>
                  <th>Recepients</th>
                  <th>Responders</th>
                  <th>Resend invitation</th>
                </tr>
                <tbody>
                  {surveys.map((i, key) => {
                    return (
                      <tr key={key}>
                        <td>{i.name}</td>
                        <td>{i.created_on}</td>
                        <td>{i.recepients.split(",").length}</td>
                        <td>{i.responders.split(",").length-1}</td>

                        <td>
                          <button
                            className="button-submit"
                            onClick={() => this.resendInvitation(i.id)}
                            disabled ={i.recepients.split(",").length-i.responders.split(",").length+1===0}
                          >
                            Resend
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table> */}
              <Tabs className="pt2" defaultFocus={true} defaultIndex={1}>
                <TabList>
                  <Tab>Surveys</Tab>
                  <Tab>Responses</Tab>
                </TabList>

                <TabPanel className="tab_1 pt2">
                  <Expand surveys={surveys} />
                </TabPanel>
                <TabPanel>
                  <Responses />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
