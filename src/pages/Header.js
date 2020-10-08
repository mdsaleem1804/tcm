import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Helper from "../Common/Helper";
import { MDBBtn, MDBIcon } from "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import "../index.css";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.handleClickLogout = this.handleClickLogout.bind(this);
  }

  state = {
    toDashboard: false,
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

  handleClickLogout() {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", false);
    this.setState({ toDashboard: true });
  }

  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <nav className="navbar navbar-expand  static-top">
          <Link to={"/ShowAppointment"} className="navbar-brand ">
            <MDBBtn color="success btn-block">
              <MDBIcon size="lg" icon="calendar-check" className="mr-2" />
              {Helper.changeLabelFormat(this.state.LabelData.label33)}
            </MDBBtn>
          </Link>

          <Link to={"/DiagnosisEntry"} className="navbar-brand ">
            <MDBBtn color="success btn-block">
              <MDBIcon size="lg" icon="user-md" className="mr-2" />
              {Helper.changeLabelFormat(this.state.LabelData.label39)}
            </MDBBtn>
          </Link>

          <Link to={"/PrescriptionEntry"} className="navbar-brand">
            <MDBBtn color="success btn-block">
              <MDBIcon size="lg" icon="prescription" className="mr-2" />
              {Helper.changeLabelFormat(this.state.LabelData.label40)}
            </MDBBtn>
          </Link>

          <Link to={"/PaymentEntry"} className="navbar-brand">
            <MDBBtn color="success btn-block">
              <MDBIcon size="lg" icon="dollar-sign" className="mr-2" />
              {Helper.changeLabelFormat(this.state.LabelData.label34)}
            </MDBBtn>
          </Link>

          <Link to={"/MCEntry"} className="navbar-brand">
            <MDBBtn color="success btn-block">
              <MDBIcon size="lg" icon="file-medical" className="mr-2" />
              {Helper.changeLabelFormat(this.state.LabelData.label60)}
            </MDBBtn>
          </Link>

          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav"></ul>
            <Link
              to={"#"}
              onClick={this.handleClickLogout}
              className="navbar-brand"
            >
              <MDBBtn color="success btn-block">
                <MDBIcon icon="sign-out-alt" className="mr-2" size="lg" />
                {this.state.LabelData.label184}[
                {localStorage.getItem("fullName")} ]
              </MDBBtn>
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}
