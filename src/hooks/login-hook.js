import { useState, useCallback, useEffect } from "react";

export const useAuth = () => {
  const [PlayerId, setPlayerId] = useState(false);

  const login = useCallback((pid) => {
    setPlayerId(pid);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        PlayerId: pid,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setPlayerId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.PlayerId) {
      login(storedData.PlayerId);
    }
  }, [login]);
  return { login, logout, PlayerId };
};
