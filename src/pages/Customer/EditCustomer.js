import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Header from "../Header";
import Helper from "../../Common/Helper";
export default class EditCustomer extends Component {
  constructor(props) {
    super(props);
    this.url = "https://reqres.in/api/users";
    this.token = localStorage.getItem("token");
  }

  state = {
    id: "",
    redirect: false,
    isLoading: false,
  };

  componentDidMount() {
    const xCustCode = this.props.location.search.replace("?custCode=", "");
    axios
      .post(Helper.getUrl() + "tcmCustomerSearch", {
        custCode: xCustCode,
      })
      .then((result) => {
        if (result.data.success) {
          const customer = result.data.result;
          document.getElementById("inputCustomerName").value =
            customer[0].custName;
          document.getElementById("inputPhoneNumber").value =
            customer[0].custNRIC;
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError: true, isLoading: false });
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const url = "Helper.getUrl()" + this.state.id;
    const name = document.getElementById("inputCustomerName").value;
    const phone = document.getElementById("inputPhoneNumber").value;
    axios
      .put(url, {
        name: name,
        job: phone,
      })
      .then((result) => {
        if (result.data.status) {
          this.setState({ redirect: true, isLoading: false });
        }
      })
      .catch((error) => {
        this.setState({ toDashboard: true });
        console.log(error);
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
                      className="form-control"
                      required="required"
                      autoFocus="autofocus"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputPhone">Phone Number</label>
                    <input
                      type="number"
                      id="inputPhoneNumber"
                      className="form-control"
                      required="required"
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
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-label-group">
                    <label htmlFor="inputPhone">Nric</label>
                    <input
                      type="text"
                      id="inputNric"
                      className="form-control"
                      required="required"
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
                      className="form-control"
                      required="required"
                      autoFocus="autofocus"
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
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={this.state.isLoading ? true : false}
            >
              Add Customer &nbsp;&nbsp;&nbsp;
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
          </form>
          {this.renderRedirect()}
        </div>
      </div>
    );
  }
}
