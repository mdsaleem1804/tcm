import React, { Component } from "react";
import "../../../node_modules/react-dropdown-tree-select/dist/styles.css";
import DeniReactTreeView from "deni-react-treeview";
import axios from "axios";
import Helper from "../../Common/Helper";
export default class PrescriptionEntry extends Component {
  state = {
    txtTimeToTake: "",
    txtWaysToTake: "",
    treeData: [],
    selectedTextBox: "",
  };
  componentDidMount() {
    this.GetTimeAndWaytoTakeMedicine("TimetoTakeMedicine", "");
  }
  GetTimeAndWaytoTakeMedicine(xType, xSearchKey) {
    this.setState({ treeData: [] });
    console.log("Load" + xType);
    axios
      .post(Helper.getUrl() + "tcmTimeWayMedicineSearch", {
        Type: xType,
        searchKey: xSearchKey,
      })
      .then((result) => {
        if (result.data.success) {
          const test = [];
          for (var i = 0; i < result.data.result.length; i++) {
            test.push({
              id: result.data.result[i].Id,
              text: result.data.result[i].English,
            });
          }
          this.setState({ treeData: test });
        }
        console.log(test);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const onSelectItemHandler = (item) =>
      this.setState({ value: this.state.value + "," + item.text });
    return (
      <div>
        <br />
        <div style={{ border: "ridge", padding: "10px" }}>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    e.target.value === ""
                      ? this.GetTimeAndWaytoTakeMedicine(
                          "TimetoTakeMedicine",
                          ""
                        )
                      : this.GetTimeAndWaytoTakeMedicine(
                          "TimetoTakeMedicine",
                          e.target.value
                        );
                  }}
                />
              </div>

              <br />
              <br />
              <div className="col-md-12">
                <DeniReactTreeView
                  style={{
                    marginRight: "10px",
                    marginBottom: "10px",
                    fontSize: "18px",
                    width: "100%",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                  items={this.state.treeData}
                  onSelectItem={onSelectItemHandler}
                  autoLoad={true}
                />
              </div>
            </div>
          </form>
        </div>
        <br />
      </div>
    );
  }
}
