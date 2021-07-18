import React from "react";

import ChooseNamePage from "./Page/ChooseNamePage/ChooseNamePage";
import Headers from "./Component/Shared/Header/Headers";
import { CSSTransition } from "react-transition-group";

import { usePlayer } from "./hooks/login-hook";
import { PlayerContext } from "./context/playercontext";

import "./App.css";
import ChoosePartyPage from "./Page/ChoosePartyPage/ChoosePartyPage";
import PartyManager from "./Page/PartyLanagerPage/PartyManager";
import SetCartPage from "./Page/SetCartPage/SetCartPage";

function App() {
  const { login, logout, PlayerId, PartyId, setParty, removeParty, PartyInfo } =
    usePlayer();

  return (
    <React.Fragment>
      <PlayerContext.Provider
        value={{
          isPlayerIn: !!PlayerId.playerId,
          login: login,
          logout: logout,
          PlayerId: PlayerId.playerId,
          PartyId: PartyId,
          setParty: setParty,
          removeParty: removeParty,
          PartyInfo: PartyInfo,
        }}
      >
        <Headers />
        <div className="monapp">
          {
            <React.Fragment>
              <CSSTransition
                in={!PlayerId.playerId}
                mountOnEnter
                unmountOnExit
                appear
                timeout={{
                  appear: 500,
                  enter: 500,
                  exit: 500,
                }}
                classNames="sectionplayer"
              >
                <ChooseNamePage />
              </CSSTransition>
              <CSSTransition
                in={!!PlayerId.playerId && !PartyId}
                mountOnEnter
                unmountOnExit
                timeout={{
                  appear: 500,
                  enter: 500,
                  exit: 500,
                }}
                classNames="pagecreateparty"
              >
                <ChoosePartyPage />
              </CSSTransition>
              <CSSTransition
                in={
                  !!PlayerId.playerId &&
                  !!PartyId &&
                  PartyInfo &&
                  PartyInfo.status === "nonbegin"
                }
                mountOnEnter
                unmountOnExit
                timeout={{
                  appear: 500,
                  enter: 500,
                  exit: 500,
                }}
                classNames="mainPartymanager"
              >
                <PartyManager />
              </CSSTransition>
              <CSSTransition
                in={PartyInfo && PartyInfo.status === "begin"}
                mountOnEnter
                unmountOnExit
                timeout={{
                  appear: 500,
                  enter: 500,
                  exit: 0,
                }}
                classNames="setcartpaty"
              >
                <SetCartPage />
              </CSSTransition>
              {PlayerId && <p>{`Bienvenue ! ${PlayerId.playerId}`}</p>}
              {PartyId && <p>{`Tu joue dans la partie ! ${PartyId}`}</p>}
            </React.Fragment>
          }
        </div>
      </PlayerContext.Provider>
    </React.Fragment>
  );
}

export default App;
