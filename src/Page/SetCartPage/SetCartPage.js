import React, { useContext } from "react";
import { PlayerContext } from "../../context/playercontext";
const SetCartPage = () => {
  //AUTHCONTEXT
  const playercontext = useContext(PlayerContext);
  return (
    <div>
      <div> TU ES DANS LA PARTIE {playercontext.PartyId}</div>
      <div>
        TU JOUE AVEC
        <div>
          {playercontext.PartyInfo.participants.map((player) => {
            return (
              <div>
                {player.id} {player.status} {player.role}
              </div>
            );
          })}
        </div>
      </div>
      <div> LA PARTIE EST {playercontext.PartyInfo.status}</div>
    </div>
  );
};

export default SetCartPage;
