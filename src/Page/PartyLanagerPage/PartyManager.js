import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { PlayerContext } from "../../context/playercontext";

import "./PartyManager.css";

const PartyManager = (props) => {
  //CUSTOM HTTP HOOK
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //AUTHCONTEXT
  const playercontext = useContext(PlayerContext);

  //STATE VAR
  const [isMaster, setMaster] = useState(false);
  const [nbcard, setnbcard] = useState(3);
  const [retour, setretour] = useState({
    message: "waitings for people",
    isValid: false,
  });

  //KNOWING IF A PLAYER IS MASTER/ AND IF WE CAN START THE PARTY
  useEffect(() => {
    //set Master
    const isMaster =
      playercontext.PartyInfo.participants.findIndex(
        (player) =>
          player.id === playercontext.PlayerId && player.role === "master"
      ) === -1
        ? false
        : true;
    setMaster(isMaster);

    //setretour
    if (playercontext.PartyInfo.participants.length > 1) {
      setretour({
        message: `${playercontext.PartyId} can start with ${
          playercontext.PartyInfo && playercontext.PartyInfo.participants.length
        } players!`,
        isValid: true,
      });
    } else {
      setretour({
        message: `You cannot start a party alone!`,
        isValid: false,
      });
    }
  }, [playercontext.PartyInfo, playercontext.PlayerId, playercontext.PartyId]);

  //HANDLERNUMBER
  const onclickoptionhandler = (e, number) => {
    setnbcard(number);
  };

  //SUBMITHANDLE
  const submithandler = async (e, number) => {
    e.preventDefault();
    console.log(retour);
    if (retour.isValid) {
      try {
        const rep = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/live/party/begin`,
          "POST",
          JSON.stringify({
            idParty: playercontext.PartyId,
            idPlayer: playercontext.PlayerId,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        if (rep.msg) {
        }
      } catch (err) {}
    } else {
      console.log("JE DOIS FAIRE UN ETAT SUR LE BOUTON");
    }
  };
  return (
    <div className="mainPartymanager">
      <div className="textheader">
        <h2>Bienvenue dans la partie</h2>
        <h1>{playercontext.PartyId}</h1>
      </div>
      <div className="maincard">
        <h3>Playerconnected</h3>
        <div className="listofplayer">
          {playercontext.PartyInfo.participants.map((player) => {
            if (player.status === "connected") {
              if (player.role === "master") {
                return (
                  <div key={player.id} className="playername master">
                    {player.id}
                    <img
                      src="https://image.flaticon.com/icons/png/512/891/891024.png"
                      alt="king"
                    />
                  </div>
                );
              } else {
                return (
                  <div key={player.id} className="playername slave">
                    {player.id}
                  </div>
                );
              }
            } else return "";
          })}
        </div>
        <div className="attente">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {isMaster && (
        <div className="bottompm">
          <h3>Number of cards</h3>
          <div className="secondcard">
            <div
              onClick={(e) => onclickoptionhandler(e, 3)}
              className={`option ${nbcard === 3 && "oselected"}`}
            >
              3
            </div>
            <div
              onClick={(e) => onclickoptionhandler(e, 4)}
              className={`option ${nbcard === 4 && "oselected"}`}
            >
              4
            </div>
            <div
              onClick={(e) => onclickoptionhandler(e, 5)}
              className={`option ${nbcard === 5 && "oselected"}`}
            >
              5
            </div>
          </div>
          <button disabled={!retour.isValid} onClick={submithandler}>
            GO!
          </button>
        </div>
      )}
      {!isMaster && (
        <div className="bottompm">
          <p>Waitings for the master of party to start</p>
        </div>
      )}
    </div>
  );
};

export default PartyManager;
