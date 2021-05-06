import React from "react";

import ChooseNamePage from "./Page/ChooseNamePage/ChooseNamePage";
import Headers from "./Component/Shared/Header/Headers";

import { usePlayer } from "./hooks/login-hook";
import { PlayerContext } from "./context/playercontext";

import "./App.css";
import ChoosePartyPage from "./Page/ChoosePartyPage/ChoosePartyPage";

function App() {
  const {
    login,
    logout,
    PlayerId,
    PartyId,
    setParty,
    removeParty,
  } = usePlayer();
  return (
    <React.Fragment>
      <PlayerContext.Provider
        value={{
          isPlayerIn: !!PlayerId,
          login: login,
          logout: logout,
          PlayerId: PlayerId,
          PartyId: PartyId,
          setParty: setParty,
          removeParty: removeParty,
        }}
      >
        <Headers />
        <div className="monapp">
          {
            <React.Fragment>
              {!PlayerId && <ChooseNamePage />}
              {PlayerId && <p>{`Bienvenue ! ${PlayerId}`}</p>}
              {PlayerId && !PartyId && <ChoosePartyPage />}
              {PartyId && <p>{`Tu joue dans la partie ! ${PartyId}`}</p>}
            </React.Fragment>
          }
        </div>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

export default App;
