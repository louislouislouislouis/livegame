import React, { useState, useEffect, useContext } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { PlayerContext } from "../../context/playercontext";
import Crox from "../../Component/Crox/crox";
import "./ChoosePartyPage.css";

const ChoosePartyPage = () => {
  //CUSTOM HTTP HOOK
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //AUTHCONTEXT
  const playercontext = useContext(PlayerContext);

  //MODE
  const [mode, setmode] = useState("home");
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

  const changemodeHandler = (e, mode) => {
    e.stopPropagation();
    console.log("eeee");
    setmode(mode);
  };
  console.log(mode);
  return (
    <div className="pagecreateparty">
      <div
        className={`cardparty ${mode === "createPartyMode" ? "active" : ""}`}
        onClick={(e) => changemodeHandler(e, "createPartyMode")}
      >
        <h1>Create a Party</h1>
        <Crox
          vision={`${
            mode === "createPartyMode" ? "activecrox" : "inactivecrox"
          }`}
          onclickaction={(e) => changemodeHandler(e, "home")}
        />
      </div>
      <div
        className={`ndcard ${mode === "joinPartyMode" ? "activescd" : ""}`}
        onClick={(e) => changemodeHandler(e, "joinPartyMode")}
      >
        <h1>Join A Party</h1>
        <Crox
          vision={`${mode === "joinPartyMode" ? "activecrox" : "inactivecrox"}`}
          onclickaction={(e) => changemodeHandler(e, "home")}
        />
      </div>
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
