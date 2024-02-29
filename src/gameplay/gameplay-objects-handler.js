import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { ComputerPlayer } from "./computer";
import { PubSub } from "../PubSub";

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

const player = new Player(playerBoard, computerBoard);
const computer = ComputerPlayer(computerBoard, playerBoard);

PubSub.on("checkIfShipCrossesAnyShips", (data) => {
  if (
    data.tilesUnderShip.every(
      (tileUi) => !playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
    )
  ) {
    PubSub.emit("placementIsLegal", data.tilesUnderShip);
  } else {
    PubSub.emit("placementIsIllegal");
  }
});
