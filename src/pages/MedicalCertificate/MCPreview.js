import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Helper from "../../Common/Helper";
import Spinner from "../../Common/Spinner";
import Header from "../Header";
import dateFormat from "dateformat";

export default class MCPreview extends Component {
  state = {
    medicalCertificateNo: "",
    medicalCertificateDate: "",
    diagnoseNo: "",
    diagnoseDate: "",
    diagnoseTime: "",
    custCode: "",
    custName: "",
    staffCode: "",
    staffName: "",
    noOfDays: "",
    fromDate: "",
    toDate: "",
    reason: "",
    createdBy: "",
    siteCode: "",
    nric: "",
    custSign: null,
    staffSign: null,
    isLoading: false,
    staffSignString: "",
    LabelData: [],
  };

  constructor(props) {
    super(props);
    this.token = localStorage.getItem("token");
  }

  componentDidMount() {
    this.SearchCustomer();
    this.GetInvoiceDetails();
    this.GetLabels();
  }
  SearchCustomer() {
    const xMCNo = this.props.location.search.replace("?MCNo=", "");
    axios
      .get(Helper.getUrl() + "tcmMedicalCertificate?MCNo=" + xMCNo)
      .then((result) => {
        if (result.data.success) {
          const medical_certificates = result.data.result;
          this.setState({
            medicalCertificateNo: medical_certificates[0].medicalCertificateNo,
            custName: medical_certificates[0].custName,
            medicalCertificateDate: dateFormat(
              medical_certificates[0].medicalCertificateDate,
              "dd/mm/yyyy"
            ),

            reason: medical_certificates[0].reason,
            fromDate: dateFormat(
              medical_certificates[0].fromDate,
              "dd/mm/yyyy"
            ),
            toDate: dateFormat(medical_certificates[0].toDate, "dd/mm/yyyy"),
            noOfDays: medical_certificates[0].noOfDays,
            diagnoseDate: medical_certificates[0].diagnoseDate,
            diagnoseTime: medical_certificates[0].diagnoseTime,
            staffSignString: medical_certificates[0].staffSignString,
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
  GetInvoiceDetails() {
    const siteCode = localStorage.getItem("siteCode");
    axios
      .get(Helper.getUrl() + "getInvoiceTitle?siteCode=" + siteCode)
      .then((result) => {
        if (result.data.success) {
          const siteDetails = result.data.result;
          console.log(siteDetails);
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
        <Header />
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
        </center>
        <hr />
        <h4>
          <div
            style={{
              marginLeft: "30px",
              marginRight: "30px",
              whiteSpace: "pre-line",
            }}
          >
            <div className="form-row">
              <div className="col-md-6">
                <div className="form-label-group">
                  <label htmlFor="inputName">
                    {this.state.LabelData.label158}
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-label-group">
                  <label>
                    {this.state.LabelData.label161}
                    {" " + this.state.medicalCertificateNo}
                  </label>
                  <br />
                  <label>
                    日期Date{" "}
                    {"" + dateFormat(Helper.getCurrentDate(), "dd/mm/yyyy")}
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div className="form-row">
              <div className="col-md-6">
                <div className="form-label-group">
                  <label htmlFor="inputName">
                    这是为了证明 This is to certify that {this.state.custName}
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div className="form-row">
              <div className="col-md-6">
                <div className="form-label-group">
                  <label htmlFor="inputName">
                    {this.state.LabelData.label49}{" "}
                    {localStorage.getItem("MCnric")}
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div className="form-row">
              <div className="col-md-12">
                <div className="form-label-group">
                  <label htmlFor="inputName">
                    前往诊所 Visited the clinic on {this.state.diagnoseDate}
                    在at {this.state.diagnoseTime} 并被给予 and is to be given
                    to {" " + this.state.noOfDays} 天）day(s) 的病假 of sick
                    leave from {this.state.fromDate} 至 to {this.state.toDate}
                  </label>
                </div>
              </div>
            </div>
            <br />
            <div className="form-row">
              <div className="col-md-12">
                <div className="form-label-group">
                  <label htmlFor="inputName">
                    备注 Remarks: {this.state.reason}
                  </label>
                </div>
              </div>
            </div>
            <br />
            <br />

            <div className="form-row">
              <div className="col-md-6">
                <div className="form-label-group">
                  <br /> <br />
                  <br />
                  <label>___________________</label>
                  <br />
                  <label htmlFor="inputName">Clinic's Stamp: </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-label-group">
                  <img
                    width="200px"
                    height="100px"
                    src={this.state.staffSignString}
                  />
                  <br />
                  <label htmlFor="inputName">TCM Physician: </label>
                </div>
              </div>
            </div>
            <br />
            <div className="form-row">
              <div className="col-md-12">
                <div className="form-label-group">
                  <label>
                    The certificate is not valid for absence from court or other
                    judicial proceedings unless specifically stated
                  </label>
                </div>
              </div>
            </div>
          </div>
        </h4>
      </div>
    );
  }
}
