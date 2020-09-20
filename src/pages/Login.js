import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Helper from "../Common/Helper";
import Footer from "../pages/Footer";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    redirect: false,
    authError: false,
    isLoading: false,
    LabelData: [],
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
  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };
  handlePwdChange = (event) => {
    this.setState({ password: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const email = this.state.email;
    const password = this.state.password;
    const CLIENT_CODE = window.app && window.app.env.CLIENT_CODE;
    axios
      .post(Helper.getUrl() + "login", {
        userID: email,
        password: password,
        companyCode: CLIENT_CODE,
      })
      .then((result) => {
        console.log(result);
        if (result.data.success === "1") {
          localStorage.setItem("siteCode", result.data.result.siteCode);
          localStorage.setItem("fullName", result.data.result.fullName);
          localStorage.setItem("staffCode", result.data.result.staffCode);
          this.setState({ redirect: true, isLoading: false });
          // localStorage.setItem("isLoggedIn", true);
        } else {
          alert(result.data.error);
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ authError: true, isLoading: false });
      });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/ShowAppointment" />;
    }
  };
  render() {
    const isLoading = this.state.isLoading;

    return (
      <div>
        <br />
        <br />
        <br />

        <center>
          <h1 style={{ color: "lightgreen" }}>TCM Consultation Go Digital</h1>
        </center>
        <div className="form-row">
          <div className="col-md-3"></div>
          <div
            className="col-md-6"
            style={{
              border: "2px solid #73AD21",
              borderRadius: "25px",
              padding: "30px",
            }}
          >
            <div className="card-header text-center text-warning">
              <h2>Liang Yi TCM</h2>
            </div>

            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <div className="form-label-group">
                  <label htmlFor="inputemail">
                    {Helper.changeLabelFormat(this.state.LabelData.label73)}
                  </label>
                  <input
                    className={
                      "form-control " +
                      (this.state.authError ? "is-invalid" : "")
                    }
                    id="inputemail"
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                    autoFocus
                    required
                  />

                  <div className="invalid-feedback">
                    Please provide a valid username.
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="form-label-group">
                  <label htmlFor="inputPassword">
                    {Helper.changeLabelFormat(this.state.LabelData.label74)}
                  </label>
                  <input
                    type="password"
                    className={
                      "form-control " +
                      (this.state.authError ? "is-invalid" : "")
                    }
                    id="inputPassword"
                    name="password"
                    value={this.state.password}
                    onChange={this.handlePwdChange}
                    required
                  />

                  <div className="invalid-feedback">
                    Please provide a valid Password.
                  </div>
                </div>
              </div>

              <div className="form-group">
                <button
                  className="btn btn-warning font-weight-bold text-white btn-block"
                  type="submit"
                  disabled={this.state.isLoading ? true : false}
                  style={{ backgroundColor: "green" }}
                >
                  {this.state.LabelData.label72} &nbsp;&nbsp;&nbsp;
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
            </form>
          </div>

          <div className="col-md-3">
            <img src={require("./logo_tcm.jfif")} width="350" height="250" />
          </div>
        </div>

        {this.renderRedirect()}
        <Footer />
      </div>
    );
  }
}
