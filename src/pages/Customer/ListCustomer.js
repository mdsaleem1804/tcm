import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Helper from "../../Common/Helper";
import Spinner from "../../Common/Spinner";
export default class ListCustomer extends Component {
  state = {
    customers: [],
    toDashboard: false,
    isLoading: false,
    searchCustomerText: "",
  };

  constructor(props) {
    super(props);
    this.token = localStorage.getItem("token");
  }

  componentDidMount() {}

  setCustomer(customerCode, customerName, nric) {
    console.log("customerCode" + customerCode);
    localStorage.setItem("MCcustCode", customerCode);
    localStorage.setItem("MCcustName", customerName);
    localStorage.setItem("MCnric", nric);
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

  handleClickDelete = (event) => {
    axios
      .delete(this.url + "/" + event.target.value)
      .then((response) => {
        console.log(response);
        this.componentDidMount();
        this.setState({ isLoading: true });
      })
      .catch((error) => {
        console.log(error.toString());
        this.setState({ toDashboard: true });
      });
  };

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
      <div>
        <div className="card mb-3">
          <div className="card-header">
            <div className="form-row">
              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) =>
                    this.setState({ searchCustomerText: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-warning btn-block "
                  type="submit"
                  onClick={this.SearchCustomer.bind(this)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <table
              style={{ fontSize: "12px" }}
              className="table table-bordered"
            >
              <thead>
                <tr>
                  <th>Customer Name</th>

                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.customers.map((customer, index) => (
                  <tr key={customer.customerCode}>
                    <td>{customer.customerName}</td>

                    <button
                      className="btn btn-primary "
                      type="submit"
                      onClick={this.setCustomer.bind(
                        this,
                        customer.customerCode,
                        customer.customerName,
                        customer.nric
                      )}
                    >
                      SET
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
