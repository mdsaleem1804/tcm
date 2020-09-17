import React, { Component } from "react";
import Header from "../Header";

import { Redirect } from "react-router-dom";
import axios from "axios";
import Helper from "../../Common/Helper";

export default class AddCustomer extends Component {
  state = {
    redirect: false,
    toDashboard: false,
    isLoading: false,
    genderList: [
      { value: "", display: "Please Select" },
      { value: "1", display: "Male" },
      { value: "2", display: "Female" },
    ],
    selectedGender: "",
    customerName: "",
    phoneNumber: "",
    email: "",
    nric: "",
    referenceCode: "",
    dateOfBirth: "",
    maritalStatus: "",
    genderCode: "",
    nationalityCode: "",
    race: "",
    CustAddr1: "",
    CustAddr2: "",
    validationErrorForGender: "",
    btnSaveUpdateText: "SAVE",
  };

  handleChangeCustomerName(event) {
    this.setState({ customerName: event.target.value });
  }
  componentDidMount() {
    const xCustCode = this.props.location.search.replace("?custCode=", "");
    //console.log(xCustCode);
    if (xCustCode !== "") {
      this.setState({ btnSaveUpdateText: "UPDATE" });
    }
    axios
      .post(Helper.getUrl() + "tcmCustomerSearch", {
        custCode: xCustCode,
      })
      .then((result) => {
        if (result.data.success) {
          const customer = result.data.result;
          this.setState({
            customerName: customer[0].customerName,
            phoneNumber: customer[0].phoneNumber,
            email: customer[0].email,
            nric: customer[0].nric,
            referenceCode: customer[0].referenceCode,
            CustAddr1: customer[0].CustAddr1,
            CustAddr2: customer[0].CustAddr2,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    axios
      .post(Helper.getUrl() + "customer", {
        siteCode: localStorage.getItem("siteCode"),
        customerName: this.state.customerName,
        phoneNumber: document.getElementById("inputPhoneNumber").value,
        email: document.getElementById("inputEmail").value,
        nric: document.getElementById("inputNric").value,
        referenceCode: document.getElementById("inputReferenceCode").value,
        dateOfBirth: document.getElementById("inputDateOfBirth").value,
        maritalStatus: document.getElementById("inputMaritalStatus").value,
        genderCode: document.getElementById("inputGenderCode").value,
        nationalityCode: document.getElementById("inputNationalityCode").value,
        race: document.getElementById("inputRace").value,
        CustAddr1: document.getElementById("inputCustAddr1").value,
        CustAddr2: document.getElementById("inputCustAddr2").value,
      })
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          this.setState({ redirect: true, isLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError: true, isLoading: false });
      });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/ListCustomer" />;
    }
  };

  render() {
    const isLoading = this.state.isLoading;

    if (this.state.toDashboard === true) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Header />

        <div className="card-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <div className="form-row">
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Customer Name</label>
                    <input
                      type="text"
                      id="inputCustomerName"
                      value={this.state.customerName}
                      className="form-control"
                      required="required"
                      autoFocus="autofocus"
                      onChange={(e) =>
                        this.setState({ customerName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputPhone">Phone Number</label>
                    <input
                      type="number"
                      id="inputPhoneNumber"
                      value={this.state.phoneNumber}
                      className="form-control"
                      required="required"
                      onChange={(e) =>
                        this.setState({ phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputPhone">Email</label>
                    <input
                      type="email"
                      id="inputEmail"
                      className="form-control"
                      required="required"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputPhone">Nric</label>
                    <input
                      type="text"
                      id="inputNric"
                      value={this.state.nric}
                      className="form-control"
                      required="required"
                      onChange={(e) => this.setState({ nric: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Reference Code</label>
                    <input
                      type="text"
                      id="inputReferenceCode"
                      value={this.state.referenceCode}
                      className="form-control"
                      required="required"
                      autoFocus="autofocus"
                      onChange={(e) =>
                        this.setState({ referenceCode: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Date Of Birth</label>
                    <input
                      type="date"
                      id="inputDateOfBirth"
                      className="form-control"
                      required="required"
                      autoFocus="autofocus"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Marital Status</label>
                    <select className="form-control" id="inputMaritalStatus">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Gender</label>

                    <select
                      className="form-control"
                      id="inputGenderCode"
                      value={this.state.selectedGender}
                      onChange={(e) =>
                        this.setState({
                          selectedGender: e.target.value,
                          validationErrorForGender:
                            e.target.value === ""
                              ? "You must select your favourite gender"
                              : "",
                        })
                      }
                    >
                      {this.state.genderList.map((gender) => (
                        <option key={gender.value} value={gender.value}>
                          {gender.display}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      {this.state.validationErrorForGender}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Nationality Code</label>
                    <select className="form-control" id="inputNationalityCode">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Race</label>
                    <select className="form-control" id="inputRace">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Address1</label>
                    <textarea
                      className="form-control"
                      id="inputCustAddr1"
                      value={this.state.CustAddr1}
                      onChange={(e) =>
                        this.setState({ CustAddr1: e.target.value })
                      }
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputName">Address2</label>
                    <textarea
                      className="form-control"
                      id="inputCustAddr2"
                      value={this.state.CustAddr2}
                      onChange={(e) =>
                        this.setState({ CustAddr2: e.target.value })
                      }
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-10"></div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary btn-block "
                  type="submit"
                  disabled={this.state.isLoading ? true : false}
                >
                  {this.state.btnSaveUpdateText} &nbsp;&nbsp;&nbsp;
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <span></span>
                  )}
                </button>
              </div>
            </div>
          </form>
          {this.renderRedirect()}
        </div>
      </div>
    );
  }
}
