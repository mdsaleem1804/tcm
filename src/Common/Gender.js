import React from "react";

class Gender extends React.Component {
  constructor() {
    super();
  }

  render() {
    let genders = this.props.state.genders;
    let optionItems = genders.map((gender) => (
      <option key={gender.name}>{gender.name}</option>
    ));

    return (
      <div>
        <select>{optionItems}</select>
      </div>
    );
  }
}

export default Gender;
