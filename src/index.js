import { PubSub } from "./PubSub";
import fillGridWithCells from "./grid-setup";
const MAIN_ACTION_BUTTON_PRESET_NAMES = {
  nextPlacementStage: "Start placing ships",
  nextGameStage: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent =
  MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage;
const dock = document.querySelector(".dock");

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
      break;
    }
  }
});

PubSub.on("placementOfShipsHasStarted", () => {
  mainActionButton.textContent = MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage;
  dock.style.display = "flex";
});
