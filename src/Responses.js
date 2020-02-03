import React, { Component } from "react";
import raw from "./apiService";
import moment from "moment";
import { res, skills } from "./data";
//import Multiselect from "multiselect-dropdown-react";
import { Multiselect } from "multiselect-react-dropdown";
import Attendence from "./Attendence";
import axios from "axios";
class Responses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      surveysRes: [],
      originalSurveysRes: [],
      surveysResFilter: [],
      isDraweropen: false,
      selectedValue: [],
      attendenceMarked: false,
      allowAttendenceMarking: false,
      markedAttendences: {}
    };
  }
  getAllResponses = () => {
    raw.get("http://172.19.101.133:3000/get_all_responses").then(r => {
      this.setState(
        {
          surveysRes: JSON.parse(JSON.stringify(r)),
          surveysResFilter: JSON.parse(JSON.stringify(r)),
          originalSurveysRes: JSON.parse(JSON.stringify(r)),
        },
        () => console.log("abhisar", this.state, this.state.originalSurveysRes)
      );
    });
  };

  submitAttendence = () => {
    console.log(this.state)
    raw
      .post("http://172.19.101.133:3000/submit_attendence", {
        much: Object.keys(this.state.markedAttendences)
          .map((key) => ({
            user_id: key.split("--")[1],
            batch_id: key.split("--")[0],
            attendence: this.state.markedAttendences[key],
          })),
      })
      .then(r => {this.getAllResponses(); this.setState({attendenceMarked: false,allowAttendenceMarking: false,
        markedAttendences: {}})});
  };

  onSelect = (options, params) => {
    const { surveysResFilter } = this.state;
    let selectedValue = this.state.selectedValue.concat([params]);
    let result = surveysResFilter.filter(r => {
      return selectedValue.some(s => {
        return r.skills.includes(s.value);
      });
    });
    this.setState({ selectedValue, surveysRes: result });
  };

  onRemove = (optionList, removedItem) => {
    const { surveysResFilter } = this.state;
    let selectedValue = this.state.selectedValue.filter(
      s => s.value !== removedItem.value
    );
    let surveysRes =
      selectedValue.length > 0
        ? surveysResFilter.filter(r => {
            return selectedValue.some(s => r.skills.includes(s.value));
          })
        : surveysResFilter;

    this.setState({
      selectedValue,
      surveysRes,
    });
  };

  closeDrawer = () => this.setState({ isDraweropen: !this.state.isDraweropen });
  componentDidMount() {
    this.getAllResponses();
  }

  onToggleOutstation = e => {
    const { surveysResFilter } = this.state;
    let surveysRes = e.target.checked
      ? surveysResFilter.filter(s => s.outstation === "yes")
      : surveysResFilter;
    this.setState({ surveysRes });
  };

  markAttendence = (e, k, idx, field, batch_id) => {
    console.log("abhisar",this.state,e.target.checked,k,idx,field,batch_id);
    const { surveysRes, markedAttendences } = this.state;
    if(!markedAttendences[batch_id+"--"+surveysRes[idx].user_id]){
      markedAttendences[batch_id+"--"+surveysRes[idx].user_id] = {};
    }
    markedAttendences[batch_id+"--"+surveysRes[idx].user_id][k] = field === "Present";
    surveysRes[idx].attendence = {
      ...(surveysRes[idx].attendence || {}),
      [k]: field === "Present" ? true : false,
    };
    this.setState({markedAttendences, attendenceMarked: true, surveysRes})

  }

  reset = () =>
    this.setState(
      {
        surveysRes: JSON.parse(JSON.stringify(this.state.originalSurveysRes)),
        surveysResFilter: JSON.parse(
          JSON.stringify(this.state.originalSurveysRes)
        ),

        attendenceMarked: false,
        allowAttendenceMarking: false,
        markedAttendences: {}
      },
      () => console.log(this.state, this.state.originalSurveysRes)
    );

  render() {
    const { surveysRes, isDraweropen } = this.state;

    const dataHeader = (surveysRes[0] && Object.keys(surveysRes[0])) || [];
    console.log("splice1", dataHeader);
    dataHeader.splice(0, 5);
    return (
      <div className="pt2 responses-container">
        <div className="filter">
          <button className="button-submit ml5 mr5" onClick={this.closeDrawer}>
            {" "}
            Filter
          </button>
          <button
            className="button-submit ml5 mr5"
            onClick={() => this.setState({ allowAttendenceMarking: true })}
            disabled={this.state.allowAttendenceMarking}
          >
            {" "}
            Mark Attendence
          </button>
          <button
            className="button-submit ml5 mr5"
            onClick={this.reset}
            disabled={!this.state.attendenceMarked}
          >
            {" "}
            Reset
          </button>
          <button
            className="button-submit ml5 mr5"
            onClick={this.submitAttendence}
            disabled={!this.state.attendenceMarked}
          >
            {" "}
            Submit
          </button>
        </div>
        {isDraweropen && (
          <div className="drawer">
            <div>
              <span className="close" onClick={this.closeDrawer}>
                {" "}
                &#x2715;
              </span>
            </div>
            <div className="pt2 filter_label">Skills</div>
            <div className="pt1">
              {isDraweropen && (
                <Multiselect
                  options={skills}
                  selectedValues={this.state.selectedValue}
                  onSelect={this.onSelect}
                  onRemove={this.onRemove}
                  displayValue="name"
                />
              )}
            </div>
            <div className="pt2">
              <input
                className="checkbox"
                type="checkbox"
                name="lastname"
                placeholder="Your last name.."
                onClick={this.onToggleOutstation}
              />
              <label>Outstation ready</label>
            </div>
          </div>
        )}
        <div></div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              {dataHeader.map(date => (
                <th>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {surveysRes.filter(i => i.name).map((o,idx) => (
              <tr>
                {Object.keys(o)
                  .filter(i => {
                    return (
                      moment(i, "YYYY-MM-DD", true).isValid() ||
                      i === "skills" ||
                      i === "name" ||
                      i === "outstation"
                    );
                  })
                  .map(k => {
                    const isPresent =
                      moment(k, "YYYY-MM-DD", true).isValid() &&
                      o.attendence &&
                      o.attendence[k];
                    const attendenceMarked =
                      o.attendence && [k] in o.attendence;
                    const notDate = [
                      "skills",
                      "name",
                      "outstation",
                      "batch_id",
                    ].includes(k);
                    return (
                      <td
                        className={notDate ? "" : isPresent ? "present" : "absent"}
                      >
                        {Array.isArray(o[k]) ? o[k].toString(",") : o[k]}
                        {!notDate && this.state.allowAttendenceMarking && (
                          <div>
                            <div>
                              <input type="checkbox" onClick={(e) => this.markAttendence(e,k,idx,"Present",o.batch_id)} checked={o.attendence && o.attendence[k]}/>Present
                            </div>
                            <div>
                              <input type="checkbox" onClick={(e) => this.markAttendence(e,k,idx,"Absent",o.batch_id)} checked={!(o.attendence && o.attendence[k])}/>Absent
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Responses;
