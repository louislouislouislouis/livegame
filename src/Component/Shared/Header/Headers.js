import React, { useContext } from "react";
import "./header.css";
import Logo from "../../../File/svg/gamepad.svg";
import { PlayerContext } from "../../../context/playercontext";
const Headers = () => {
  const playercontext = useContext(PlayerContext);
  const logoutHandler = () => {
    playercontext.logout();
  };
  return (
    <header className="headermain">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <ul className="headerList">
        <li>Menu</li>
        <li onClick={logoutHandler}>Login</li>
        <li>My game</li>
      </ul>
    </header>
  );
};

export default Headers;
