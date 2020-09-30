import React, { Component, Fragment } from "react";
import DeniReactTreeView from "deni-react-treeview";
import { MDBBtn, MDBIcon } from "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import axios from "axios";
import Helper from "../../Common/Helper";
import Header from "../Header";
import Footer from "../Footer";
import dateFormat from "dateformat";
import Spinner from "../../Common/Spinner";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class DiagnosisEntry extends Component {
  state = {
    treeData: [],
    LabelData: [],
    selectedTextBox: "",
    txtMainAction: "",
    txtCurrentSituation: "",
    txtConsultation: "",
    txtBloodPressure: "",
    txtBodyTemp: "",
    txtHeight: "",
    txtWeight: "",
    txtVitality: "",
    txtTreatment: "",
    txtLeftPulse: "",
    txtRightPulse: "",
    txtPathogenesis: "",
    txtAllergic: "",
    txtChineseMedicine: "",
    txtEnglishMedicine: "",
    txtArmLeft: 0,
    txtArmRight: 0,
    txtWaistLeft: 0,
    txtWaistRight: 0,
    txtHipLeft: 0,
    txtHipRight: 0,
    txtThighLeft: 0,
    txtThighRight: 0,
    diagnoseDate: Helper.getCurrentDate(),
    custCode: "",
    custName: "",
    maritalStatus: "",
    gender: "",
    age: "",
    isLoading: true,
    diagnosisHistory: [],
    errorMessage: "",
    paymentSummaryModelShow: false,
    prescriptiontotalDays: [],
    PrescriptionHistory: [],
  };
  componentDidMount() {
    this.GetCustomerData();
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
  GetCustomerData() {
    // console.log("customer triggered");
    axios
      .post(Helper.getUrl() + "tcmDiagnoseCustomerDtl", {
        appointmentCode: localStorage.getItem("appointmentID"),
      })
      .then((result) => {
        if (result.data.success) {
          const customer = result.data.result;

          this.setState({
            custName: customer[0].custName,
            maritalStatus: customer[0].maritalStatus,
            gender: customer[0].gender,
            age: customer[0].age,
            custCode: customer[0].custCode,
          });
          localStorage.setItem("custCode", customer[0].custCode);
          localStorage.setItem("custName", customer[0].custName);
          this.GetCustomerHistory();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetCustomerHistory() {
    const custCode = localStorage.getItem("custCode");

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
  handlePaymentSummaryClose = () => {
    this.setState({ paymentSummaryModelShow: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.value);
  };
  handleMainAction() {
    this.setState({ selectedTextBox: "txtMainAction" });
    this.GetDiseaseData("", "");
  }
  handleLeftPulse() {
    this.setState({ selectedTextBox: "txtLeftPulse" });
    this.GetAllergicData("LeftPulse", "");
  }
  handleRightPulse() {
    this.setState({ selectedTextBox: "txtRightPulse" });
    this.GetAllergicData("RightPulse", "");
  }

  handlePathogenesis() {
    this.setState({ selectedTextBox: "txtPathogenesis" });
    this.GetAllergicData("Pathogenesis", "");
  }

  handleAllergic() {
    this.setState({ selectedTextBox: "txtAllergic" });
    this.GetAllergicData("Allergic", "");
  }
  handleChineseMedicine() {
    this.setState({ selectedTextBox: "txtChineseMedicine" });
    this.GetChineseEnglishName("ChineseName", "", "");
  }
  handleEnglishMedicine() {
    this.setState({ selectedTextBox: "txtEnglishMedicine" });
    this.GetChineseEnglishName("EnglishName", "", "");
  }

  handleSave = (event) => {
    //console.log("code " + localStorage.getItem("custCode"));
    event.preventDefault();
    this.setState({ isLoading: true });

    axios
      .post(Helper.getUrl() + "tcmDiagnose", {
        diagnoseNo: "",
        diagnoseDate: this.state.diagnoseDate,
        custCode: localStorage.getItem("custCode"),
        custName: this.state.custName,
        staffCode: localStorage.getItem("staffCode"),
        staffName: localStorage.getItem("fullName"),
        diagMainAction: this.state.txtMainAction,
        diagCurrentSituation: this.state.txtCurrentSituation,
        diagConsultation: this.state.txtConsultation,
        diagBodyTemp: this.state.txtBodyTemp,
        diagBloodPressure: this.state.txtBloodPressure,
        diagLeftPulse: this.state.txtLeftPulse,
        diagRightPulse: this.state.txtRightPulse,
        diagPathegonesis: this.state.txtPathogenesis,
        diagAllergic: this.state.txtAllergic,
        diagTreatment: this.state.txtTreatment,
        createdBy: localStorage.getItem("fullName"),
        appointmentCode: localStorage.getItem("appointmentID"),
        freeTextEntry: this.state.txtMainAction,
        height: this.state.txtHeight,
        weight: this.state.txtWeight,
        vitality: this.state.txtVitality,
        chineseMedicine: this.state.txtChineseMedicine,
        englishMedicine: this.state.txtEnglishMedicine,
        armLeft: this.state.txtArmLeft,
        armRight: this.state.txtArmRight,
        waistLeft: this.state.txtWaistLeft,
        waistRight: this.state.txtWaistRight,
        hipLeft: this.state.txtHipLeft,
        hipRight: this.state.txtHipRight,
        thighLeft: this.state.txtThighLeft,
        thighRight: this.state.txtThighRight,
      })
      .then((result) => {
        if (result.data.success == "1") {
          this.setState({ redirect: true, isLoading: true });
          this.GetCustomerHistory();
          const diagnoseNo = result.data.result;
          console.log("diagnoseNo" + diagnoseNo);
          //alert("Diagnosis Created Successfully " + diagnoseNo);
          alert("Patient diagnosis is saved ");
          localStorage.setItem("diagnoseNo", diagnoseNo);
          localStorage.setItem(
            "rcptRegTime",
            dateFormat(Helper.getCurrentDate(), "dd/mm/yyyy")
          );
          this.DataClear();
          this.props.history.push({
            pathname: "/PrescriptionEntry",
          });
        } else {
          console.log(result.data.error);
          alert(result.data.error);
          this.DataClear();
          this.GetCustomerHistory();
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError : true, isLoading: false });
      });
  };

  GetPrescriptionHistory(xPrescriptionNo) {
    axios
      .get(
        Helper.getUrl() + "tcmPrescription?PrescriptionNo=" + xPrescriptionNo
      )
      .then((result) => {
        if (result.data.success) {
          const data = result.data.result[0].Items;
          this.setState(
            {
              PrescriptionHistory: data,
              prescriptiontotalDays: result.data.result[0].totalDays,
            },
            () => {
              this.setState({ paymentSummaryModelShow: true });
              // this.IteratePrescriptionAndAssignValues();
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  GetDiseaseData(xCategory, xItemName) {
    axios
      .post(Helper.getUrl() + "tcmDiseaseSearch", {
        category: xCategory,
        ItemName: xItemName,
      })
      .then((result) => {
        if (result.data.success) {
          this.setState({ treeData: result.data.result });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetChineseEnglishName(xType, xCategory, xItemName) {
    axios
      .post(Helper.getUrl() + "tcmChineseSearch", {
        Type: xType,
        category: xCategory,
        ItemName: xItemName,
      })
      .then((result) => {
        if (result.data.success) {
          this.setState({ treeData: result.data.result });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  GetAllergicData(xAllergicType, xSearchKey) {
    axios
      .post(Helper.getUrl() + "tcmAllergicSearch", {
        Type: xAllergicType,
        searchKey: xSearchKey,
      })
      .then((result) => {
        if (result.data.success) {
          const allergicDataLists = [];
          for (var i = 0; i < result.data.result.length; i++) {
            allergicDataLists.push({
              text: result.data.result[i].Chinese,
            });
          }
          this.setState({ treeData: allergicDataLists });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetDiagnoseSingleData(xDiagnoseNo) {
    fetch(Helper.getUrl() + "tcmDiagnose?diagnoseNo=" + xDiagnoseNo)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          txtMainAction: data.result[0].diagMainAction,
          custCode: data.result[0].custCode,
          custName: data.result[0].custName,
          txtCurrentSituation: data.result[0].diagCurrentSituation,
          txtConsultation: data.result[0].diagConsultation,
          txtBloodPressure: data.result[0].diagBloodPressure,
          txtBodyTemp: data.result[0].diagBodyTemp,
          txtHeight: data.result[0].height,
          txtWeight: data.result[0].weight,
          txtVitality: data.result[0].vitality,
          txtTreatment: data.result[0].diagTreatment,
          txtLeftPulse: data.result[0].diagLeftPulse,
          txtRightPulse: data.result[0].diagRightPulse,
          txtPathogenesis: data.result[0].diagPathegonesis,
          txtAllergic: data.result[0].diagAllergic,
          txtChineseMedicine: data.result[0].chineseMedicine,
          txtEnglishMedicine: data.result[0].englishMedicine,
          txtArmLeft: data.result[0].armLeft,
          txtArmRight: data.result[0].armRight,
          txtWaistLeft: data.result[0].waistLeft,
          txtHipLeft: data.result[0].hipLeft,
          txtThighLeft: data.result[0].thighLeft,
          txtThighRight: data.result[0].thighRight,
        })
      );
  }

  DataClear() {
    this.setState({
      txtMainAction: "",
      txtCurrentSituation: "",
      txtConsultation: "",
      txtBloodPressure: "",
      txtBodyTemp: "",
      txtHeight: "",
      txtWeight: "",
      txtVitality: "",
      txtTreatment: "",
      txtLeftPulse: "",
      txtRightPulse: "",
      txtPathogenesis: "",
      txtAllergic: "",
      txtChineseMedicine: "",
      txtEnglishMedicine: "",
    });
  }
  render() {
    const Labels = JSON.stringify(this.state.LabelData);
    //console.log("Labels" + Labels);
    const onSearchChangeHandler = (e) => {
      if (this.state.selectedTextBox === "txtMainAction") {
        this.GetDiseaseData("", e.target.value);
      } else if (this.state.selectedTextBox === "txtLeftPulse") {
        this.GetAllergicData("LeftPulse", e.target.value);
      } else if (this.state.selectedTextBox === "txtRightPulse") {
        this.GetAllergicData("RightPulse", e.target.value);
      } else if (this.state.selectedTextBox === "txtPathogenesis") {
        this.GetAllergicData("Pathogenesis", e.target.value);
      } else if (this.state.selectedTextBox === "txtAllergic") {
        this.GetAllergicData("Allergic", e.target.value);
      } else if (this.state.selectedTextBox === "txtChineseMedicine") {
        this.GetChineseEnglishName("ChineseName", "", e.target.value);
      } else if (this.state.selectedTextBox === "txtEnglishMedicine") {
        this.GetChineseEnglishName("EnglishName", "", e.target.value);
      }
    };
    const onSelectItemHandler = (item) => {
      {
        if (this.state.selectedTextBox === "txtMainAction") {
          this.setState({
            txtMainAction:
              this.state.txtMainAction.length >= 1
                ? this.state.txtMainAction + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "txtLeftPulse") {
          this.setState({
            txtLeftPulse:
              this.state.txtLeftPulse.length >= 1
                ? this.state.txtLeftPulse + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "txtRightPulse") {
          this.setState({
            txtRightPulse:
              this.state.txtRightPulse.length >= 1
                ? this.state.txtRightPulse + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "txtPathogenesis") {
          this.setState({
            txtPathogenesis:
              this.state.txtPathogenesis.length >= 1
                ? this.state.txtPathogenesis + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "txtAllergic") {
          this.setState({
            txtAllergic:
              this.state.txtAllergic.length >= 1
                ? this.state.txtAllergic + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "txtChineseMedicine") {
          this.setState({
            txtChineseMedicine:
              this.state.txtChineseMedicine.length >= 1
                ? this.state.txtChineseMedicine + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "txtEnglishMedicine") {
          this.setState({
            txtEnglishMedicine:
              this.state.txtEnglishMedicine.length >= 1
                ? this.state.txtEnglishMedicine + "," + item.text
                : item.text,
          });
        }
      }
    };

    return (
      <div>
        <Header />

        <br />
        <div className="form-row">
          <div className="col-md-3">
            <div style={{ width: "100%" }}>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td>{this.state.LabelData.label54}</td>
                    <td>{this.state.diagnoseDate}</td>
                  </tr>
                  <tr>
                    <td>{this.state.LabelData.label48}</td>
                    <td>{this.state.custName}</td>
                  </tr>
                  <tr>
                    <td>{this.state.LabelData.label56}</td>
                    <td>{this.state.maritalStatus}</td>
                  </tr>
                  <tr>
                    <td>{this.state.LabelData.label57}</td>
                    <td>{this.state.gender}</td>
                  </tr>
                  <tr>
                    <td>{this.state.LabelData.label59}</td>
                    <td>{this.state.age}</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          {this.state.isLoading ? (
            <div className="col-md-9">
              <Spinner />{" "}
            </div>
          ) : (
            <div className="col-md-9">
              <div
                style={{ width: "100%", height: "250px", overflow: "scroll" }}
              >
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>{this.state.LabelData.label54}</th>
                      <th>{this.state.LabelData.label39}</th>
                      <th>{this.state.LabelData.label40}</th>
                      <th>{this.state.LabelData.label99}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.diagnosisHistory.map((customer, index) => (
                      <tr key={customer.Id}>
                        <td>
                          {dateFormat(customer.diagnoseDate, "dd/mm/yyyy")}
                        </td>

                        <td>
                          <img
                            style={{ paddingRight: "30px" }}
                            src={require("../../assets/down-arrow.png")}
                            width="100"
                            height="40"
                            onClick={this.GetDiagnoseSingleData.bind(
                              this,
                              customer.diagnoseNo
                            )}
                          />

                          {customer.diagnoseSummary}
                        </td>
                        <td>{customer.prescription}</td>
                        <td>
                          <img
                            style={{ paddingRight: "30px" }}
                            src={require("../../assets/eye.png")}
                            width="80"
                            height="40"
                            onClick={this.GetPrescriptionHistory.bind(
                              this,
                              customer.prescription
                            )}
                          />
                          {customer.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <br />
        <div className="form-row">
          <div className="col-md-9">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Main Action</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">General checkup</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Treatment</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="fourth">Slimmimng Treatment</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content
                    style={{
                      border: "2px solid #73AD21",
                      borderRadius: "25px",
                      padding: "20px",
                    }}
                  >
                    <Tab.Pane eventKey="first">
                      <div className="form-row">
                        <div className="col-md-12">
                          <label className="form-label-group">
                            {Helper.changeLabelFormat(
                              this.state.LabelData.label63
                            )}
                          </label>
                          <textarea
                            rows="5"
                            className="form-control search_border"
                            value={this.state.txtMainAction}
                            onClick={this.handleMainAction.bind(this)}
                            onFocus={this.handleMainAction.bind(this)}
                            onChange={(e) =>
                              this.setState({
                                txtMainAction: e.target.value,
                              })
                            }
                            style={{ borderColor: "red" }}
                            placeholder="Search"
                          />
                        </div>

                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label77
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtCurrentSituation}
                              onChange={(e) =>
                                this.setState({
                                  txtCurrentSituation: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label78
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtConsultation}
                              onChange={(e) =>
                                this.setState({
                                  txtConsultation: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-md-6"></div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <div className="form-row">
                        <div className="col-md-4">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label61
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtBloodPressure}
                              onChange={(e) =>
                                this.setState({
                                  txtBloodPressure: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label58
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtBodyTemp}
                              onChange={(e) =>
                                this.setState({ txtBodyTemp: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label1
                              )}
                            </label>
                            <input
                              type="text"
                              value={this.state.txtHeight}
                              className="form-control"
                              onChange={(e) =>
                                this.setState({ txtHeight: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label55
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtWeight}
                              onChange={(e) =>
                                this.setState({ txtWeight: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label2
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtVitality}
                              onChange={(e) =>
                                this.setState({ txtVitality: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label81
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtTreatment}
                              onChange={(e) =>
                                this.setState({ txtTreatment: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <div className="form-row">
                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label79
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ borderColor: "red" }}
                              placeholder="Search"
                              value={this.state.txtLeftPulse}
                              onClick={this.handleLeftPulse.bind(this)}
                              onFocus={this.handleLeftPulse.bind(this)}
                              onChange={(e) =>
                                this.setState({
                                  txtLeftPulse: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label80
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ borderColor: "red" }}
                              placeholder="Search"
                              value={this.state.txtRightPulse}
                              onClick={this.handleRightPulse.bind(this)}
                              onFocus={this.handleRightPulse.bind(this)}
                              onChange={(e) =>
                                this.setState({
                                  txtRightPulse: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label75
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ borderColor: "red" }}
                              placeholder="Search"
                              value={this.state.txtPathogenesis}
                              onClick={this.handlePathogenesis.bind(this)}
                              onFocus={this.handlePathogenesis.bind(this)}
                              onChange={(e) =>
                                this.setState({
                                  txtPathogenesis: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label76
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ borderColor: "red" }}
                              placeholder="Search"
                              value={this.state.txtAllergic}
                              onClick={this.handleAllergic.bind(this)}
                              onFocus={this.handleAllergic.bind(this)}
                              onChange={(e) =>
                                this.setState({
                                  txtAllergic: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label3
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ borderColor: "red" }}
                              placeholder="Search"
                              value={this.state.txtChineseMedicine}
                              onClick={this.handleChineseMedicine.bind(this)}
                              onFocus={this.handleChineseMedicine.bind(this)}
                              onChange={(e) =>
                                this.setState({
                                  txtChineseMedicine: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-label-group">
                            <label htmlFor="inputName">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label4
                              )}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ borderColor: "red" }}
                              placeholder="Search"
                              value={this.state.txtEnglishMedicine}
                              onClick={this.handleEnglishMedicine.bind(this)}
                              onFocus={this.handleEnglishMedicine.bind(this)}
                              onChange={(e) =>
                                this.setState({
                                  txtEnglishMedicine: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="fourth">
                      <div className="form-row">
                        <div className="col-md-3">
                          <div className="form-label-group">
                            <label htmlFor="inputName">Arm Right</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtArmRight}
                              onChange={(e) =>
                                this.setState({ txtArmRight: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-label-group">
                            <label htmlFor="inputName">Arm Left</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtArmLeft}
                              onChange={(e) =>
                                this.setState({ txtArmLeft: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="col-md-3">
                          <div className="form-label-group">
                            <label htmlFor="inputName">Waist</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtWaistLeft}
                              onChange={(e) =>
                                this.setState({ txtWaistLeft: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="col-md-3">
                          <div className="form-label-group">
                            <label htmlFor="inputName">Hip</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtHipLeft}
                              onChange={(e) =>
                                this.setState({ txtHipLeft: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="col-md-3">
                          <div className="form-label-group">
                            <label htmlFor="inputName">Thigh Right</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtThighRight}
                              onChange={(e) =>
                                this.setState({ txtThighRight: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-label-group">
                            <label htmlFor="inputName">Thigh Left</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.txtThighLeft}
                              onChange={(e) =>
                                this.setState({ txtThighLeft: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            <hr />
            <form onSubmit={this.handleSubmit}>
              <div className="form-row">
                <div className="col-md-8"></div>
                <div className="col-md-2">
                  <MDBBtn
                    color="success btn-block"
                    onClick={this.handleSave.bind()}
                  >
                    <MDBIcon size="lg" icon="save" className="mr-2" />
                    {Helper.changeLabelFormat(this.state.LabelData.label21)}
                  </MDBBtn>
                </div>
                <div className="col-md-2 ">
                  <MDBBtn
                    floating
                    gradient="peach"
                    color="danger btn-block"
                    onClick={(e) => this.DataClear()}
                  >
                    <MDBIcon size="lg" icon="backspace" className="mr-2" />
                    {Helper.changeLabelFormat(this.state.LabelData.label45)}
                  </MDBBtn>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-3">
            <div className="form-row">
              <div className="col-md-2">
                <label htmlFor="inputName">
                  {Helper.changeLabelFormat(this.state.LabelData.label44)}
                </label>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  className="form-control"
                  onChange={onSearchChangeHandler}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-12">
                <DeniReactTreeView
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                  items={this.state.treeData}
                  onSelectItem={onSelectItemHandler}
                  autoLoad={true}
                />
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={this.state.paymentSummaryModelShow}
          onHide={this.handlePaymentSummaryClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Payment Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-md-12">
              <table
                style={{
                  fontSize: "14px",
                }}
                className="table table-bordered"
              >
                <thead>
                  <tr>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label15)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label18)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label8)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label11)}
                    </th>
                    <th>
                      {Helper.changeLabelFormat(this.state.LabelData.label5)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.PrescriptionHistory.map((prescription, index) => (
                    <tr key={prescription.lineNo}>
                      <td>{prescription.itemDesc}</td>
                      <td align="right">{prescription.unitPrice}</td>

                      <td align="right">
                        {prescription.itemType === "DRUGS"
                          ? (
                              prescription.itemQty *
                              prescription.daysToTakeMedicine *
                              this.state.prescriptiontotalDays
                            ).toFixed(2)
                          : (
                              prescription.itemQty *
                              prescription.daysToTakeMedicine
                            ).toFixed(2)}
                      </td>

                      <td align="right">
                        {prescription.itemType === "DRUGS"
                          ? (
                              this.state.prescriptiontotalDays *
                              prescription.amount
                            ).toFixed(2)
                          : prescription.amount.toFixed(2)}
                      </td>
                      <td>{prescription.itemType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.handlePaymentSummaryClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Footer />
      </div>
    );
  }
}
