import React from "react";

import ChooseNamePage from "./Page/ChooseNamePage/ChooseNamePage";
import Headers from "./Component/Shared/Header/Headers";
import { CSSTransition } from "react-transition-group";

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
              <CSSTransition
                in={!PlayerId}
                mountOnEnter
                unmountOnExit
                timeout={2000}
                classNames="pagecreateparty"
              >
                <ChooseNamePage />
              </CSSTransition>
              <CSSTransition
                in={!!PlayerId}
                mountOnEnter
                unmountOnExit
                timeout={2000}
                classNames="pagecreateparty"
              >
                <ChoosePartyPage />
              </CSSTransition>
              {PlayerId && <p>{`Bienvenue ! ${PlayerId}`}</p>}

              {PartyId && <p>{`Tu joue dans la partie ! ${PartyId}`}</p>}
            </React.Fragment>
          }
        </div>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

export default App;
