import React from "react";
function Footer() {
  return (
    <div
      style={{
        margin: "0 auto",
        width: "100%",
        height: "auto",
        overflow: "hidden",
        position: "relative",
        bottom: "0px",
      }}
    >
      <br />
      <br />
      <center>
        <h5 className="noselect" style={{ color: "lightgreen" }}>
          <img src={require("./logo_acy7lab.png")} width="80" height="60" />Ⓒ
          2020 ACY7LAB. All Rights Reserved.Singapore Co.Reg.No 201903700G
        </h5>
      </center>
    </div>
  );
}

export default Footer;
