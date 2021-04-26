import { useState, useCallback, useEffect, useRef } from "react";
import { useHttpClient } from "../hooks/http-hook";

export const usePlayer = () => {
  const [PlayerId, setPlayerId] = useState(false);
  const evtSrclive = useRef(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const logout = useCallback(() => {
    setPlayerId(null);
    localStorage.removeItem("userData");
    if (evtSrclive.current) {
      evtSrclive.current.close();
    }
  }, []);

  const login = useCallback(
    async (pid) => {
      if (pid) {
        console.log(pid, "aou");
        setPlayerId(pid);

        localStorage.setItem(
          "userData",
          JSON.stringify({
            PlayerId: pid,
          })
        );

        try {
          const rep = await sendRequest(
            `${process.env.REACT_APP_BACKENDURL}/api/live/${pid}/isExisting`
          );

          if (rep.msg === "Ok") {
            console.log("YEEEEEES");
            evtSrclive.current = new EventSource(
              `${process.env.REACT_APP_BACKENDURL}/api/live/${pid}`
            );
            evtSrclive.current.addEventListener("count", (event) => {
              console.log(event.data);
            });
          }
        } catch (err) {
          console.log("NOOOOOO");
          logout();
        }
      }
    },
    [sendRequest, logout]
  );

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.PlayerId) {
      login(storedData.PlayerId);
    }
  }, [login]);
  return { login, logout, PlayerId };
};
