import React, { Component } from "react";
import Header from "../pages/Header";
export default class Settings extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="form-row">
          <div className="col-md-2">
            <div className="form-label-group">
              <label htmlFor="inputName">Choose Page Size</label>
              <select
                className="form-control"
                name="itemtype"
                onChange={(e) =>
                  localStorage.setItem("pageSize", e.target.value)
                }
              >
                <option value="">Please Select</option>
                <option value="A4">A4</option>
                <option value="A5">A5</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
