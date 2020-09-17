import React, { Component } from "react";
import "../../../node_modules/react-dropdown-tree-select/dist/styles.css";
import axios from "axios";
import Helper from "../../Common/Helper";
import Header from "../Header";
import Footer from "../Footer";

export default class PrescriptionEntry extends Component {
  state = {
    prescriptionCode: "",
    staffCode: "",
    consultationFees: 0,
    drugsAmount: 0,
    massageAmount: 0,
    acupunctureAmount: 0,
    serviceAmount: 0,
    retailAmount: 0,
    grandTotal: 0,
    siteCode: "",
    LabelData: [],
    prescriptiontotalDays: [],
    PrescriptionHistory: [],
  };
  componentDidMount() {
    this.GetLabels();
    this.GetPrescriptionHistory();
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
  GetPrescriptionHistory() {
    axios
      .get(
        Helper.getUrl() +
          "tcmPrescription?PrescriptionNo=" +
          localStorage.getItem("prescriptionNo")
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
              this.IteratePrescriptionAndAssignValues();
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  DataClear() {
    this.setState({
      prescriptionCode: "",
      staffCode: "",
      consultationFees: 0,
      drugsAmount: 0,
      massageAmount: 0,
      acupunctureAmount: 0,
      serviceAmount: 0,
      retailAmount: 0,
      grandTotal: 0,
      siteCode: "",
      PrescriptionHistory: [],
    });
  }
  calculateTotalAmount = (e) => {
    const totalAmount =
      eval(this.state.consultationFees) +
      eval(this.state.massageAmount) +
      eval(this.state.acupunctureAmount) +
      eval(this.state.serviceAmount) +
      eval(this.state.retailAmount) +
      eval(this.state.drugsAmount);
    this.setState({ grandTotal: totalAmount });
  };
  handleSubmit = (event) => {
    event.preventDefault();
  };
  IteratePrescriptionAndAssignValues() {
    const TotalDrugValue = this.state.PrescriptionHistory.filter(
      (res) => res.itemType === "DRUGS"
    ).reduce((sum, currentValue) => {
      return sum + currentValue.amount;
    }, 0);
    const TotalMassageValue = this.state.PrescriptionHistory.filter(
      (res) => res.itemType === "MASSAGE"
    ).reduce((sum, currentValue) => {
      return sum + currentValue.amount;
    }, 0);

    const TotalAcupunctureValue = this.state.PrescriptionHistory.filter(
      (res) => res.itemType === "ACUPUNCTURE"
    ).reduce((sum, currentValue) => {
      return sum + currentValue.amount;
    }, 0);

    const TotalRetailProductValue = this.state.PrescriptionHistory.filter(
      (res) => res.itemType === "RETAIL PRODUCT"
    ).reduce((sum, currentValue) => {
      return sum + currentValue.amount;
    }, 0);

    const TotalServiceValue = this.state.PrescriptionHistory.filter(
      (res) => res.itemType === "SERVICE"
    ).reduce((sum, currentValue) => {
      return sum + currentValue.amount;
    }, 0);

    this.setState(
      {
        drugsAmount: TotalDrugValue * this.state.prescriptiontotalDays,
        massageAmount: TotalMassageValue,
        acupunctureAmount: TotalAcupunctureValue,
        retailAmount: TotalRetailProductValue,
        serviceAmount: TotalServiceValue,
      },
      () => {
        this.calculateTotalAmount();
      }
    );
  }
  LoadPaymentValue = (drug, massage, acuputure, retail, service) => {
    const Days = this.state.prescriptiontotalDays;
    this.setState({});
    this.setState(
      {
        drugsAmount: drug * Days,
        massageAmount: massage,
        acupunctureAmount: acuputure,
        retailAmount: retail,
        serviceAmount: service,
      },
      () => {
        this.calculateTotalAmount();
      }
    );
  };
  handleSave = (event) => {
    if (this.state.grandTotal <= 0) {
      alert("Grand Total Should be greater than zero");
      return;
    }
    event.preventDefault();
    this.setState({ isLoading: true });
    axios
      .post(Helper.getUrl() + "tcmPostSalesHold", {
        prescriptionCode: localStorage.getItem("prescriptionNo"),
        staffCode: localStorage.getItem("staffCode"),
        drugsAmount: localStorage.getItem("drugsAmount"),
        massageAmount: this.state.massageAmount,
        acupunctureAmount: this.state.acupunctureAmount,
        serviceAmount: this.state.serviceAmount,
        retailAmount: this.state.retailAmount,
        consultationFee: this.state.consultationFees,
        grandTotal: this.state.grandTotal,
        siteCode: localStorage.getItem("siteCode"),
      })
      .then((result) => {
        if (result.data.success == "1") {
          alert(
            "Data Inserted Successfully " + JSON.stringify(result.data.result)
          );
          this.DataClear();
        } else {
          console.log(result.data.error);
          alert(result.data.error);
          this.DataClear();
        }
      })
      .catch((error) => {
        console.log(error);
        //this.setState({ authError : true, isLoading: false });
      });
  };
  render() {
    return (
      <div>
        <Header />
        <br />
        <h5 style={{ color: "red", textDecoration: "underline" }}>
          {"Name :" + localStorage.getItem("custName")}
        </h5>
        <br />
        <div>
          <form onSubmit={this.handleSubmit}>
            <div
              style={{
                border: "2px solid #73AD21",
                borderRadius: "25px",
                paddingLeft: "30px",
                paddingTop: "10px",
              }}
            >
              <div className="form-row">
                <div className="col-md-4">
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {"Staff Code: " + localStorage.getItem("staffCode")}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {"Prescription Code :" +
                            localStorage.getItem("prescriptionNo")}
                        </label>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label22
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          style={{ textAlign: "right" }}
                          className="form-control"
                          name="consultationFees"
                          value={this.state.consultationFees}
                          onChange={(e) =>
                            this.setState({
                              consultationFees: e.target.value,
                            })
                          }
                          onBlur={this.calculateTotalAmount}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label25
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          style={{ textAlign: "right" }}
                          className="form-control"
                          name="drugsAmount"
                          value={this.state.drugsAmount.toFixed(2)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label26
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          className="form-control"
                          style={{ textAlign: "right" }}
                          name="massageAmount"
                          value={this.state.massageAmount}
                          onChange={(e) =>
                            this.setState({
                              massageAmount: e.target.value,
                            })
                          }
                          onBlur={this.calculateTotalAmount}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label27
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          className="form-control"
                          style={{ textAlign: "right" }}
                          name="acupunctureAmount"
                          value={this.state.acupunctureAmount}
                          onChange={(e) =>
                            this.setState({
                              acupunctureAmount: e.target.value,
                            })
                          }
                          onBlur={this.calculateTotalAmount}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label28
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          className="form-control"
                          style={{ textAlign: "right" }}
                          name="serviceAmount"
                          value={this.state.serviceAmount}
                          onChange={(e) =>
                            this.setState({
                              serviceAmount: e.target.value,
                            })
                          }
                          onBlur={this.calculateTotalAmount}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label29
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          className="form-control"
                          style={{ textAlign: "right" }}
                          name="retailAmount"
                          value={this.state.retailAmount}
                          onChange={(e) =>
                            this.setState({
                              retailAmount: e.target.value,
                            })
                          }
                          onBlur={this.calculateTotalAmount}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label30
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <input
                          type="text"
                          style={{ textAlign: "right" }}
                          className="form-control"
                          name="grandTotal"
                          disabled
                          value={this.state.grandTotal.toFixed(2)}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-label-group"></div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-label-group">
                        <button
                          className="form-control  btn btn-success btn-block"
                          onClick={this.handleSave.bind()}
                        >
                          {this.state.LabelData.label21}
                        </button>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="form-row">
                    <div className="col-md-2">
                      <div className="form-label-group"></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <table
                    style={{
                      fontSize: "14px",
                    }}
                    className="table table-bordered"
                  >
                    <thead>
                      <tr>
                        <th>
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label15
                          )}
                        </th>
                        <th>
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label18
                          )}
                        </th>
                        <th>
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label8
                          )}
                        </th>
                        <th>
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label11
                          )}
                        </th>
                        <th>
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label5
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.PrescriptionHistory.map(
                        (prescription, index) => (
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
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
        <br />
        <Footer />
      </div>
    );
  }
}
// /https://stackoverflow.com/questions/49171107/how-to-add-and-remove-table-rows-dynamically-in-react-js
