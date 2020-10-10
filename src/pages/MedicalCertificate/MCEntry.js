import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import Helper from "../../Common/Helper";
import dateFormat from "dateformat";
import SignaturePad from "react-signature-canvas";
import styles from "./mc.css";
import DatePicker from "react-datepicker";
export default class MCEntry extends Component {
  state = {
    medicalCertificateNo: "",
    medicalCertificateDate: "",
    noOfDays: "",
    fromDate: dateFormat(Helper.getCurrentDate(), "yyyy-mm-dd"),
    toDate: dateFormat(Helper.getCurrentDate(), "yyyy-mm-dd"),
    reason: "",
    createdBy: "",
    custSign: null,
    staffSign: null,
    isLoading: false,
    medical_certificates: [],
    searchCustomerText: "",
    customers: [],
    MCcustCode: "",
    MCcustName: "",
    MCnric: "",
    diagnosisHistory: [],
    LabelData: [],
    trimmedDataURL: null,
    diagnoseNo: "",
  };
  sigPad = {};
  clear = () => {
    this.sigPad.clear();
  };
  trim = () => {
    this.setState(
      {
        trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
      },
      () => {
        this.sigPad.clear();
      }
    );
  };

  componentDidMount() {
    this.GetLabels();
  }
  GetLabels() {
    axios
      .get(Helper.getUrl() + "tcmLabelsWithId")
      .then((result) => {
        if (result.data.success) {
          const data = result.data.result[0];
          this.setState({
            LabelData: data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  setCustomer(customerCode, customerName, nric) {
    /* localStorage.setItem("MCcustCode", customerCode);
    localStorage.setItem("MCcustName", customerName);
    localStorage.setItem("MCnric", nric);*/
    this.setState({
      MCcustCode: customerCode,
      MCcustName: customerName,
      MCnric: nric,
      // customers: [],
    });
    this.GetMCFromCustCode(customerCode);
    this.GetDiagnoseHistory(customerCode);
  }
  SearchCustomer() {
    const searchText = this.state.searchCustomerText;
    if (searchText === "") {
      alert("Search Text Should not be empty");
      return;
    }
    this.setState({ isLoading: true });

    axios
      .post(Helper.getUrl() + "tcmCustomerSearch", {
        custCode: this.state.searchCustomerText,
      })
      .then((result) => {
        if (result.data.success) {
          const customers = result.data.result;
          this.setState({ customers: customers, isLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  }

  DataClear() {
    this.setState({
      fromDate: "",
      toDate: "",
      reason: "",
    });
  }
  GetDiagnoseHistory(recCusCode) {
    console.log("diagnosisHistory" + recCusCode);
    axios
      .post(Helper.getUrl() + "tcmDiagnoseHistory", {
        custCode: recCusCode,
      })
      .then((result) => {
        if (result.data.success == "1") {
          const resultDiagnosis = result.data.result;
          console.log("res" + JSON.stringify(resultDiagnosis));
          this.setState({
            diagnosisHistory: resultDiagnosis,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetMCFromCustCode(recCusCode) {
    axios
      .get(Helper.getUrl() + "tcmMedicalCertificateList?custCode=" + recCusCode)
      .then((result) => {
        if (result.data.success === "1") {
          const medical_certificates = result.data.result;
          this.setState({
            medical_certificates: medical_certificates,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError: true, isLoading: false });
      });
  }
  handleSave = (event) => {
    if (this.state.MCcustCode == "") {
      alert("Customer Code should not be empty");
      return;
    }
    if (this.state.diagnoseNo == "") {
      alert("Diagnose should not be empty");
      return;
    }
    if (this.state.fromDate == "") {
      alert("FromDate should not be empty");
      return;
    }
    if (this.state.toDate == "") {
      alert("ToDate should not be empty");
      return;
    }
    if (this.state.trimmedDataURL === null) {
      alert("Staff Sign should not be empty ");
      return;
    }
    event.preventDefault();
    const date1 = new Date(this.state.fromDate);
    const date2 = new Date(this.state.toDate);
    const daysDifference = Math.abs(date2 - date1) / (1000 * 60 * 60 * 24) + 1;
    this.setState({ isLoading: true });
    var jsonkey_data = {
      medicalCertificateNo: "",
      medicalCertificateDate: Helper.getCurrentDate(),
      diagnoseNo: this.state.diagnoseNo,
      custCode: this.state.MCcustCode,
      custName: this.state.MCcustName,
      staffCode: localStorage.getItem("staffCode"),
      staffName: localStorage.getItem("fullName"),
      noOfDays: daysDifference,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      reason: this.state.reason,
      createdBy: localStorage.getItem("staffCode"),
      siteCode: localStorage.getItem("siteCode"),
      staffSignString: this.state.trimmedDataURL,
    };
    console.log("MC" + jsonkey_data);

    axios
      .post(Helper.getUrl() + "tcmMedicalCertificate", jsonkey_data)
      .then((result) => {
        console.log(result);
        if (result.data.success === "1") {
          this.setState({ redirect: true, isLoading: false });
          alert("MC Created Succesully" + result.data.result);
          this.GetMCFromCustCode(this.state.MCcustCode);
          this.DataClear();
        } else {
          alert(
            result.data.error === "" ? result.data.result : result.data.error
          );
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError: true, isLoading: false });
      });
  };
  handleSubmit = (event) => {
    event.preventDefault();
  };
  render() {
    let { trimmedDataURL } = this.state;

    return (
      <div>
        <Header />
        <br />
        <b>Medical History</b>
        <br /> <br />
        <div className="form-row">
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-header">
                <div className="col-md-12">
                  <label
                    style={{
                      color: "red",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Selected Customer {this.state.MCcustName} / Code :{" "}
                    {this.state.MCcustCode}
                  </label>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "200px",
                overflow: "scroll",
              }}
            >
              <table
                style={{ fontSize: "12px" }}
                className="table  table-hover table-bordered"
              >
                <thead>
                  <tr>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label189)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label190)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label191)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label192)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label193)}
                    </th>

                    <th colSpan="2" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.medical_certificates.map((customer) => (
                    <tr key={customer.medicalCertificateNo}>
                      <td>{customer.medicalCertificateNo}</td>
                      <td>
                        {dateFormat(
                          customer.medicalCertificateDate,
                          "dd/mm/yyyy"
                        )}
                      </td>

                      <td>{customer.reason}</td>
                      <td>{dateFormat(customer.fromDate, "dd/mm/yyyy")}</td>
                      <td>{dateFormat(customer.toDate, "dd/mm/yyyy")}</td>

                      <td>
                        <div className="col-md-1">
                          <Link
                            className="btn btn-sm btn-info"
                            to={{
                              pathname: "MCPreview",
                              search: "?MCNo=" + customer.medicalCertificateNo,
                            }}
                          >
                            Print
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <div className="card mb-3">
                <p
                  style={{
                    color: "red",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Search Customer Name to Proceed 请输入顾客名字
                </p>
                <div className="card-header">
                  <div className="form-row">
                    <div className="col-md-7">
                      <input
                        type="text"
                        className="form-control"
                        onChange={(e) =>
                          this.setState({
                            searchCustomerText: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-warning btn-block "
                        type="submit"
                        onClick={this.SearchCustomer.bind(this)}
                      >
                        {this.state.LabelData.label44}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    overflow: "scroll",
                  }}
                >
                  <table className="table  table-hover table-bordered">
                    <tbody>
                      {this.state.customers.map((customer) => (
                        <tr key={customer.customerCode}>
                          <td
                            onClick={this.setCustomer.bind(
                              this,
                              customer.customerCode,
                              customer.customerName,
                              customer.nric
                            )}
                          >
                            {customer.customerName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <b>New Entry</b> <br />
        <br />
        <div className="form-row">
          <div className="col-md-8">
            <form onSubmit={this.handleSubmit}>
              <div
                style={{
                  border: "2px solid #73AD21",
                  borderRadius: "25px",
                }}
              >
                <div
                  className="form-row"
                  style={{
                    marginTop: "10px",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                >
                  <div className="col-md-4">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(
                          this.state.LabelData.label192
                        )}
                      </label>

                      <input
                        type="date"
                        id="inputFromDate"
                        value={this.state.fromDate}
                        className="form-control"
                        autoFocus="autofocus"
                        onChange={(e) =>
                          this.setState({ fromDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(
                          this.state.LabelData.label193
                        )}
                      </label>

                      <input
                        type="date"
                        id="inputToDate"
                        value={this.state.toDate}
                        className="form-control"
                        autoFocus="autofocus"
                        onChange={(e) =>
                          this.setState({ toDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(this.state.LabelData.label39)}
                      </label>

                      <select
                        className="form-control"
                        onChange={(e) =>
                          this.setState({ diagnoseNo: e.target.value })
                        }
                      >
                        <option>Select Diagnose</option>
                        {this.state.diagnosisHistory.map((customer) => (
                          <option
                            key={customer.diagnoseNo}
                            value={customer.diagnoseNo}
                          >
                            {customer.diagnoseDate}
                          </option>
                        ))}
                        ;
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(
                          this.state.LabelData.label191
                        )}
                      </label>

                      <textarea
                        rows="4"
                        value={this.state.reason}
                        className="form-control"
                        autoFocus="autofocus"
                        onChange={(e) =>
                          this.setState({ reason: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(
                          this.state.LabelData.label195
                        )}
                      </label>
                      <div
                        style={{
                          border: "2px solid #73AD21",
                        }}
                      >
                        <div className={styles.container}>
                          <div className={styles.sigContainer}></div>

                          {trimmedDataURL ? (
                            <img
                              className={styles.sigImage}
                              src={trimmedDataURL}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <br />
                    <button
                      className="btn btn-primary btn-block "
                      onClick={this.handleSave.bind()}
                    >
                      {Helper.changeLabelFormat(this.state.LabelData.label21)}
                    </button>
                  </div>
                </div>
                <br />
              </div>
            </form>
          </div>
          <div
            className="col-md-3"
            style={{
              border: "1px dotted black",
            }}
          >
            <div className="form-label-group">
              <label htmlFor="inputName">Signature Area</label>

              <div>
                <div>
                  <SignaturePad
                    canvasProps={{ className: styles.sigPad }}
                    ref={(ref) => {
                      this.sigPad = ref;
                    }}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-info btn-block "
                    onClick={this.clear.bind()}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-warning btn-block "
                    onClick={this.trim.bind()}
                  >
                    SET AS STAFF SIGN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
