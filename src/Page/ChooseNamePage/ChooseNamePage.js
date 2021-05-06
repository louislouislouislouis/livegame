import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../hooks/http-hook";
import { PlayerContext } from "../../context/playercontext";

import "./ChooseNamePage.css";
const ChooseNamePage = () => {
  //CUSTOM HTTP HOOK
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //GET PLAYER CONTEXT
  const playercontext = useContext(PlayerContext);

  //POSSIBLY NEXT PLAYERID
  const [name, setname] = useState("");

  //FEEDBACKFOR PLAYERID
  const [retour, setretour] = useState("Veuillez choisir un PlayerId");

  //FOCUS INPUT
  const [focus, setfocus] = useState(false);

  //VERIFY FEEDBACK FOR NAME EVERY TIME CHANGE
  useEffect(() => {
    const fonction = async () => {
      if (name) {
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/${name}/isExisting`
          );
          if (rep.msg === "Ok") {
            setretour("This username is available");
          }
        } catch (err) {
          setretour("Sorry this username is not available");
        }
      } else {
        setretour("");
      }
    };
    fonction();
  }, [name, sendRequest]);

  //CREATE A PAYERID
  const submithandler = (e) => {
    e.preventDefault();
    console.log(name);
    playercontext.login(name);
  };

  //CHANGE NAME VALUE ON CHANGE
  const changeHandler = (e) => {
    setname(e.target.value);
  };

  const settozero = () => {
    setfocus(true);
  };

  const backtostartingpoint = () => {
    console.log("ff");
    if (name === "") {
      setfocus(false);
    }
  };

  return (
    <React.Fragment>
      <div className="sectionplayer">
        <div className="title">
          <h1>Start by Choosing your Username</h1>
        </div>

        <form onSubmit={submithandler}>
          <input
            className={name ? "" : "tochange"}
            value={focus ? name : "Your Username here ..."}
            onChange={changeHandler}
            onFocus={settozero}
            onBlur={backtostartingpoint}
          />
          <div
            className={`retour ${
              retour === ""
                ? "none"
                : retour === "This username is available"
                ? "good"
                : "bad"
            }`}
          >
            {retour === "Sorry this username is not available" && (
              <div className={`exclamationmark ${retour === "" ? "none" : ""}`}>
                !
              </div>
            )}
            <p>{retour}</p>
          </div>
          <button
            disabled={retour !== "This username is available"}
            type="submit"
          >
            NEXT
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ChooseNamePage;
