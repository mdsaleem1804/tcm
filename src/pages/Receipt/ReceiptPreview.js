import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Helper from "../../Common/Helper";
import Spinner from "../../Common/Spinner";
import Header from "../Header";
import "./rcpt_style.css";
import { NoPrint, A3, A4, A5 } from "paper-print-react";
export default class ReceiptPreview extends Component {
  state = {
    LabelData: [],
    customerDetails: [],
    prescriptionDataForReceiptItems: [],
    prescriptionDataForReceipt: [],
    rcptDetails: localStorage.getItem("rcptItems"),
    tempItemGroup: "",
    pageSize: "A4",
  };

  componentDidMount() {
    this.GetInvoiceDetails();
    this.GetCustomerHistory();
    this.GetLabels();
    this.GetCustomerPrescriptionSingleData(
      localStorage.getItem("rcptPrescriptionNo")
    );
  }
  GetInvoiceDetails() {
    const siteCode = localStorage.getItem("siteCode");
    axios
      .get(Helper.getUrl() + "getInvoiceTitle?siteCode=" + siteCode)
      .then((result) => {
        if (result.data.success) {
          const siteDetails = result.data.result;

          this.setState({
            siteHeader: siteDetails.siteHeader,
            siteAddress: siteDetails.siteAddress,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError: true, isLoading: false });
      });
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
  GetCustomerHistory() {
    const custCode = localStorage.getItem("custCode");
    axios
      .post(Helper.getUrl() + "tcmCustomerSearch", {
        custCode: custCode,
      })
      .then((result) => {
        if (result.data.success) {
          const customer = result.data.result[0];

          this.setState({
            customerDetails: customer,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  setStateForRepeat(passItemGroup) {
    this.setState({ tempItemGroup: passItemGroup });
    console.log("passItemGroup" + passItemGroup);
  }
  GetCustomerPrescriptionSingleData(xPrescriptionNo) {
    axios
      .get(
        Helper.getUrl() + "tcmPrescription?PrescriptionNo=" + xPrescriptionNo
      )
      .then((result) => {
        if (result.data.success == "1") {
          const data = result.data.result[0];
          this.setState({ prescriptionDataForReceiptItems: data.Items });
          this.setState({ prescriptionDataForReceipt: data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getUnique(arr, index) {
    const unique = arr
      .map((e) => e[index])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
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
    const rcptItems = this.getUnique(
      this.state.prescriptionDataForReceiptItems,
      "itemGroup"
    );
    const rcpt = this.state.prescriptionDataForReceipt;
    const rcptForDrugs = this.getUnique(
      this.state.prescriptionDataForReceiptItems,
      "lineNo"
    );
    const drugAmount = rcptForDrugs
      .filter((res) => res.itemType === "DRUGS")
      .reduce((sum, currentValue) => {
        return sum + eval(currentValue.amount);
      }, 0);
    const consultationFee = rcpt.consultationFee;
    const totalAmountPayable = eval(drugAmount + consultationFee).toFixed(2);
    const printData = rcptItems.map((filteredPerson, i) => (
      <div key={i}>
        <center>
          <h1> {this.state.siteHeader}</h1>
          <h3
            style={{
              marginLeft: "30px",
              marginRight: "30px",
              whiteSpace: "pre-line",
            }}
          >
            {this.state.siteAddress}
          </h3>
          <table width="100%" className="table table-bordered">
            <thead>
              <tr>
                <td width="40%">收据 Receipt</td>
                <td> {rcpt.prescriptionNo}</td>
              </tr>
              <tr>
                <td>记账到 BillTo</td>
                <td> {rcpt.custName}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label49}</td>
                <td>{this.state.customerDetails.nric}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label196}</td>
                <td> {rcpt.prescriptionDate}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label197}</td>
                <td> {rcpt.staffName}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label198}</td>
                <td> {rcpt.registrationNo}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label199}</td>
                <td>{filteredPerson.daysToTakeMedicine}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label200}</td>
                <td>{filteredPerson.timeToTakeMedicine}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label201}</td>
                <td>{filteredPerson.waysToTakeMedicine}</td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label202}</td>
                <td>{filteredPerson.remark}</td>
              </tr>

              <tr>
                <td>{this.state.LabelData.label22}</td>
                <td>{rcpt.consultationFee} </td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label25}</td>
                <td>{drugAmount.toFixed(2)} </td>
              </tr>
              <tr>
                <td>{this.state.LabelData.label205}</td>
                <td>{totalAmountPayable} </td>
              </tr>
            </thead>
          </table>
          <footer></footer>
        </center>
      </div>
    ));
    return (
      <div>
        <Header />
        <br />
        <NoPrint>
          <div className="form-row">
            <div className="col-md-1">
              <div className="form-label-group">
                <label htmlFor="inputName">Choose Page Size</label>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-label-group">
                <select
                  className="form-control"
                  name="itemtype"
                  onChange={(e) => this.setState({ pageSize: e.target.value })}
                >
                  <option value="">Please Select</option>
                  <option value="A4">A4</option>
                  <option value="A5">A5</option>
                </select>
              </div>
            </div>
          </div>
        </NoPrint>
        <hr />
        {this.state.pageSize === "A5" ? (
          <A5
            landscape
            style={{
              overflow: "hidden",
              height: "100%",
            }}
          >
            {printData}
          </A5>
        ) : (
          <A4
            landscape
            style={{
              overflow: "hidden",
              height: "100%",
            }}
          >
            {printData}
          </A4>
        )}
      </div>
    );
  }
}
