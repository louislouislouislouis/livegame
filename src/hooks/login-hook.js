import { useState, useCallback, useEffect, useRef } from "react";
import { useHttpClient } from "../hooks/http-hook";

export const usePlayer = () => {
  //the var shared everywhere
  const [PlayerId, setPlayerId] = useState({ auto: null, playerId: false });
  const [PartyId, setPartyId] = useState(false);
  const [PartyInfo, setPartyInfo] = useState({
    status: "nonbegin",
    participants: [],
  });

  //my msg
  const evtSrclive = useRef(null);

  //Http Request
  const { sendRequest } = useHttpClient();

  //set a party
  const setParty = useCallback((partyId) => {
    //change the current value of context provider partyid
    setPartyId(partyId);
    //Stored the new data in the browser
    const storedData = JSON.parse(localStorage.getItem("userData"));
    storedData.PartyId = partyId;
    localStorage.setItem("userData", JSON.stringify(storedData));
  }, []);

  //logout
  const logout = useCallback(
    async (idPlayerquitting, idPartytoquit = null) => {
      //Send a message to avert other that we quit
      if (idPartytoquit) {
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/party/quit`,
            "POST",
            JSON.stringify({
              idParty: idPartytoquit,
              idPlayer: idPlayerquitting,
            }),
            {
              "Content-Type": "application/json",
            }
          );
          if (rep.msg === "ok") {
            setPartyInfo({
              status: "nonbegin",
              participants: [],
            });
            setParty(null);
            setPlayerId({ auto: null, playerId: false });
            localStorage.removeItem("userData");
            if (evtSrclive.current) {
              evtSrclive.current.close();
            }
          }
        } catch (err) {
          console.log("ERROR SENDING MESSAGE");
          setPartyInfo({
            status: "nonbegin",
            participants: [],
          });
          setParty(null);
          setPlayerId({ auto: null, playerId: false });

          localStorage.removeItem("userData");
          if (evtSrclive.current) {
            evtSrclive.current.close();
          }
        }
      } else {
        setPartyInfo({
          status: "nonbegin",
          participants: [],
        });
        setParty(null);
        setPlayerId({ auto: null, playerId: false });

        localStorage.removeItem("userData");
        if (evtSrclive.current) {
          evtSrclive.current.close();
        }
      }
    },
    [setParty, sendRequest]
  );

  //remove party
  const removeParty = useCallback((partyId) => {
    //change the current value of context provider partyid
    setPartyId(null);
    //Remove the new data in the browser
    let storedData = JSON.parse(localStorage.getItem("userData"));
    delete storedData["PartyId"];
    localStorage.setItem("userData", JSON.stringify(storedData));
  }, []);

  //function to check if player is playing and reconnecting him to party
  const autoverifypartycurrent = useCallback(
    async (storedData) => {
      try {
        const rep = await sendRequest(
          `${process.env.REACT_APP_BACKENDURL}/api/live/party/comebacktoparty`,
          "POST",
          JSON.stringify({
            PartyId: storedData.PartyId,
            PlayerId: storedData.PlayerId,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        if (rep.partyId) {
          setParty(storedData.PartyId);
        } else if (rep.partyId === false && storedData.PartyId) {
          removeParty();
        } else {
        }
      } catch (err) {}
    },
    [removeParty, sendRequest, setParty]
  );
  //run to log
  const login = useCallback(
    async (pid, auto = false) => {
      if (pid) {
        //the localstorageData
        let newUserdata;
        newUserdata = JSON.parse(localStorage.getItem("userData"));

        //Verifier que cet Id n'a pas été pris entre temps et se deconnecter dans le cas contraire
        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/${pid}/isExisting`
          );

          if (rep.msg === "Ok") {
            //All Live event are configured here when connected
            evtSrclive.current = new EventSource(
              `${process.env.REACT_APP_BACKENDURL}/api/live/${pid}`
            );

            //liveevent listening to new connection in our server
            evtSrclive.current.addEventListener("count", (event) => {
              console.log("COUNT " + event.data);
            });

            //liveevent checkoldparty
            evtSrclive.current.addEventListener("ready", (event) => {
              //when evrtSrc is set, we check if we had old party stored in localstorage data currently running
              console.log("READY " + event.data);
              if (newUserdata && newUserdata.PartyId) {
                autoverifypartycurrent(newUserdata);
              }
            });

            //liveevent listening to new player in my parti
            evtSrclive.current.addEventListener("partydata", (event) => {
              console.log("PARTYDATA " + event.data);
              const data = JSON.parse(event.data);
              setPartyInfo(data.party);
            });

            //liveevent listening to partybegin
            evtSrclive.current.addEventListener("notif", (event) => {
              console.log("NOTIF " + event.data);
              const data = JSON.parse(event.data);
              setPartyInfo(data.party);
            });
          }
        } catch (err) {
          logout(pid);
        }

        //change the current value of context provider playerId
        setPlayerId({ auto: auto, playerId: pid });

        //Stored the new data in the browser
        if (newUserdata) {
          newUserdata.PlayerId = pid;
        } else newUserdata = { PlayerId: pid };
        localStorage.setItem("userData", JSON.stringify(newUserdata));
      }
    },
    [sendRequest, logout, autoverifypartycurrent]
  );

  //run when acces to website
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.PlayerId) {
      login(storedData.PlayerId, true);
    }
  }, [login, autoverifypartycurrent]);

  return {
    login,
    logout,
    PlayerId,
    PartyId,
    setParty,
    removeParty,
    PartyInfo,
  };
};
