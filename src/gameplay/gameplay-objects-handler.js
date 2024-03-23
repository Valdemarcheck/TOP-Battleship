import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { ComputerPlayer } from "./computer";
import { PubSub } from "../PubSub";
import { Ship } from "./ship";
import { getTilesForRotation } from "../tileUI";

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

const player = new Player(playerBoard, computerBoard);
const computer = ComputerPlayer(computerBoard, playerBoard);

function removeShipUIFromBoard(shipUI) {
  playerBoard.remove({
    id: shipUI.id,
    isVertical: shipUI.isVertical,
    length: shipUI.length,
    startX: shipUI.startX,
    startY: shipUI.startY,
  });
}

export function doesShipCrossAnyShips(tilesUnderShip) {
  return tilesUnderShip.some((tileUi) =>
    playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
  );
}

function placeShipUIOnBoard(shipUI) {
  const gameplayShip = new Ship(shipUI.length, shipUI.id);
  console.log(shipUI.isVertical);
  playerBoard.place({
    shipUI: gameplayShip,
    isVertical: shipUI.isVertical,
    startX: shipUI.startX,
    startY: shipUI.startY,
  });
  console.log(playerBoard);
}

function attemptToRotateShipUI({ e, shipUI }) {
  const tilesThatShipWillTake = getTilesForRotation(
    shipUI.startX,
    shipUI.startY,
    shipUI.length,
    shipUI.isVertical
  );
  const tilesExceptOriginTile = tilesThatShipWillTake.slice(1);
  if (!doesShipCrossAnyShips(tilesExceptOriginTile)) {
    removeShipUIFromBoard(shipUI);
    PubSub.emit("shipMayBeRotated", shipUI);
    placeShipUIOnBoard(shipUI);
  } else {
    PubSub.emit("tellPlayerShipWillCoverAnotherOneIfRotated", { shipUI, e });
  }
}

PubSub.on("placeShipUIOnBoard", placeShipUIOnBoard);
PubSub.on("removeShipFromBoard", removeShipUIFromBoard);
PubSub.on("userWantsToRotateShipOnBoard", attemptToRotateShipUI);
