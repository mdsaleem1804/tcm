import React, { Component } from "react";
import TreeMenu from "react-simple-tree-menu";
// import default minimal styling or your own styling
import "react-simple-tree-menu/dist/main.css";
import Helper from "./Helper";
import axios from "axios";
export default class Spinner extends Component {
  state = {
    listDiseases: [],
  };
  componentDidMount() {
    this.SearchDiseases();
  }
  SearchDiseases() {
    axios
      .post(Helper.getUrl() + "tcmDiseaseSearch", {
        category: "",
        ItemName: "",
      })
      .then((result) => {
        if (result.data.success) {
          this.setState({ listDiseases: result.data.result });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  SearchAllergic() {
    axios
      .post(Helper.getUrl() + "tcmAllergicSearch", {
        category: "",
        ItemName: "",
      })
      .then((result) => {
        if (result.data.success) {
          this.setState({ listDiseases: result.data.result });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const treeData = [];
    for (var i = 0; i < this.state.listDiseases.length; i++) {
      treeData.push({
        key: "first-level-node-" + [i],
        label: this.state.listDiseases[i].category,
        nodes: [
          {
            key: "second-level-node-" + [i],
            label: this.state.listDiseases[i].subCategory,
            nodes: [
              {
                key: "third-level-node-" + [i],
                label: this.state.listDiseases[i].itemName,
              },
            ],
          },
        ],
      });
    }

    return (
      <div>
        <TreeMenu data={treeData} />

        <TreeMenu
          data={treeData}
          onClickItem={({ key, label, ...props }) => {
            this.navigate(props.url); // user defined prop
          }}
          initialActiveKey="first-level-node-1/second-level-node-1" // the path to the active node
          debounceTime={125}
        >
          {({ search, items }) => <></>}
        </TreeMenu>
      </div>
    );
  }
}
