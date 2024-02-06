import { PubSub } from "./PubSub";
import "./dock-manager";
import fillGridWithCells from "./grid-setup";
const MAIN_ACTION_BUTTON_PRESET_NAMES = {
  nextPlacementStage: "Start placing ships",
  nextGameStage: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent =
  MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage;

const [gridLeft, gridRight] = document.getElementsByClassName("grid");
fillGridWithCells(gridLeft);
fillGridWithCells(gridRight);

mainActionButton.addEventListener("click", () => {
  switch (mainActionButton.textContent) {
    case MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage: {
      PubSub.emit("checkIfAllShipsWerePlaced");
      break;
    }
    case MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage: {
      PubSub.emit("placementOfShipsHasStarted");
      mainActionButton.textContent =
        MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage;
      break;
    }
  }
});
