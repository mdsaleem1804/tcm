import React from "react";
import { render } from "react-dom";

export default class PrescriptionNew extends React.Component {
  state = {
    rows: [{}],
  };
  handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value,
    };
    this.setState({
      rows,
    });
  };
  handleAddRow = () => {
    const item = {
      name: "",
      mobile: "",
    };
    this.setState({
      rows: [...this.state.rows, item],
    });
  };
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1),
    });
  };
  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
  };
  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleAddRow}>Add Row</button>
          <table>
            <thead>
              <tr>
                <th> # </th>
                <th> Name </th>
                <th> Mobile </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.rows.map((item, idx) => (
                <tr id="addr0" key={idx}>
                  <td>{idx}</td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={this.state.rows[idx].name}
                      onChange={this.handleChange(idx)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="mobile"
                      value={this.state.rows[idx].mobile}
                      onChange={this.handleChange(idx)}
                    />
                  </td>
                  <td>
                    <button onClick={this.handleRemoveSpecificRow(idx)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
