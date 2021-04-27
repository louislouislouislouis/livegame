import { useState, useCallback, useEffect, useRef } from "react";
import { useHttpClient } from "../hooks/http-hook";

export const usePlayer = () => {
  //the two var shared everywhere
  const [PlayerId, setPlayerId] = useState(false);
  const [PartyId, setPartyId] = useState(false);

  //my msg
  const evtSrclive = useRef(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //logout
  const logout = useCallback(() => {
    setPlayerId(null);
    setPartyId(null);
    localStorage.removeItem("userData");
    if (evtSrclive.current) {
      evtSrclive.current.close();
    }
  }, []);

  //set a party
  const setParty = useCallback((partyId) => {
    //change the current value of context provider partyid
    setPartyId(partyId);
    //Stored the new data in the browser
    const storedData = JSON.parse(localStorage.getItem("userData"));
    storedData.PartyId = partyId;
    localStorage.setItem("userData", JSON.stringify(storedData));
  }, []);

  //remove party
  const removeParty = useCallback((partyId) => {
    //change the current value of context provider partyid
    setPartyId(null);

    //Remove the new data in the browser
    let storedData = JSON.parse(localStorage.getItem("userData"));
    delete storedData["PartyId"];
    localStorage.setItem("userData", JSON.stringify(storedData));
  }, []);

  //run to log
  const login = useCallback(
    async (pid) => {
      if (pid) {
        //Verifier que cet Id n'a pas été pris entre temps et se deconnecter dans le cas contraire
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/${pid}/isExisting`
          );

          if (rep.msg === "Ok") {
            evtSrclive.current = new EventSource(
              `${process.env.REACT_APP_BACKENDURL}/api/live/${pid}`
            );
            evtSrclive.current.addEventListener("count", (event) => {
              console.log(event.data);
            });
          }
        } catch (err) {
          logout();
        }

        //change the current value of context provider playerId
        setPlayerId(pid);

        //Stored the new data in the browser
        let newUserdata;
        newUserdata = JSON.parse(localStorage.getItem("userData"));
        if (newUserdata) {
          newUserdata.PlayerId = pid;
        } else newUserdata = { PlayerId: pid };
        localStorage.setItem("userData", JSON.stringify(newUserdata));

        //check if i have game
        autoverifypartycurrent(newUserdata);
      }
    },
    [sendRequest, logout]
  );

  //functiontocheck if player is playing
  const autoverifypartycurrent = useCallback(
    async (storedData) => {
      try {
        const rep = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/live/party/isPlaying`,
          "POST",
          JSON.stringify({
            playerId: storedData.PlayerId,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        if (rep.partyId) {
          setParty(rep.partyId);
        } else if (rep.partyId === false && storedData.PartyId) {
          removeParty();
        }
      } catch (err) {}
    },
    [removeParty, sendRequest, setParty]
  );

  //run when acces to website
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.PlayerId) {
      login(storedData.PlayerId);
    }
  }, [login, autoverifypartycurrent]);
  return { login, logout, PlayerId, PartyId, setParty, removeParty };
};
