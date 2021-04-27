import { createContext } from "react";

export const PlayerContext = createContext({
  isPlayerIn: false,
  PlayerId: null,
  PartyId: null,
  login: () => {},
  logout: () => {},
  setParty: () => {},
  removeParty: () => {},
});
