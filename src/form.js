import React, { Component } from "react";
import "./App.css";
import raw from "./apiService";
import moment from "moment";
import SideBar from "./SideBar";
import Header from "./Header";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PanelView from "./PanelView";
import Modal from "react-modal";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px"
  }
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdminUser: !this.props.location.pathname.includes("@"),
      modalIsOpen: false,
      panelList: [],
      surveyId: this.props.location.pathname.split("/"),
      daysOfInterviewRes: [],
      comments: "",
      surveyName: "",
      outstation: false,
      daysOfInterview: Array(6)
        .fill(0)
        .map((item, i) => {
          return {
            label: moment()
              .add(i * 6, "days")
              .format("YYYY-MM-DD"),
            value: false
          };
        })
    };
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = "#f00";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false, surveyName: "" });
  };
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  getPanel = () => {
    raw.get("http://172.19.101.133:3000/get_panel_members").then(r => {
      this.setState({ panelList: r });
    });
  };

  getSurveyDetails = () => {
    const { surveyId } = this.state;
    raw
      .post("http://172.19.101.133:3000/surveys", {
        id: parseInt(surveyId[3])
      })
      .then(r => {
        //   alert(r);
        this.setState({
          daysOfInterviewRes: r[0].dates_array.map(re => ({
            label: re,
            value: false
          }))
        });
      });
  };

  submitResponse = () => {
    const { surveyId, daysOfInterviewRes, comments,outstation } = this.state;
    console.log(daysOfInterviewRes)
    raw
      .post("http://172.19.101.133:3000/respond", {
        survey_id: parseInt(surveyId[3]),
        email: surveyId[2],
        dates_array: daysOfInterviewRes.filter(i => i.value).map(i => i.label),
        comments,
        outstation
      })
      .then(r => {
        alert(r);
      });
  };

  componentDidMount() {
    const { isAdminUser } = this.state;
    if (!isAdminUser) {
      this.getSurveyDetails();
    }
    this.getPanel();
  }
  onToggle = e => {
    console.log("karan", e.target)
    const daysOfInterviewRes = [...this.state.daysOfInterviewRes];
    daysOfInterviewRes[e.target.id] = {
      ...daysOfInterviewRes[e.target.id],
      value: e.target.checked
    };
    this.setState({
      daysOfInterviewRes
    });
  };
  onToggleOutstation = e => {
    console.log("errr", e.target.checked);
    this.setState({ outstation: e.target.checked });
  };
  onDateChange = e => {
    const daysOfInterview = [...this.state.daysOfInterview];
    daysOfInterview[e.target.id] = {
      ...daysOfInterview[e.target.id],
      label: e.target.value
    };
    this.setState({
      daysOfInterview
    });
  };

  createSurvey = () => {
    raw
      .post("http://172.19.101.133:3000/create_survey", {
        name: this.state.surveyName,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        dates_array: this.state.daysOfInterview.map(i => i.label)
      })
      .then(r => {
        alert(r.message);
        this.closeModal();
      });
  };
  submitSurvey = () => {
  
  };
  setComments = e => {
    this.setState({ comments: e.target.value });
  };
  addSurveyName = e => {
    this.setState({ surveyName: e.target.value });
  }
  render() {
    const { daysOfInterview, isAdminUser, daysOfInterviewRes } = this.state;

    const panel_desc = "Please mark your availability on following dates";
    const admin_desc = "Customize the dates for interview";
    return (
      <div className="main_container">
        {isAdminUser && <SideBar props={this.props} />}
        <div className="body-content">
          <Header />
          <div className="pt2">
            <Tabs defaultFocus={true} defaultIndex={1}>
              <TabList>
                <Tab>Form</Tab>
                {isAdminUser && <Tab>Panel</Tab>}
              </TabList>

              <TabPanel className="manage-form pt2">
                <div className="container_1">
                  <div className="pb2">
                    {isAdminUser ? `${admin_desc}` : `${panel_desc}`}
                  </div>
                  {isAdminUser
                    ? daysOfInterview.map((i, key) => (
                        <div className="check_box">
                          <input
                            type="date"
                            className="input_date"
                            value={i.label}
                            id={key}
                            onChange={this.onDateChange}
                          />
                        </div>
                      ))
                    : daysOfInterviewRes.map((i, key) => (
                        <div className="check_box">
                          <input
                            className="checkbox"
                            type="checkbox"
                            id={key}
                            name="lastname"
                            placeholder="Your last name.."
                            onClick={this.onToggle}
                          />
                          <label>{i.label}</label>
                        </div>
                      ))}
                  {!isAdminUser && (
                    <div>
                      <div className="pt2">
                        <input
                          className="checkbox"
                          type="checkbox"
                          name="lastname"
                          placeholder="Your last name.."
                          onClick={this.onToggleOutstation}
                        />
                        <label>Outsation ready</label>
                      </div>
                      <div className="pt2">Comments</div>
                      <div className="pt2">
                        <textarea
                          onChange={this.setComments}
                          rows="5"
                          cols="40"
                        ></textarea>
                      </div>
                    </div>
                  )}
                  <div className="pt1">
                    <button
                      className="button-primary"
                      onClick={() =>
                        isAdminUser
                          ? this.openModal()
                          : this.submitResponse()
                      }
                    >
                    { isAdminUser
                          ?`Create Survey`
                          : 'Submit'}
                    </button>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <PanelView></PanelView>
              </TabPanel>
            </Tabs>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="modal">
            <div className="tab_modal">
              <div>
                <div ref={subtitle => (this.subtitle = subtitle)}>
                  Update panel list
                </div>
              </div>
              <div>
                <button onClick={this.closeModal}>X</button>
              </div>
            </div>
            <div className="pt2">
              Enter Survey Name -:
              <div className="panel-list-modal pt2">
                   <input type="text" onChange={this.addSurveyName} value={this.state.surveyName}/>
              </div>
            </div>
            <div className="pt2">
              Emails will go to following list of recepients.
              <div className="panel-list-modal pt2">
                    {this.state.panelList.map((item, key) => <div>{`${key+1}. ${item.name} -- ${item.email}`}</div>)}
              </div>
            </div>
            <div className="warning">
              ** Panel members can not be changed after survey has been created. It is advisable to check panel members thoroughly before creating the survey.
            </div>
            <div className="pt2 modal_button">
              <button className="button-submit" onClick={this.createSurvey} disabled={!this.state.surveyName}>
                Submit
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form;
