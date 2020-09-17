import React, { Component } from "react";
import dateFormat from "dateformat";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Helper from "../../Common/Helper";
import Spinner from "../../Common/Spinner";

export default class DiagnosisHistory extends Component {
  state = {
    redirect: false,
    toDashboard: false,
    isLoading: true,
    diagnosisHistory: [],
  };

  handleChange(e) {
    console.log("handle change called");
  }
  componentDidMount() {
    const custCode = localStorage.getItem("custCode");
    //console.log("Fetch Cust Code : " + custCode)
    axios
      .post(Helper.getUrl() + "tcmDiagnoseHistory", {
        custCode: custCode,
      })
      .then((result) => {
        if (result.data.success) {
          const customer = result.data.result;
          this.setState({
            diagnosisHistory: customer,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to="/" />;
    }
    if (this.state.isLoading)
      return (
        <div>
          <Spinner />
        </div>
      );
    return (
      <div style={{ width: "100%", height: "250px", overflow: "scroll" }}>
        <table
          style={{
            fontSize: "14px",
          }}
          className="table table-bordered"
        >
          <thead>
            <tr>
              <th>日期</th>
              <th>疾病</th>
              <th>处方</th>
            </tr>
          </thead>
          <tbody>
            {this.state.diagnosisHistory.map((customer, index) => (
              <tr key={customer.Id}>
                <td>{dateFormat(customer.diagnoseDate, "dd/mm/yyyy")}</td>
                <td>{customer.diagnoseSummary}</td>
                <td>{customer.prescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
