import React, { Component } from "react";
import "../../../node_modules/react-dropdown-tree-select/dist/styles.css";
import DeniReactTreeView from "deni-react-treeview";
import axios from "axios";
import Helper from "../../Common/Helper";
import Header from "../Header";
import Footer from "../Footer";
import "./styles.css";
import dateFormat from "dateformat";
import Spinner from "../../Common/Spinner";
export default class PrescriptionEntry extends Component {
  state = {
    txtTimeToTake: "",
    txtWaysToTake: "",
    txtGeneralSuggestion: "",
    treeData: [],
    LabelData: [],
    selectedTextBox: "",
    language: "Chinese",
    categoryDescription: "",
    itemCode: "",
    itemName: "",
    itemType: "DRUGS",
    description: "",
    unitprice: "0",
    qty: "1",
    uom: "",
    unittime: "1",
    unittotal: "0",
    mediciationtime: "",
    serve: "",
    remarks: "",
    group: "",
    doctoradvice_reminder: "",
    rows: [],
    rowsForOthers: [],
    total_qty: "",
    total_days: "1",
    table_row_total_amount: 0,
    total_amount: 0,
    prescriptionHistory: [],
    isPrescriptionHistoryLoading: false,
    prescriptionSingleData: [],
    isPrescriptionSingleDataLoading: false,
    selectedPrescriptionSingleDataTotalDays: 0,
  };
  componentDidMount() {
    this.GetLabels();
    this.GetCustomerPrescriptionHistory();
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
  handleAddRow = () => {
    if (this.state.description == "") {
      alert("Please fill description");
    } else {
      const item = {
        id: "2", //to check
        categoryDescription:
          this.state.itemType == "DRUGS"
            ? this.state.categoryDescription
            : "OTHERS",
        description: this.state.description,
        unitprice: this.state.unitprice,
        qty: this.state.qty,
        uom: this.state.uom,
        unittime: this.state.unittime,
        unittotal: this.state.unittotal,
        mediciationtime: this.state.mediciationtime,
        serve: this.state.serve,
        remarks: this.state.remarks,
        group: this.state.group,
        itemCode: this.state.itemCode,
        itemName:
          this.state.itemType == "DRUGS"
            ? this.state.itemName
            : this.state.description,
        itemType: this.state.itemType,
      };
      this.state.itemType == "DRUGS"
        ? this.setState(
            {
              rows: [...this.state.rows, item],
            },
            () => {
              this.handleChangeForNoOfDays();
            }
          )
        : this.setState({
            rowsForOthers: [...this.state.rowsForOthers, item],
          });

      this.DataClear();
    }
  };

  DataFetch(fetchData) {
    this.setState(
      {
        rows: [],
        rowsForOthers: [],
        doctoradvice_reminder: fetchData[0].reminder,
        total_days: fetchData[0].totalDays,
      },
      () => {
        this.handleChangeForNoOfDays();
      }
    );
    for (var i = 0; i < fetchData[0].Items.length; i++) {
      console.log("item");

      const item = {
        id: "2", //to check
        categoryDescription:
          fetchData[0].Items[i].itemType == "DRUGS" ? "DRUGS" : "OTHERS",
        description: String(fetchData[0].Items[i].itemDesc),
        unitprice: fetchData[0].Items[i].unitPrice,
        qty: fetchData[0].Items[i].itemQty,
        uom: fetchData[0].Items[i].itemUOM,
        unittime: fetchData[0].Items[i].daysToTakeMedicine,
        unittotal: fetchData[0].Items[i].amount,
        mediciationtime: fetchData[0].Items[i].timeToTakeMedicine,
        serve: fetchData[0].Items[i].waysToTakeMedicine,
        remarks: fetchData[0].Items[i].remark,
        group: fetchData[0].Items[i].itemGroup,
        itemCode: fetchData[0].Items[i].itemCode,
        itemName:
          fetchData[0].Items[i].itemType == "DRUGS"
            ? fetchData[0].Items[i].itemDesc
            : fetchData[0].Items[i].itemDesc,
        itemType: fetchData[0].Items[i].itemType,
      };
      console.log("item" + JSON.stringify(item));
      fetchData[0].Items[i].itemType == "DRUGS"
        ? this.setState(
            {
              rows: [...this.state.rows, item],
            },
            () => {
              this.handleChangeForNoOfDays();
            }
          )
        : this.setState({
            rowsForOthers: [...this.state.rowsForOthers, item],
          });
    }
  }
  DataClear() {
    this.setState({
      categoryDescription: "",
      itemCode: "",
      itemName: "",
      itemType: "DRUGS",
      description: "",
      unitprice: "0",
      qty: "1",
      uom: "",
      unittime: "1",
      unittotal: "0",
      mediciationtime: "",
      serve: "",
      remarks: "",
      group: "",
      //total_qty: "",
      //total_days: "",
      //total_amount: 0,
      table_row_total_amount: 0,

      treeData: [],
    });
  }

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows }, () => {
      this.handleChangeForNoOfDays();
    });
  };
  handleRemoveSpecificRowForOthers = (idx) => () => {
    const rowsForOthers = [...this.state.rowsForOthers];
    rowsForOthers.splice(idx, 1);
    this.setState({ rowsForOthers });
  };
  handleEdit = (idx) => () => {
    console.log(this.state.rows[idx]);
    this.setState({
      categoryDescription: this.state.rows[idx].categoryDescription,
      description: this.state.rows[idx].description,
      unitprice: this.state.rows[idx].unitprice,
      qty: this.state.rows[idx].qty,
      uom: this.state.rows[idx].uom,
      unittime: this.state.rows[idx].unittime,
      unittotal: this.state.rows[idx].unittotal,
      mediciationtime: this.state.rows[idx].mediciationtime,
      serve: this.state.rows[idx].serve,
      remarks: this.state.rows[idx].remarks,
      group: this.state.rows[idx].group,
      itemCode: this.state.rows[idx].itemCode,
      itemName: this.state.rows[idx].itemName,
      itemType: this.state.rows[idx].itemType,
    });
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows }, () => {
      this.handleChangeForNoOfDays();
    });
  };
  handleEditForOthers = (idx) => () => {
    console.log(idx);
    this.setState({
      categoryDescription: this.state.rowsForOthers[idx].categoryDescription,
      description: this.state.rowsForOthers[idx].description,
      unitprice: this.state.rowsForOthers[idx].unitprice,
      qty: this.state.rowsForOthers[idx].qty,
      uom: this.state.rowsForOthers[idx].uom,
      unittime: this.state.rowsForOthers[idx].unittime,
      unittotal: this.state.rowsForOthers[idx].unittotal,
      mediciationtime: this.state.rowsForOthers[idx].mediciationtime,
      serve: this.state.rowsForOthers[idx].serve,
      remarks: this.state.rowsForOthers[idx].remarks,
      group: this.state.rowsForOthers[idx].group,
      itemCode: this.state.rowsForOthers[idx].itemCode,
      itemName: this.state.rowsForOthers[idx].itemName,
      itemType: this.state.rowsForOthers[idx].itemType,
    });
    const rowsForOthers = [...this.state.rowsForOthers];
    rowsForOthers.splice(idx, 1);
    this.setState({ rowsForOthers });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };
  handleSave = (event) => {
    if (this.state.total_days <= 0) {
      alert("please select days");
      return;
    }
    if (this.state.total_amount <= 0) {
      alert("Total Amount Should be greater than zero");
      return;
    }
    event.preventDefault();
    const Items = [];
    for (var i = 0; i < this.state.rows.length; i++) {
      Items.push({
        lineNo: "",
        itemCode: this.state.rows[i].itemCode,
        itemType: this.state.rows[i].itemType,
        itemName: this.state.rows[i].itemName,
        itemQty: this.state.rows[i].qty,
        unitPrice: this.state.rows[i].unitprice,
        amount: this.state.rows[i].unittotal,
        daysToTakeMedicine: this.state.rows[i].unittime,
        timeToTakeMedicine: this.state.rows[i].mediciationtime,
        waysToTakeMedicine: this.state.rows[i].serve,
        reminder: "",
        isActive: "1",
        remark: this.state.rows[i].remarks,
        itemGroup: this.state.rows[i].group,
      });
    }
    for (var i = 0; i < this.state.rowsForOthers.length; i++) {
      Items.push({
        lineNo: "",
        itemCode: this.state.rowsForOthers[i].itemCode,
        itemType: this.state.rowsForOthers[i].itemType,
        itemName: this.state.rowsForOthers[i].itemName,
        itemQty: this.state.rowsForOthers[i].qty,
        unitPrice: this.state.rowsForOthers[i].unitprice,
        amount: this.state.rowsForOthers[i].unittotal,
        daysToTakeMedicine: this.state.rowsForOthers[i].unittime,
        timeToTakeMedicine: this.state.rowsForOthers[i].mediciationtime,
        waysToTakeMedicine: this.state.rowsForOthers[i].serve,
        reminder: "",
        isActive: "1",
        remark: this.state.rowsForOthers[i].remarks,
        itemGroup: this.state.rowsForOthers[i].group,
      });
    }

    const TotalOtherthanDrugValue = this.state.rowsForOthers.reduce(
      (sum, currentValue) => {
        return sum + eval(currentValue.unittotal);
      },
      0
    );

    /*console.log("TotalOtherthanDrugValue" + TotalOtherthanDrugValue);
    console.log("TotalDrugValue" + this.state.total_amount);
    console.log(
      "TotalValue" + eval(TotalOtherthanDrugValue + this.state.total_amount)
    );*/

    this.setState({ isLoading: true });
    // console.log("Items :" + JSON.stringify(Items));
    axios
      .post(Helper.getUrl() + "tcmPrescription", {
        prescriptionNo: "",
        prescriptionDate: dateFormat(Helper.getCurrentDate(), "yyyy-mm-dd"),
        diagnoseNo: localStorage.getItem("diagnoseNo"),
        custCode: localStorage.getItem("custCode"),
        custName: localStorage.getItem("custName"),
        staffCode: localStorage.getItem("staffCode"),
        staffName: localStorage.getItem("fullName"),
        totalAmount: eval(TotalOtherthanDrugValue + this.state.total_amount),
        totalQty: this.state.total_qty,
        totalDays: this.state.total_days,
        siteCode: localStorage.getItem("siteCode"),
        reminder: this.state.doctoradvice_reminder,
        Items: Items,
      })
      .then((result) => {
        if (result.data.success == "1") {
          const prescriptionNo = result.data.result;
          alert("patient prescription is saved " + prescriptionNo);
          //localStorage.setItem("rcptItems", Items);
          localStorage.setItem("prescriptionNo", prescriptionNo);
          localStorage.setItem("drugsAmount", this.state.total_amount);
          this.DataClear();
          this.props.history.push({
            pathname: "/PaymentEntry",
          });
          this.setState({ rows: [] });
          this.setState({ rowsForOthers: [] });
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
  handleWaystoTakeMedicineClick() {
    this.setState({ selectedTextBox: "serve" });
    this.GetTimeAndWaytoTakeMedicine("WaystoTakeMedicine", "");
  }
  handletcmReminderSearch() {
    this.setState({ selectedTextBox: "doctoradvice_reminder" });
    this.setState({ treeData: [] });
    axios
      .post(Helper.getUrl() + "tcmReminderSearch", { searchKey: "" })
      .then((result) => {
        console.log("hello" + result.data.result);
        if (result.data.success === "1") {
          const test = [];
          for (var i = 0; i < result.data.result.length; i++) {
            {
              test.push({
                id: result.data.result[i].Id,
                text: result.data.result[i].Chinese,
              });
            }

            this.setState({ treeData: test });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleDescription() {
    this.setState({ selectedTextBox: "description" });
    this.GetItemDetails("");
  }
  handleTimetoTakeMedicineClick() {
    this.setState({ selectedTextBox: "mediciationtime" });
    this.GetTimeAndWaytoTakeMedicine("TimetoTakeMedicine", "");
  }
  handleChangeForUnitTotal = (e) => {
    const f_qty = this.state.qty;
    const f_unitprice = this.state.unitprice;
    const f_unittime = this.state.unittime;
    const f_total_unit_price =
      eval(f_unittime) * eval(f_qty) * eval(f_unitprice);
    this.setState({ unittotal: f_total_unit_price.toFixed(2) });
  };

  handleChangeForNoOfDays = () => {
    const totalQtyForDrugs = this.state.rows.reduce(
      (qty, rows) => qty + eval(rows.qty) * eval(rows.unittime),
      0
    );

    const totalUnitTotalForDrugs = this.state.rows.reduce(
      (unittotal, rows) => unittotal + eval(rows.unittotal),
      0
    );

    this.setState({
      total_qty: this.state.total_days * totalQtyForDrugs,
      total_amount: this.state.total_days * totalUnitTotalForDrugs,
    });
  };
  GetItemDetails(xItemDesc) {
    this.setState({ treeData: [] });
    axios
      .post(Helper.getUrl() + "tcmProductList", {
        category: "",
        subCategory: "",
        itemDesc: xItemDesc,
        itemType: this.state.itemType,
      })
      .then((result) => {
        if (result.data.success) {
          this.setState({
            treeData: result.data.result,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetTimeAndWaytoTakeMedicine(xType, xSearchKey) {
    this.setState({ treeData: [] });
    axios
      .post(Helper.getUrl() + "tcmTimeWayMedicineSearch", {
        Type: xType,
        searchKey: xSearchKey,
      })
      .then((result) => {
        if (result.data.success) {
          const test = [];
          for (var i = 0; i < result.data.result.length; i++) {
            {
              test.push({
                id: result.data.result[i].Id,
                text: result.data.result[i].Chinese,
              });
            }

            this.setState({ treeData: test });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetCustomerPrescriptionHistory() {
    const custCode = localStorage.getItem("custCode");
    this.setState({ isPrescriptionHistoryLoading: true });
    console.log("custCode" + custCode);
    //console.log("custname" + localStorage.getItem("custName"));
    axios
      .get(Helper.getUrl() + "tcmPrescriptionList?custCode=" + custCode)
      .then((result) => {
        if (result.data.success == "1") {
          const data = result.data.result;
          this.setState({
            prescriptionHistory: data,
            isPrescriptionHistoryLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  DeleteprescriptionHistory(xPrescriptionNo) {
    axios
      .put(
        Helper.getUrl() + "tcmPrescription?PrescriptionNo=" + xPrescriptionNo
      )
      .then((result) => {
        if (result.data.success === "1") {
          alert(result.data.result);
          this.GetCustomerPrescriptionHistory();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GoToReceipt(xPrescriptionNo) {
    localStorage.setItem("rcptPrescriptionNo", xPrescriptionNo);
    this.props.history.push({
      pathname: "/ReceiptPreview",
    });
  }
  GetCustomerPrescriptionSingleData(xPrescriptionNo) {
    // this.setState({ isPrescriptionSingleDataLoading: true });
    axios
      .get(
        Helper.getUrl() + "tcmPrescription?PrescriptionNo=" + xPrescriptionNo
      )
      .then((result) => {
        if (result.data.success == "1") {
          const data = result.data.result;

          const selectedPrescriptionSingleDataTotalDays =
            result.data.result[0].totalDays;
          this.DataFetch(data);
          /*this.setState({
            prescriptionSingleData: data,
            isPrescriptionSingleDataLoading: false,
            selectedPrescriptionSingleDataTotalDays: selectedPrescriptionSingleDataTotalDays,
          });*/
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const onSearchChangeHandler = (e) => {
      if (this.state.selectedTextBox === "mediciationtime") {
        this.GetTimeAndWaytoTakeMedicine("TimetoTakeMedicine", e.target.value);
      } else if (this.state.selectedTextBox === "serve") {
        this.GetTimeAndWaytoTakeMedicine("WaystoTakeMedicine", e.target.value);
      } else if (this.state.selectedTextBox === "description") {
        this.GetItemDetails(e.target.value);
      }
    };

    const onSelectItemHandler = (item) => {
      {
        if (this.state.selectedTextBox === "description") {
          this.setState(
            {
              description: item.text,
              unitprice: item.itemPrice,
              uom: item.itemUOM,
              categoryDescription: item.categoryDescription,
              itemCode: item.id,
              itemName: item.itemName,
            },
            () => {
              this.handleChangeForUnitTotal();
            }
          );
        } else if (this.state.selectedTextBox === "mediciationtime") {
          this.setState({
            mediciationtime:
              this.state.mediciationtime.length >= 1
                ? this.state.mediciationtime + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "serve") {
          this.setState({
            serve:
              this.state.serve.length >= 1
                ? this.state.serve + "," + item.text
                : item.text,
          });
        } else if (this.state.selectedTextBox === "doctoradvice_reminder") {
          this.setState({
            doctoradvice_reminder:
              this.state.doctoradvice_reminder.length >= 1
                ? this.state.doctoradvice_reminder + "," + item.text
                : item.text,
          });
        }
      }
    };

    const totalQtyForDrugs = this.state.rows.reduce(
      (qty, rows) => qty + eval(rows.qty) * eval(rows.unittime),
      0
    );

    const totalQtyForOthers = this.state.rowsForOthers.reduce(
      (qty, rows) => qty + eval(rows.qty),
      0
    );

    const totalUnitTotalForDrugs = this.state.rows.reduce(
      (unittotal, rows) => unittotal + eval(rows.unittotal),
      0
    );
    const totalUnitTotalForOthers = this.state.rowsForOthers.reduce(
      (unittotal, rows) => unittotal + eval(rows.unittotal),
      0
    );

    return (
      <div>
        <Header />
        <br />
        <h5 style={{ color: "red", textDecoration: "underline" }}>
          {this.state.LabelData.label48 +
            "  " +
            localStorage.getItem("custName")}
        </h5>
        <br />
        <div>
          <form onSubmit={this.handleSubmit}>
            <div
              className="form-row"
              style={{
                border: "2px solid #73AD21",
                borderRadius: "25px",
                padding: "10px",
              }}
            >
              <div className="col-md-12">
                <h5>Prescription History</h5>
              </div>
              {this.state.isPrescriptionHistoryLoading ? (
                <div className="col-md-12">
                  <Spinner />{" "}
                </div>
              ) : (
                <div className="col-md-12">
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "scroll",
                    }}
                  >
                    <table
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                      className="table  table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th>{this.state.LabelData.label40}</th>
                          <th>{this.state.LabelData.label54}</th>
                          <th align="right">{this.state.LabelData.label99}</th>
                          <th align="right">{this.state.LabelData.label115}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.prescriptionHistory.map(
                          (customer, index) => (
                            <tr key={customer.prescriptionNo}>
                              <td>{customer.prescriptionNo}</td>
                              <td>
                                {dateFormat(
                                  customer.prescriptionDate,
                                  "dd/mmm/yyyy"
                                )}
                              </td>
                              <td align="right">{customer.totalAmount}</td>
                              <td align="right">{customer.totalDays}</td>
                              <td width="80">
                                <img
                                  style={{ paddingRight: "30px" }}
                                  src={require("../../assets/down-arrow.png")}
                                  width="100"
                                  height="40"
                                  onClick={this.GetCustomerPrescriptionSingleData.bind(
                                    this,
                                    customer.prescriptionNo
                                  )}
                                />
                              </td>
                              <td width="80">
                                <img
                                  style={{ paddingRight: "30px" }}
                                  src={require("../../assets/receipt.png")}
                                  width="80"
                                  height="40"
                                  onClick={this.GoToReceipt.bind(
                                    this,
                                    customer.prescriptionNo
                                  )}
                                />
                              </td>
                              <td width="80">
                                <img
                                  style={{ paddingRight: "30px" }}
                                  src={require("../../assets/delete.png")}
                                  width="80"
                                  height="40"
                                  onClick={this.DeleteprescriptionHistory.bind(
                                    this,
                                    customer.prescriptionNo
                                  )}
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <br />

            <div className="form-row">
              <div className="col-md-9">
                <div className="form-row">
                  <div className="col-md-2">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(this.state.LabelData.label5)}
                      </label>
                      <select
                        className="form-control"
                        name="itemtype"
                        value={this.state.itemType}
                        onChange={(e) =>
                          this.setState({
                            itemType: e.target.value,
                            itemName: e.target.value,
                          })
                        }
                      >
                        <option value="DRUGS">DRUGS</option>
                        <option value="MASSAGE">MASSAGE</option>
                        <option value="ACUPUNCTURE">ACUPUNCTURE</option>
                        <option value="RETAIL PRODUCT">RETAIL PRODUCT</option>
                        <option value="SERVICE">SERVICE</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(this.state.LabelData.label7)}
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={this.state.description}
                        onClick={this.handleDescription.bind(this)}
                        onFocus={this.handleDescription.bind(this)}
                        onChange={(e) =>
                          this.setState({
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-1">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(this.state.LabelData.label18)}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="unitprice"
                        value={this.state.unitprice}
                        onBlur={this.handleChangeForUnitTotal}
                        onChange={(e) =>
                          this.setState(
                            {
                              unitprice: e.target.value,
                            },
                            () => {
                              this.handleChangeForUnitTotal();
                            }
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-1">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(this.state.LabelData.label8)}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="qty"
                        size="5"
                        value={this.state.qty}
                        onBlur={this.handleChangeForUnitTotal}
                        onChange={(e) =>
                          this.setState(
                            {
                              qty: e.target.value,
                            },
                            () => {
                              this.handleChangeForUnitTotal();
                            }
                          )
                        }
                      />
                    </div>
                  </div>

                  {this.state.itemType == "DRUGS" ? (
                    <div className="col-md-1">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label9
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="uom"
                          size="5"
                          value={this.state.uom}
                          onChange={(e) =>
                            this.setState({
                              uom: e.target.value,
                            })
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {this.state.itemType == "DRUGS" ? (
                    <div className="col-md-1">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label10
                          )}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="unittime"
                          size="5"
                          value={this.state.unittime}
                          onBlur={this.handleChangeForUnitTotal}
                          onChange={(e) =>
                            this.setState(
                              {
                                unittime: e.target.value,
                              },
                              () => {
                                this.handleChangeForUnitTotal();
                              }
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div className="col-md-1">
                    <div className="form-label-group">
                      <label htmlFor="inputName">
                        {Helper.changeLabelFormat(this.state.LabelData.label11)}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="unittotal"
                        size="5"
                        value={this.state.unittotal}
                        onChange={(e) =>
                          this.setState({
                            unittotal: e.target.value,
                          })
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  {this.state.itemType == "DRUGS" ? (
                    <div className="col-md-1">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label12
                          )}
                        </label>
                        <select
                          className="form-control"
                          name="group"
                          value={this.state.group}
                          onChange={(e) =>
                            this.setState({
                              group: e.target.value,
                            })
                          }
                        >
                          <option value=""></option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {this.state.itemType == "DRUGS" ? (
                    <div className="col-md-3">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label169
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="remarks"
                          value={this.state.remarks}
                          onChange={(e) =>
                            this.setState({
                              remarks: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {this.state.itemType == "DRUGS" ? (
                    <div className="col-md-4">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label116
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="mediciationtime"
                          value={this.state.mediciationtime}
                          onClick={this.handleTimetoTakeMedicineClick.bind(
                            this
                          )}
                          onFocus={this.handleTimetoTakeMedicineClick.bind(
                            this
                          )}
                          onChange={(e) =>
                            this.setState({
                              mediciationtime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {this.state.itemType == "DRUGS" ? (
                    <div className="col-md-4">
                      <div className="form-label-group">
                        <label htmlFor="inputName">
                          {Helper.changeLabelFormat(
                            this.state.LabelData.label117
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="serve"
                          value={this.state.serve}
                          onClick={this.handleWaystoTakeMedicineClick.bind(
                            this
                          )}
                          onFocus={this.handleWaystoTakeMedicineClick.bind(
                            this
                          )}
                          onChange={(e) =>
                            this.setState({
                              serve: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="col-md-1">
                    <div className="form-label-group">
                      <label htmlFor="inputName"></label>
                      <br />
                      <img
                        src={require("../../assets/add.png")}
                        width="100"
                        height="80"
                        onClick={this.handleAddRow.bind()}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <br />
                    <div>
                      <table border="1" width="100%">
                        <thead
                          style={{
                            backgroundColor: "lightgreen",
                            color: "black",
                          }}
                        >
                          <tr>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label13
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label15
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label98
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label9
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label8
                              )}
                            </th>

                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label10
                              )}
                            </th>
                            <th>
                              Total
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label8
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label99
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label12
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label116
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label117
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label169
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.rows.map((item, idx) => (
                            <tr id="addr0" key={idx}>
                              <td>{idx + 1}</td>
                              <td className="word-wrap">{item.description}</td>
                              <td align="right">{item.unitprice}</td>
                              <td>{item.uom}</td>
                              <td align="right">{item.qty}</td>

                              <td align="right">{item.unittime}</td>
                              <td align="right">{item.qty * item.unittime}</td>
                              <td align="right">{item.unittotal}</td>
                              <td className="word-wrap">{item.group}</td>
                              <td className="word-wrap">
                                {item.mediciationtime}
                              </td>
                              <td className="word-wrap">{item.serve}</td>

                              <td className="word-wrap">{item.remarks}</td>

                              <td>
                                <img
                                  src={require("../../assets/edit.png")}
                                  width="20"
                                  height="20"
                                  onClick={this.handleEdit(idx)}
                                />
                              </td>

                              <td>
                                <img
                                  src={require("../../assets/delete.png")}
                                  width="20"
                                  height="20"
                                  onClick={this.handleRemoveSpecificRow(idx)}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="6" align="right">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label185
                              )}
                            </td>
                            <td align="right">{totalQtyForDrugs}</td>

                            <td align="right">
                              {totalUnitTotalForDrugs.toFixed(2)}
                            </td>
                            <td></td>
                            <td></td>
                            <td colSpan="2"></td>
                          </tr>
                          <tr>
                            <td colSpan="5" align="right">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label188
                              )}
                            </td>
                            <td>
                              <select
                                className="form-control"
                                name="days_selection"
                                value={this.state.total_days}
                                onChange={(e) =>
                                  this.setState(
                                    {
                                      total_days: e.target.value,
                                    },
                                    () => {
                                      this.handleChangeForNoOfDays();
                                    }
                                  )
                                }
                              >
                                <option value="0">Please Select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                              </select>
                            </td>
                            <td align="right">{this.state.total_qty}</td>
                            <td align="right">
                              {this.state.total_amount.toFixed(2)}
                            </td>
                            <td colSpan="4"></td>
                          </tr>
                          <tr>
                            <td colSpan="5" align="right">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label187
                              )}
                            </td>
                            <td colSpan="3">
                              <input
                                type="text"
                                className="form-control"
                                name="doctoradvice_reminder"
                                value={this.state.doctoradvice_reminder}
                                onClick={this.handletcmReminderSearch.bind(
                                  this
                                )}
                                onFocus={this.handletcmReminderSearch.bind(
                                  this
                                )}
                                onChange={(e) =>
                                  this.setState({
                                    doctoradvice_reminder: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <br />
                      <br />
                      <table border="1" style={{ width: "100%" }}>
                        <thead style={{ backgroundColor: "yellow" }}>
                          <tr>
                            <th style={{ width: "100px" }}>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label13
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label15
                              )}
                            </th>
                            <th>
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label98
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
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.rowsForOthers.map((item, idx) => (
                            <tr id="addr0" key={idx}>
                              <td>{idx + 1}</td>
                              <td className="word-wrap">{item.description}</td>
                              <td align="right">{item.unitprice}</td>
                              <td align="right">{item.qty}</td>

                              <td align="right">{item.unittotal}</td>

                              <td style={{ width: "20px" }}>
                                <img
                                  src={require("../../assets/edit.png")}
                                  width="20"
                                  height="20"
                                  onClick={this.handleEditForOthers(idx)}
                                />
                              </td>

                              <td>
                                <img
                                  src={require("../../assets/delete.png")}
                                  width="20"
                                  height="20"
                                  onClick={this.handleRemoveSpecificRowForOthers(
                                    idx
                                  )}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" align="right">
                              {Helper.changeLabelFormat(
                                this.state.LabelData.label186
                              )}
                            </td>
                            <td align="right">{totalQtyForOthers}</td>
                            <td align="right">
                              {totalUnitTotalForOthers.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="form-row">
                      <div className="col-md-6"></div>

                      <div className="col-md-10"></div>
                      <div className="col-md-2">
                        <div className="form-label-group">
                          <label htmlFor="inputName"></label>
                          <button
                            className="form-control  btn btn-success btn-block"
                            onClick={this.handleSave.bind()}
                          >
                            {this.state.LabelData.label21}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
          </form>
        </div>
        <br /> <br />
        <Footer />
      </div>
    );
  }
}
// /https://stackoverflow.com/questions/49171107/how-to-add-and-remove-table-rows-dynamically-in-react-js
