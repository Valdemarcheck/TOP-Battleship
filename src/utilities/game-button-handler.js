import { PubSub } from "../PubSub";

const MAIN_ACTION_BUTTON_NAMES = {
  shipPlacementAfterClick: "Start placing ships",
  gameplayAfterClick: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent = MAIN_ACTION_BUTTON_NAMES.shipPlacementAfterClick;

mainActionButton.addEventListener("click", () => {
  switch (mainActionButton.textContent) {
    case MAIN_ACTION_BUTTON_NAMES.gameplayAfterClick: {
      PubSub.emit("checkIfAllShipsWerePlaced");
      break;
    }
    case MAIN_ACTION_BUTTON_NAMES.shipPlacementAfterClick: {
      PubSub.emit("placementOfShipsHasStarted");
      mainActionButton.textContent =
        MAIN_ACTION_BUTTON_NAMES.gameplayAfterClick;
      break;
    }
  }
});
