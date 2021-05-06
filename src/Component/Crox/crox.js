import React from "react";
import "./crox.css";
const Crox = (props) => {
  return (
    <div className={`eclipse ${props.vision}`} onClick={props.onclickaction}>
      <div className="batonprem" />
      <div className="batomdeux" />
    </div>
  );
};

export default Crox;
