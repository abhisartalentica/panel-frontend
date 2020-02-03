import React, { Component } from "react";
import { panel, data } from "./const";
import Modal from "react-modal";
import "./App.css";
import Multiselect from "multiselect-dropdown-react";
import raw from "./apiService";

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
//Modal.setAppElement("#yourAppElement");

class PanelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      panelList: [],
      skills: [],
      addSkills: [],
      addEmail: "",
      removeEmail: ""
    };
  }
  setEmail = e => this.setState({ addEmail: e.target.value });

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  result = params => {
    const { skills } = this.state;
    console.log(params);
    const arr = skills
      .filter(skill => params.includes(skill.name))
      .map(i => i.id);
    this.setState({ addSkills: arr });
  };

  removePanel = key => {
    panel.splice(key, 1);
    this.setState({ panelList: panel });
  };

  addPanel = () => {
    const { addEmail, addSkills } = this.state;
    raw
      .post("http://172.19.101.133:3000/add_modify_panel", {
        email: addEmail,
        skill_set_ids: addSkills
      })
      .then(r => {
        this.getPanel();
        this.closeModal();
      });
  };

  removePanel = (email) => {

    raw
      .post("http://172.19.101.133:3000/remove_panel", {
        email
      })
      .then(r => {
        this.getPanel();
      });
  };

  getPanel = () => {
    raw.get("http://172.19.101.133:3000/get_panel_members").then(r => {
      this.setState({ panelList: r });
    });
  };

  getSkills = () => {
    raw.get("http://172.19.101.133:3000/skills").then(r => {
      console.log("here", r);
      this.setState({
        skills: r.reduce((acc, i) => acc.concat({ ...i, value: i.name }), [])
      });
    });
  };
  openModal = () => {
    this.setState({ modalIsOpen: true });
    this.getSkills();
  };

  componentDidMount() {
    this.getPanel();
  }

  render() {
    const { panelList, skills } = this.state;
    console.log("rrrr", skills, data);
    return (
      <div className="tab_2 pt2">
        <div className="pt2 add_button">
          <button className="button-submit" onClick={this.openModal}>
            Add
          </button>
        </div>
        <div className="tab_modal" style={{maxHeight: "70vh", overflowY: "scroll"}}>
          <table>
            <tr>
              <th>Panel Name</th>
              <th colspan="2">Skills</th>
            </tr>
            <tbody>
              {panelList.map((i, key) => {
                return (
                  <tr key={key}>
                    <td>{i.name}</td>
                    <td>{i.skill_name.toString()}</td>
                    <td>
                      {" "}
                      <button
                        className="button-submit"
                        onClick={() => this.removePanel(i.email)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
              You can add new panel or update skills of existing panel.
            </div>
            <div className="pt2">Email</div>
            <div className="pt2">
              <input
                className="input_modal"
                type="text"
                onChange={this.setEmail}
              />
            </div>
            <div className="pt2">Skill</div>
            <div>
              {skills.length && (
                <Multiselect options={skills} onSelectOptions={this.result} />
              )}
            </div>
            <div className="pt2 modal_button">
              <button className="button-submit" onClick={this.addPanel}>
                Submit
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default PanelView;
