import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { ComputerPlayer } from "./computer";
import { PubSub } from "../PubSub";
import { Ship } from "./ship";

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

const player = new Player(playerBoard, computerBoard);
const computer = ComputerPlayer(computerBoard, playerBoard);

function removeShipUIFromBoard(shipObj) {
  console.log("Removal");
  playerBoard.remove({
    id: shipObj.id,
    sVertical: shipObj.isVertical,
    length: shipObj.length,
    startX: shipObj.startX,
    startY: shipObj.startY,
  });
}

export function doesShipCrossAnyShips(tilesUnderShip) {
  return tilesUnderShip.some((tileUi) =>
    playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
  );
}

function placeShipUIOnBoard(shipObj) {
  const gameplayShip = new Ship(shipObj.length, shipObj.id);
  playerBoard.place({
    shipObj: gameplayShip,
    isVertical: false,
    startX: shipObj.startX,
    startY: shipObj.startY,
  });
  console.log(playerBoard);
}

PubSub.on("placeShipUIOnBoard", placeShipUIOnBoard);
PubSub.on("removeShipFromBoard", removeShipUIFromBoard);
