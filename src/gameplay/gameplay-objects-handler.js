import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { ComputerPlayer } from "./computer";
import { PubSub } from "../PubSub";
import { Ship } from "./ship";

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

const player = new Player(playerBoard, computerBoard);
const computer = ComputerPlayer(computerBoard, playerBoard);

function placeShipUIOnBoard({ shipObj, x, y }) {
  const gameplayShip = new Ship(shipObj.length, shipObj.id);
  playerBoard.place({
    shipObj: gameplayShip,
    isVertical: false,
    startX: x,
    startY: y,
  });
  console.log(playerBoard);
}

PubSub.on("checkIfShipCrossesAnyShips", (data) => {
  if (
    data.tilesUnderShip.every(
      (tileUi) => !playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
    )
  ) {
    PubSub.emit("placementIsLegal", data.tilesUnderShip);
    placeShipUIOnBoard({
      shipObj: data.shipUI,
      x: data.x,
      y: data.y,
    });
  } else {
    PubSub.emit("placementIsIllegal");
  }
});
