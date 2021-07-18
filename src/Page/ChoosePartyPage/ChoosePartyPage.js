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
  const [retour, setRetour] = useState({
    isValid: false,
    message: "Veuillez choisir un nom de partie",
  });
  //FOCUS INPUT
  const [focus, setfocus] = useState(false);

  //VERIFY FEEDBACK FOR NAME EVERY TIME CHANGE
  useEffect(() => {
    const fonction = async () => {
      if (partyName) {
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/party/${partyName}/isExisting`
          );
          if (rep.msg === "Ok" && mode === "createPartyMode") {
            setRetour({ isValid: true, message: "Ce nom est op" });
          } else if (rep.msg === "Ok" && mode === "joinPartyMode") {
            setRetour({ isValid: false, message: "Ce nom n'existe pas" });
          }
        } catch (err) {
          if (
            err.message === "This party is existing" &&
            mode === "joinPartyMode"
          ) {
            setRetour({ isValid: true, message: "Cette partie vous attends!" });
          } else {
            setRetour({
              isValid: false,
              message: "Cette partie a déja commencé!",
            });
          }
        }
      } else {
        setRetour({
          isValid: false,
          message: "Veuillez choisir un nom de partie",
        });
      }
    };
    fonction();
  }, [partyName, sendRequest, mode]);
  //CHANGE PARTY NAME VALUE ON CHANGE
  const changeHandler = (e) => {
    setpartyName(e.target.value);
  };
  //CREATE A PARTY
  const submithandler = async (e) => {
    e.preventDefault();
    if (retour.isValid) {
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
    } else {
      console.log("JE DOIS FAIRE UN ETAT SUR LE BOUTON");
    }
  };
  //JOIN A PARTY
  const submithandlerjoin = async (e) => {
    e.preventDefault();
    if (retour.isValid) {
      console.log("eeefzefz");
      try {
        const rep = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/live/party/join`,
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
    } else {
      console.log("JE DOIS FAIRE UN ETAT SUR LE BOUTON");
    }
  };

  const changemodeHandler = (e, mode) => {
    e.stopPropagation();
    setmode(mode);
  };
  const backtostartingpoint = () => {
    if (partyName === "") {
      setfocus(false);
    }
  };
  const settozero = () => {
    setfocus(true);
  };

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

        <form
          onSubmit={submithandler}
          className={`${mode === "createPartyMode" ? "appear" : "hidden"}`}
        >
          <input
            className={partyName ? "" : "tochange"}
            value={focus ? partyName : "PartyId to create ..."}
            onChange={changeHandler}
            onFocus={settozero}
            onBlur={backtostartingpoint}
          />
          <div className="retourcard">
            <p>{retour.message}</p>
          </div>
          <button disabled={!retour.isValid} type="submit">
            GO
          </button>
        </form>
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

        <form
          onSubmit={submithandlerjoin}
          className={`${mode === "joinPartyMode" ? "appear" : "hidden"}`}
        >
          <input
            className={partyName ? "" : "tochange"}
            value={focus ? partyName : "PartyId to join ..."}
            onChange={changeHandler}
            onFocus={settozero}
            onBlur={backtostartingpoint}
          />
          <div className="retourcard">
            <p>{retour.message}</p>
          </div>
          <button disabled={!retour.isValid} type="submit">
            GO
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChoosePartyPage;
