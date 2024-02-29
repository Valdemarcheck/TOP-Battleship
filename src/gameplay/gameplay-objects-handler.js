import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { ComputerPlayer } from "./computer";
import { PubSub } from "../PubSub";
import { Ship } from "./ship";

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

PubSub.on("shipMayBePlacedOnGameplayBoard", (placementData) => {
  const gameplayShip = new Ship(
    placementData.shipUI.length,
    placementData.shipUI.id
  );
  playerBoard.place({
    shipObj: gameplayShip,
    isVertical: false,
    startX: placementData.x,
    startY: placementData.y,
  });
  console.log(playerBoard);
});
