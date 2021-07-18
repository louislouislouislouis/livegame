import React, { useContext, useState } from "react";
import "./header.css";
import Crox from "../../Crox/crox";
import { PlayerContext } from "../../../context/playercontext";
const Headers = () => {
  const playercontext = useContext(PlayerContext);
  const logoutHandler = (e) => {
    e.stopPropagation();
    //logout also allow party deleter
    if (playercontext.PartyId) {
      playercontext.logout(playercontext.PlayerId, playercontext.PartyId);
    } else {
      playercontext.logout(playercontext.PlayerId);
    }

    changeModeHandler();
  };
  const [mode, setMode] = useState("reduc");

  const changeModeHandler = () => {
    if (mode === "reduc") {
      setMode("develop");
    } else {
      setMode("reduc");
    }
  };

  return (
    <header
      className={`headermain ${mode}`}
      onClick={mode === "reduc" ? changeModeHandler : null}
      onBlur={changeModeHandler}
    >
      <ul className="headerList">
        <li>Menu</li>
        <li onClick={logoutHandler}>
          {playercontext.isPlayerIn ? "Logout" : "Login"}
        </li>
        <li>My game</li>
        <Crox onclickaction={mode === "develop" ? changeModeHandler : null} />
      </ul>
    </header>
  );
};

export default Headers;
