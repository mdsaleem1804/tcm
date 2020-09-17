import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { Treebeard } from "react-treebeard";

export default class TreeExample extends PureComponent {
  constructor(props) {
    super(props);
    state = {
      data: {
        name: "root",
        toggled: true,
        children: [
          {
            name: "parent",
            children: [{ name: "child1" }, { name: "child2" }],
          },
          {
            name: "loading parent",
            loading: true,
            children: [],
          },
          {
            name: "parent",
            children: [
              {
                name: "nested parent",
                children: [
                  { name: "nested child 1" },
                  { name: "nested child 2" },
                ],
              },
            ],
          },
        ],
      },
    };
  }

  onToggle(node, toggled) {
    const { cursor, data } = this.state.data;
    if (cursor) {
      this.setState(() => ({ cursor, active: false }));
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState(() => ({ cursor: node, data: Object.assign({}, data) }));
  }

  render() {
    const { data } = this.state;
    return <Treebeard data={this.state.data} onToggle={this.onToggle} />;
  }
}
