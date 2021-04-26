import React from "react";

import Live from "./Component/ConnectHome/livent";
import Headers from "./Component/Shared/Header/Headers";

import { usePlayer } from "./hooks/login-hook";
import { PlayerContext } from "./context/playercontext";

import "./App.css";

function App() {
  const { login, logout, PlayerId } = usePlayer();
  console.log(PlayerId);
  return (
    <React.Fragment>
      <PlayerContext.Provider
        value={{
          isPlayerIn: !!PlayerId,
          login: login,
          logout: logout,
          PlayerId: PlayerId,
        }}
      >
        <Headers />
        <div className="monapp">
          {
            <React.Fragment>
              {!PlayerId && <Live />}{" "}
              {PlayerId && <p>{`Bienvenue ! ${PlayerId}`}</p>}
            </React.Fragment>
          }
        </div>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

export default App;
