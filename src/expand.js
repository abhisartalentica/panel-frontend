import React, { Component } from "react";
import moment from "moment";
import raw from "./apiService";

class Expand extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          id: 1,
          name: "survey 1",
          created_on: "22/06/2019",
          recepients:
            "karan@gmail.com,ram@gmail.com,laxman@gmail.com,karan@gmail.com,ram@gmail.com,laxman@gmail.com,karan@gmail.com,ram@gmail.com,laxman@gmail.com",
          responders: "karan@gmail.com",
        },
        {
          id: 2,
          name: "survey 2",
          created_on: "22/06/2019",
          recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
          responders: "karan@gmail.com,laxman@gmail.com",
        },
        {
          id: 3,
          name: "survey 3",
          created_on: "22/06/2019",
          recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
          responders: "karan@gmail.com",
        },
        {
          id: 4,
          name: "survey 4",
          created_on: "22/06/2019",
          recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
          responders: "karan@gmail.com,laxman@gmail.com",
        },
        {
          id: 5,
          name: "survey 5",
          created_on: "22/06/2019",
          recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
          responders: "karan@gmail.com",
        },
        {
          id: 6,
          name: "survey 6",
          created_on: "22/06/2019",
          recepients: "karan@gmail.com,ram@gmail.com,laxman@gmail.com",
          responders: "karan@gmail.com",
        },
      ],
      expandedRows: [],
    };
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(id => id !== rowId)
      : currentExpandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
  }

  resendInvitation = id => {
    raw
      .post("http://172.19.101.133:3000/send_reminder_mails", { survey_id: id })
      .then(r => alert("Successfully sent reminder invitations."));
  };

  renderItem(item) {
    if (!item.created_on) return null;
    const clickCallback = () => this.handleRowClick(item.id);
    const itemRows = [
      <tr onClick={clickCallback} key={"row-data-" + item.id}>
        <td>{item.name}</td>
        <td>{moment(item.created_on).format("YYYY-MM-DD")}</td>
        <td>{item.recepients.split(",").filter(i => i).length}</td>
        <td>{item.responders.split(",").filter(i => i).length}</td>
        <td>
          <button
            className="button-submit"
            onClick={() => this.resendInvitation(item.id)}
            disabled={
              item.in_queue === "" || item.in_queue.split(",").length === 0
            }
          >
            Resend
          </button>
        </td>
      </tr>,
    ];

    if (this.state.expandedRows.includes(item.id)) {
      let defaulter = [];
      item.recepients.split(",").forEach((i, key) => {
        if (!item.responders.includes(i)) {
          defaulter.push(i);
        }
      });
      if(defaulter
        .toString()
        .split(",")
      .filter(i => i).length)
      itemRows.push(
        <div className="details pt2 pb2" key={"row-expanded-" + item.id}>
          <div>
            <div>
              <b>Pending Respondents (Those with pending responses)</b>
            </div>
            {defaulter
              .toString()
              .split(",")
              .map((i, key) => (
                <div>{`${key + 1}. ${i}`}</div>
              ))}
          </div>
        </div>
      );
      if(item.responders.split(",")
      .filter(i => i).length)
      itemRows.push(
        <div className="details pb2" key={"row--responders-expanded-" + item.id}>
          <div>
            <div>
              <b>Respondents (Those who have responded.)</b>
            </div>
            {item.responders.split(",")
              .filter(i => i).map((i, key) => (
                <div>{`${key + 1}. ${i}`}</div>
              ))}
          </div>
          </div>
      )
    }

    return itemRows;
  }

  render() {
    let allItemRows = [];
    this.props.surveys.forEach(item => {
      const perItemRows = this.renderItem(item);
      allItemRows = allItemRows.concat(perItemRows);
    });

    return (
      <div className="pt2">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created on</th>
              <th>Total Recepients</th>
              <th>Respondents</th>
              <th>Reminder</th>
            </tr>
          </thead>
          {allItemRows}
        </table>
      </div>
    );
  }
}

export default Expand;
