import React from "react";

import Live from "./Component/ConnectHome/livent";
import Headers from "./Component/Shared/Header/Headers";

import { useAuth } from "./hooks/login-hook";
import { PlayerContext } from "./context/playercontext";

import "./App.css";

function App() {
  const { login, logout, PlayerId } = useAuth();
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
        <div className="monapp">{!PlayerId && <Live />}</div>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

export default App;
