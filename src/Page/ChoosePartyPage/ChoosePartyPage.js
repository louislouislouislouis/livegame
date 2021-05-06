import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { PlayerContext } from "../../context/playercontext";

import "./ChoosePartyPage.css";

const ChoosePartyPage = () => {
  //CUSTOM HTTP HOOK
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const playercontext = useContext(PlayerContext);

  //NAME OF THE PARTY
  const [partyName, setpartyName] = useState("");
  //NAME OF THE RETOUR
  const [retour, setRetour] = useState("Veuillez choisir un nom de partie");

  //VERIFY FEEDBACK FOR NAME EVERY TIME CHANGE
  useEffect(() => {
    const fonction = async () => {
      if (partyName) {
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/party/${partyName}/isExisting`
          );
          if (rep.msg === "Ok") {
            setRetour("Ce nom est op");
          }
        } catch (err) {
          setRetour("Ce nom n'est pas op");
        }
      } else {
        setRetour("Veuillez choisir un nom de partie");
      }
    };
    fonction();
  }, [partyName, sendRequest]);
  //CHANGE PARTY NAME VALUE ON CHANGE
  const changeHandler = (e) => {
    setpartyName(e.target.value);
  };

  //CHANGE PARTY NAME VALUE ON CHANGE
  const submithandler = async (e) => {
    e.preventDefault();
    console.log(partyName);
    try {
      const rep = await sendRequest(
        `${process.env.REACT_APP_BACKENDURL}/api/live/party/create`,
        "POST",
        JSON.stringify({
          idParty: partyName,
          idPlayer: playercontext.PlayerId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      if (rep.msg === "Ok") {
        playercontext.setParty(partyName);
      }
    } catch (err) {}
  };
  return (
    <div className="partyCreatordiv">
      <form onSubmit={submithandler}>
        <input value={partyName} onChange={changeHandler} />
        <button type="submit"> SEND</button>
      </form>
      <div className="retour">
        <p>{retour}</p>
      </div>
    </div>
  );
};

export default ChoosePartyPage;
