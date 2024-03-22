/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/PubSub.js":
/*!***********************!*\
  !*** ./src/PubSub.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PubSub: () => (/* binding */ PubSub)
/* harmony export */ });
const PubSub = (() => {
  const EVENTS = {};

  function on(eventName, fn) {
    EVENTS[eventName] = EVENTS[eventName] || [];
    EVENTS[eventName].push(fn);
  }

  function off(eventName, fn) {
    if (EVENTS[eventName]) {
      EVENTS[eventName] = EVENTS[eventName].filter(
        (currentFn) => currentFn != fn
      );
    }
  }

  function emit(eventName, data) {
    console.log(eventName + " EVENT WAS CALLED");
    if (EVENTS[eventName]) {
      EVENTS[eventName].forEach((fn) => {
        fn(data);
      });
    }
  }

  return { on, off, emit };
})();


/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BOARD_SIZE: () => (/* binding */ BOARD_SIZE),
/* harmony export */   SHIP_HEIGHT_COEFFICIENT: () => (/* binding */ SHIP_HEIGHT_COEFFICIENT),
/* harmony export */   SHIP_PLACEMENT_ON_TILE_X_OFFSET: () => (/* binding */ SHIP_PLACEMENT_ON_TILE_X_OFFSET),
/* harmony export */   SHIP_PLACEMENT_ON_TILE_Y_OFFSET: () => (/* binding */ SHIP_PLACEMENT_ON_TILE_Y_OFFSET),
/* harmony export */   SHIP_WIDTH_COEFFICIENT: () => (/* binding */ SHIP_WIDTH_COEFFICIENT),
/* harmony export */   TILE_SIZE_PX: () => (/* binding */ TILE_SIZE_PX)
/* harmony export */ });
const TILE_SIZE_PX = 50;
const BOARD_SIZE = 10;
const SHIP_PLACEMENT_ON_TILE_Y_OFFSET = TILE_SIZE_PX / 10;
const SHIP_PLACEMENT_ON_TILE_X_OFFSET = TILE_SIZE_PX / 10;

// ship settings
const SHIP_HEIGHT_COEFFICIENT = -10;
const SHIP_WIDTH_COEFFICIENT = -10;


/***/ }),

/***/ "./src/gameplay/computer.js":
/*!**********************************!*\
  !*** ./src/gameplay/computer.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComputerPlayer: () => (/* binding */ ComputerPlayer)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");


function ComputerPlayer(computerBoard, enemyBoard) {
  const unusedCoordinatesObj = (() => {
    const unusedCoordinatesObj = {};
    const yCoordinatesInOneColumn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = 1; i <= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE; i++) {
      unusedCoordinatesObj[i] = [...yCoordinatesInOneColumn];
    }
    return unusedCoordinatesObj;
  })();

  function removeElementFromArray(value, array) {
    const arrayCopy = [...array];
    const indexOfValue = arrayCopy.indexOf(value);
    arrayCopy.splice(indexOfValue, 1);
    return arrayCopy;
  }

  function getRandomCoordinates() {
    const possibleXValues = Object.keys(unusedCoordinatesObj);
    const x =
      possibleXValues[Math.floor(Math.random() * possibleXValues.length)];
    const possibleYValues = unusedCoordinatesObj[x];
    const y =
      possibleYValues[Math.floor(Math.random() * possibleYValues.length)];

    unusedCoordinatesObj[x] = removeElementFromArray(
      y,
      unusedCoordinatesObj[x]
    );
    if (unusedCoordinatesObj[x].length === 0) {
      delete unusedCoordinatesObj[x];
    }
    return [x, y];
  }

  function makeTurn() {
    const [x, y] = getRandomCoordinates();
    enemyBoard.receiveAttack(x, y);
  }

  return { unusedCoordinatesObj, makeTurn };
}


/***/ }),

/***/ "./src/gameplay/gameboard.js":
/*!***********************************!*\
  !*** ./src/gameplay/gameboard.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gameboard: () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");


function getArrayOfSameValues(size, value) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push([]);
    for (let j = 0; j < size; j++) {
      array[i].push(value);
    }
  }
  return array;
}

class Gameboard {
  hitCellsBoardArray = getArrayOfSameValues(_constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE, false);
  shipsOnBoardArray = getArrayOfSameValues(_constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE, null);
  listOfShips = [];

  constructor() {}

  isPlacementLegal({ shipObj, isVertical, startX, startY }) {
    return (
      !this.#areStartCoordinatesOutOfBounds(startX, startY) &&
      !this.#areEndCoordinatesOutOfBounds({
        shipLength: shipObj.length,
        isVertical,
        startX,
        startY,
      }) &&
      !this.#isFilledPath({
        pathLength: shipObj.length,
        isVertical,
        startX,
        startY,
      })
    );
  }

  remove({ id, isVertical, length, startX, startY }) {
    const [actualStartX, actualStartY] = this.#convertBoardCoordsToArrayCoords(
      startX,
      startY
    );
    if (isVertical) {
      for (let currentY = 0; currentY < length; currentY++) {
        this.shipsOnBoardArray[actualStartY - currentY][actualStartX] = null;
      }
    } else {
      for (let currentX = 0; currentX < length; currentX++) {
        this.shipsOnBoardArray[actualStartY][actualStartX + currentX] = null;
      }
    }
    this.#removeShipFromListOfPlacedShips(id);
  }

  place({ shipObj, isVertical, startX, startY }) {
    if (!this.isPlacementLegal({ shipObj, isVertical, startX, startY })) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }

    [startX, startY] = this.#convertBoardCoordsToArrayCoords(startX, startY);

    if (isVertical) {
      for (let currentY = 0; currentY < shipObj.length; currentY++) {
        this.shipsOnBoardArray[startY - currentY][startX] = shipObj;
      }
    } else {
      for (let currentX = 0; currentX < shipObj.length; currentX++) {
        this.shipsOnBoardArray[startY][startX + currentX] = shipObj;
      }
    }

    this.#addShipToListOfShips(shipObj);
  }

  isShipPlacedOnCoordinates(x, y) {
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    return !!this.shipsOnBoardArray[actualY][actualX];
  }

  receiveAttack(x, y) {
    if (this.#areStartCoordinatesOutOfBounds(x, y) || this.#isHit(x, y)) {
      throw new Error("Given coordinates are out of bounds of the gameboard");
    }
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    this.hitCellsBoardArray[actualY][actualX] = true;

    const hitShip = this.shipsOnBoardArray[actualY][actualX];
    if (hitShip) {
      hitShip.hit();
    }
  }

  get areAllShipsSunk() {
    return this.listOfShips.every((shipObj) => {
      return shipObj.isSunk;
    });
  }

  #removeShipFromListOfPlacedShips(id) {
    this.listOfShips = this.listOfShips.filter((ship) => ship.id != id);
  }

  #isHit(x, y) {
    const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(x, y);
    return this.hitCellsBoardArray[actualY][actualX];
  }

  #isFilledPath({ pathLength, isVertical, startX, startY }) {
    const [actualStartX, actualStartY] = this.#convertBoardCoordsToArrayCoords(
      startX,
      startY
    );

    if (isVertical) {
      for (let currentY = 0; currentY < pathLength; currentY++) {
        if (!!this.shipsOnBoardArray[actualStartY - currentY][actualStartX]) {
          return true;
        }
      }
    } else {
      for (let currentX = 0; currentX < pathLength; currentX++) {
        if (!!this.shipsOnBoardArray[actualStartY][actualStartX + currentX]) {
          return true;
        }
      }
    }

    return false;
  }

  #addShipToListOfShips(shipObj) {
    this.listOfShips.push(shipObj);
  }

  #convertBoardCoordsToArrayCoords(x, y) {
    return [x - 1, y - 1];
  }

  #areStartCoordinatesOutOfBounds(x, y) {
    return x < 0 || y < 0 || x > _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE || y > _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE;
  }

  #areEndCoordinatesOutOfBounds({ shipLength, isVertical, startX, startY }) {
    if (isVertical) {
      const endY = startY - shipLength;
      return endY < 0;
    } else {
      const endX = startX + shipLength - 1;
      return endX > _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE;
    }
  }
}


/***/ }),

/***/ "./src/gameplay/gameplay-objects-handler.js":
/*!**************************************************!*\
  !*** ./src/gameplay/gameplay-objects-handler.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   doesShipCrossAnyShips: () => (/* binding */ doesShipCrossAnyShips)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameplay/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/gameplay/player.js");
/* harmony import */ var _computer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computer */ "./src/gameplay/computer.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ship */ "./src/gameplay/ship.js");






const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();
const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();

const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player(playerBoard, computerBoard);
const computer = (0,_computer__WEBPACK_IMPORTED_MODULE_2__.ComputerPlayer)(computerBoard, playerBoard);

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

function doesShipCrossAnyShips(tilesUnderShip) {
  return tilesUnderShip.some((tileUi) =>
    playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
  );
}

function placeShipUIOnBoard(shipObj) {
  const gameplayShip = new _ship__WEBPACK_IMPORTED_MODULE_4__.Ship(shipObj.length, shipObj.id);
  playerBoard.place({
    shipObj: gameplayShip,
    isVertical: false,
    startX: shipObj.startX,
    startY: shipObj.startY,
  });
  console.log(playerBoard);
}

_PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.on("placeShipUIOnBoard", placeShipUIOnBoard);
_PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.on("removeShipFromBoard", removeShipUIFromBoard);


/***/ }),

/***/ "./src/gameplay/player.js":
/*!********************************!*\
  !*** ./src/gameplay/player.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
function Player(board, enemyBoard) {
  const takeTurn = function (x, y) {
    try {
      enemyBoard.receiveAttack(x, y);
    } catch (e) {
      console.log("Your move is illegal! Try hitting another cell.");
    }
  };
  return { takeTurn };
}


/***/ }),

/***/ "./src/gameplay/ship.js":
/*!******************************!*\
  !*** ./src/gameplay/ship.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  timesHit = 0;

  constructor(length, id) {
    this.length = length;
    this.id = id;
  }

  hit() {
    this.timesHit++;
  }

  get isSunk() {
    return this.timesHit >= this.length;
  }
}


/***/ }),

/***/ "./src/shipUI.js":
/*!***********************!*\
  !*** ./src/shipUI.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShipUI: () => (/* binding */ ShipUI)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
/* harmony import */ var _gameplay_gameplay_objects_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameplay/gameplay-objects-handler */ "./src/gameplay/gameplay-objects-handler.js");





class ShipUI {
  static movableShip = null;
  static allShips = [];
  static usedIDs = [];
  static ID_MAX_SIZE = 2;
  onBoard = false;
  offsetX = 0;
  offsetY = 0;
  startX = null;
  startY = null;

  constructor(shipElement, length, isRotated) {
    ShipUI.allShips.push(this);
    const ID = ShipUI.#generateShipID();
    this.id = ID;
    this.length = length;
    this.isRotated = isRotated;

    this.shipElement = shipElement;
    this.shipElement.id = ID;
    this.shipElement.classList.add("dock-ship");
    this.shipElement.classList.add(`length-${length}`);
    if (isRotated) {
      this.shipElement.classList.add("rotated");
    }
    this.shipElement.style.width =
      length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_WIDTH_COEFFICIENT + "px";
    this.shipElement.style.height =
      _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_HEIGHT_COEFFICIENT + "px";

    const rect = this.shipElement.getBoundingClientRect();
    this.originY = rect.top;
    this.originX = rect.left;

    shipElement.addEventListener("mousedown", (e) => {
      ShipUI.movableShip = this;

      const rect = this.shipElement.getBoundingClientRect();
      this.offsetY = e.clientY - rect.top;
      this.offsetX = e.clientX - rect.left;
      console.log(e.clientY, rect.top, this.offsetY);
      this.shipElement.style.position = "absolute";
    });
  }

  static #generateShipID() {
    let id = null;
    do {
      id = parseInt(Math.random() * 10 ** ShipUI.ID_MAX_SIZE);
    } while (ShipUI.usedIDs.includes(id));
    return id;
  }
}

function isShipPositionLegal(ShipUI, tilesUnderShip) {
  const isShipOverAnyTiles = tilesUnderShip.length > 0;
  const isShipOutOfBounds = tilesUnderShip.length !== ShipUI.movableShip.length;
  return (
    isShipOverAnyTiles &&
    !(0,_gameplay_gameplay_objects_handler__WEBPACK_IMPORTED_MODULE_3__.doesShipCrossAnyShips)(tilesUnderShip) &&
    !isShipOutOfBounds
  );
}

function setShipStartCoordinates(shipUI, tilesUnderShip) {
  shipUI.startX = tilesUnderShip[0].x;
  shipUI.startY = tilesUnderShip[0].y;
}

function setShipOriginToTile(shipUI, tileUI) {
  const tileRect = tileUI.tileElement.getBoundingClientRect();
  shipUI.originY =
    tileRect.top +
    document.documentElement.scrollTop +
    _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_PLACEMENT_ON_TILE_Y_OFFSET;
  shipUI.originX = tileRect.left + _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_PLACEMENT_ON_TILE_X_OFFSET;
}

function move(e, ship) {
  ship.shipElement.style.top = e.pageY - ship.offsetY + "px";
  ship.shipElement.style.left = e.pageX - ship.offsetX + "px";
}

function reset(ship, isShipPositionLegal) {
  if (!isShipPositionLegal) {
    ship.shipElement.style.position = "static";
  } else {
    ship.shipElement.style.top = ShipUI.movableShip.originY + "px";
    ship.shipElement.style.left = ShipUI.movableShip.originX + "px";
  }
}

document.addEventListener("mousemove", (e) => {
  if (ShipUI.movableShip) {
    move(e, ShipUI.movableShip);
    _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("shipIsMoving", ShipUI.movableShip);
  }
});

document.addEventListener("mouseup", () => {
  if (ShipUI.movableShip) {
    _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("noShipMovement", ShipUI.movableShip);
    const tilesUnderShip = (0,_tileUI__WEBPACK_IMPORTED_MODULE_2__.getTilesUnderShip)(ShipUI.movableShip);
    const mayBePlacedOnBoard = isShipPositionLegal(ShipUI, tilesUnderShip);

    if (ShipUI.movableShip.onBoard) {
      _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("removeShipFromBoard", ShipUI.movableShip);
      ShipUI.movableShip.onBoard = false;
    }
    if (mayBePlacedOnBoard) {
      setShipStartCoordinates(ShipUI.movableShip, tilesUnderShip);
      setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
      ShipUI.movableShip.onBoard = true;

      _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("placeShipUIOnBoard", ShipUI.movableShip);
    } else {
      console.warn("Such ship placement is illegal");
    }

    reset(ShipUI.movableShip, mayBePlacedOnBoard);
    ShipUI.movableShip = null;
  }
});


/***/ }),

/***/ "./src/tileUI.js":
/*!***********************!*\
  !*** ./src/tileUI.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TileUI: () => (/* binding */ TileUI),
/* harmony export */   getTilesUnderShip: () => (/* binding */ getTilesUnderShip)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
/* harmony import */ var _utilities_grid_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/grid-handler */ "./src/utilities/grid-handler.js");




function tileBelongsToEnemyGrid(tile, enemyGrid) {
  return tile.parentElement == enemyGrid;
}

function isShipOverTile(tile, ship, length, isRotated, baseLength) {
  if (tileBelongsToEnemyGrid(tile, _utilities_grid_handler__WEBPACK_IMPORTED_MODULE_2__.enemyGrid)) return false;
  const tileRect = tile.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();

  for (let i = 0; i < length; i++) {
    const differenceTop = Math.abs(tileRect.top - shipRect.top);
    const differenceLeft = Math.abs(tileRect.left - shipRect.left);
    const differenceBottom = isRotated
      ? Math.abs(tileRect.bottom - (shipRect.bottom - baseLength * i))
      : Math.abs(tileRect.bottom - shipRect.bottom);
    const differenceRight = isRotated
      ? Math.abs(tileRect.right - shipRect.right)
      : Math.abs(tileRect.right - (shipRect.right - baseLength * i));

    if (
      (differenceTop < tileRect.height / 2 ||
        differenceLeft < tileRect.width / 2) &&
      differenceBottom < tileRect.height / 2 &&
      differenceRight < tileRect.width / 2 &&
      differenceTop < tileRect.height / 2
    ) {
      return true;
    }
  }

  return false;
}

function getTilesUnderShip(shipUI) {
  return TileUI.allTiles.filter((tileUI) =>
    isShipOverTile(
      tileUI.tileElement,
      shipUI.shipElement,
      shipUI.length,
      shipUI.isRotated,
      _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX
    )
  );
}

class TileUI {
  static allTiles = [];
  constructor(tileElement, x, y) {
    TileUI.allTiles.push(this);
    this.x = x;
    this.y = y;
    this.tileElement = tileElement;
    this.tileElement.classList.add("tile");
    this.tileElement.dataset.x = x;
    this.tileElement.dataset.y = y;
    this.tileElement.width = _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";

    _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("shipIsMoving", (ship) => {
      if (
        isShipOverTile(
          this.tileElement,
          ship.shipElement,
          ship.length,
          ship.isRotated,
          _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX
        )
      ) {
        this.tileElement.classList.add("hoveredWithShip");
      } else {
        this.tileElement.classList.remove("hoveredWithShip");
      }
    });
    _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("noShipMovement", () => {
      this.tileElement.classList.remove("hoveredWithShip");
    });
  }
}


/***/ }),

/***/ "./src/utilities/dock-handler.js":
/*!***************************************!*\
  !*** ./src/utilities/dock-handler.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");
/* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shipUI */ "./src/shipUI.js");



function createShipUI(length, rotated) {
  const ship = new _shipUI__WEBPACK_IMPORTED_MODULE_1__.ShipUI(document.createElement("div"), length, rotated);
  return ship.shipElement;
}

function pushShipToDock(shipElement) {
  dock.appendChild(shipElement);
}

const dock = document.querySelector(".dock");

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipToDock(createShipUI(4, true));
  pushShipToDock(createShipUI(3, false));
  pushShipToDock(createShipUI(3, false));
  pushShipToDock(createShipUI(2, false));
  pushShipToDock(createShipUI(2, false));
  pushShipToDock(createShipUI(2, false));
  pushShipToDock(createShipUI(1, false));
  pushShipToDock(createShipUI(1, false));
  pushShipToDock(createShipUI(1, false));
  pushShipToDock(createShipUI(1, false));
});

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("checkIfAllShipsWerePlaced", () => {
  if (dock.children.length > 0) {
    alert("Dock is not empty!");
  } else {
    dock.style.display = "None";
    _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("gameStarts");
  }
});


/***/ }),

/***/ "./src/utilities/game-button-handler.js":
/*!**********************************************!*\
  !*** ./src/utilities/game-button-handler.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");


const MAIN_ACTION_BUTTON_NAMES = {
  shipPlacementAfterClick: "Start placing ships",
  gameplayAfterClick: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent = MAIN_ACTION_BUTTON_NAMES.shipPlacementAfterClick;

mainActionButton.addEventListener("click", () => {
  switch (mainActionButton.textContent) {
    case MAIN_ACTION_BUTTON_NAMES.gameplayAfterClick: {
      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("checkIfAllShipsWerePlaced");
      break;
    }
    case MAIN_ACTION_BUTTON_NAMES.shipPlacementAfterClick: {
      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("placementOfShipsHasStarted");
      mainActionButton.textContent =
        MAIN_ACTION_BUTTON_NAMES.gameplayAfterClick;
      break;
    }
  }
});


/***/ }),

/***/ "./src/utilities/grid-handler.js":
/*!***************************************!*\
  !*** ./src/utilities/grid-handler.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enemyGrid: () => (/* binding */ enemyGrid),
/* harmony export */   playerGrid: () => (/* binding */ playerGrid)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tileUI */ "./src/tileUI.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");





const [enemyGrid, playerGrid] = document.getElementsByClassName("grid");
fillGridWithCells(enemyGrid);
fillGridWithCells(playerGrid);
setGridTileSize(enemyGrid);
setGridTileSize(playerGrid);

function fillGridWithCells(grid) {
  for (let y = 0; y < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE; y++) {
    for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE; x++) {
      const tile = new _tileUI__WEBPACK_IMPORTED_MODULE_1__.TileUI(document.createElement("div"), x + 1, y + 1);
      grid.appendChild(tile.tileElement);
    }
  }
}

function setGridTileSize(grid) {
  grid.style.gridTemplateColumns = `repeat(${_constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE}, ${
    _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px"
  })`;
  grid.style.gridTemplateRows = `repeat(${_constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE}, ${_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px"})`;
}

function greyOutEnemyGrid() {
  enemyGrid.classList.add("greyed-out");
}

_PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on("fillGridWithCells", fillGridWithCells);
_PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on("setGridTileSize", setGridTileSize);
_PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on("placementOfShipsHasStarted", greyOutEnemyGrid);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utilities_grid_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities/grid-handler */ "./src/utilities/grid-handler.js");
/* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shipUI */ "./src/shipUI.js");
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
/* harmony import */ var _utilities_dock_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/dock-handler */ "./src/utilities/dock-handler.js");
/* harmony import */ var _utilities_game_button_handler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities/game-button-handler */ "./src/utilities/game-button-handler.js");
/* harmony import */ var _gameplay_gameplay_objects_handler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gameplay/gameplay-objects-handler */ "./src/gameplay/gameplay-objects-handler.js");







})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QjJDO0FBQ1Q7QUFDTztBQUNQOztBQUU1QjtBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLElBQUksa0RBQVUsRUFBRTtBQUNsQyxvQkFBb0IsSUFBSSxrREFBVSxFQUFFO0FBQ3BDLHVCQUF1QiwyQ0FBTTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxrREFBVSxDQUFDO0FBQ3hELElBQUksb0RBQVk7QUFDaEIsR0FBRztBQUNILDBDQUEwQyxrREFBVSxDQUFDLElBQUksb0RBQVksUUFBUTtBQUM3RTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMkNBQU07QUFDTiwyQ0FBTTtBQUNOLDJDQUFNOzs7Ozs7O1VDakNOO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNoQjtBQUNBO0FBQ2dCO0FBQ087QUFDSSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dhbWVwbGF5L2dhbWVwbGF5LW9iamVjdHMtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9nYW1lcGxheS9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9zaGlwVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdGlsZVVJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3V0aWxpdGllcy9kb2NrLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2dhbWUtYnV0dG9uLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2dyaWQtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBQdWJTdWIgPSAoKCkgPT4ge1xuICBjb25zdCBFVkVOVFMgPSB7fTtcblxuICBmdW5jdGlvbiBvbihldmVudE5hbWUsIGZuKSB7XG4gICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBFVkVOVFNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9mZihldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XG4gICAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdLmZpbHRlcihcbiAgICAgICAgKGN1cnJlbnRGbikgPT4gY3VycmVudEZuICE9IGZuXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgY29uc29sZS5sb2coZXZlbnROYW1lICsgXCIgRVZFTlQgV0FTIENBTExFRFwiKTtcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdLmZvckVhY2goKGZuKSA9PiB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgb24sIG9mZiwgZW1pdCB9O1xufSkoKTtcbiIsImV4cG9ydCBjb25zdCBUSUxFX1NJWkVfUFggPSA1MDtcbmV4cG9ydCBjb25zdCBCT0FSRF9TSVpFID0gMTA7XG5leHBvcnQgY29uc3QgU0hJUF9QTEFDRU1FTlRfT05fVElMRV9ZX09GRlNFVCA9IFRJTEVfU0laRV9QWCAvIDEwO1xuZXhwb3J0IGNvbnN0IFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQgPSBUSUxFX1NJWkVfUFggLyAxMDtcblxuLy8gc2hpcCBzZXR0aW5nc1xuZXhwb3J0IGNvbnN0IFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UID0gLTEwO1xuZXhwb3J0IGNvbnN0IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgPSAtMTA7XG4iLCJpbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29tcHV0ZXJQbGF5ZXIoY29tcHV0ZXJCb2FyZCwgZW5lbXlCb2FyZCkge1xuICBjb25zdCB1bnVzZWRDb29yZGluYXRlc09iaiA9ICgoKSA9PiB7XG4gICAgY29uc3QgdW51c2VkQ29vcmRpbmF0ZXNPYmogPSB7fTtcbiAgICBjb25zdCB5Q29vcmRpbmF0ZXNJbk9uZUNvbHVtbiA9IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMF07XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBCT0FSRF9TSVpFOyBpKyspIHtcbiAgICAgIHVudXNlZENvb3JkaW5hdGVzT2JqW2ldID0gWy4uLnlDb29yZGluYXRlc0luT25lQ29sdW1uXTtcbiAgICB9XG4gICAgcmV0dXJuIHVudXNlZENvb3JkaW5hdGVzT2JqO1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXkodmFsdWUsIGFycmF5KSB7XG4gICAgY29uc3QgYXJyYXlDb3B5ID0gWy4uLmFycmF5XTtcbiAgICBjb25zdCBpbmRleE9mVmFsdWUgPSBhcnJheUNvcHkuaW5kZXhPZih2YWx1ZSk7XG4gICAgYXJyYXlDb3B5LnNwbGljZShpbmRleE9mVmFsdWUsIDEpO1xuICAgIHJldHVybiBhcnJheUNvcHk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSYW5kb21Db29yZGluYXRlcygpIHtcbiAgICBjb25zdCBwb3NzaWJsZVhWYWx1ZXMgPSBPYmplY3Qua2V5cyh1bnVzZWRDb29yZGluYXRlc09iaik7XG4gICAgY29uc3QgeCA9XG4gICAgICBwb3NzaWJsZVhWYWx1ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVYVmFsdWVzLmxlbmd0aCldO1xuICAgIGNvbnN0IHBvc3NpYmxlWVZhbHVlcyA9IHVudXNlZENvb3JkaW5hdGVzT2JqW3hdO1xuICAgIGNvbnN0IHkgPVxuICAgICAgcG9zc2libGVZVmFsdWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlWVZhbHVlcy5sZW5ndGgpXTtcblxuICAgIHVudXNlZENvb3JkaW5hdGVzT2JqW3hdID0gcmVtb3ZlRWxlbWVudEZyb21BcnJheShcbiAgICAgIHksXG4gICAgICB1bnVzZWRDb29yZGluYXRlc09ialt4XVxuICAgICk7XG4gICAgaWYgKHVudXNlZENvb3JkaW5hdGVzT2JqW3hdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVsZXRlIHVudXNlZENvb3JkaW5hdGVzT2JqW3hdO1xuICAgIH1cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVR1cm4oKSB7XG4gICAgY29uc3QgW3gsIHldID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gIH1cblxuICByZXR1cm4geyB1bnVzZWRDb29yZGluYXRlc09iaiwgbWFrZVR1cm4gfTtcbn1cbiIsImltcG9ydCB7IEJPQVJEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmZ1bmN0aW9uIGdldEFycmF5T2ZTYW1lVmFsdWVzKHNpemUsIHZhbHVlKSB7XG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgYXJyYXkucHVzaChbXSk7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgIGFycmF5W2ldLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBjbGFzcyBHYW1lYm9hcmQge1xuICBoaXRDZWxsc0JvYXJkQXJyYXkgPSBnZXRBcnJheU9mU2FtZVZhbHVlcyhCT0FSRF9TSVpFLCBmYWxzZSk7XG4gIHNoaXBzT25Cb2FyZEFycmF5ID0gZ2V0QXJyYXlPZlNhbWVWYWx1ZXMoQk9BUkRfU0laRSwgbnVsbCk7XG4gIGxpc3RPZlNoaXBzID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGlzUGxhY2VtZW50TGVnYWwoeyBzaGlwT2JqLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICF0aGlzLiNhcmVTdGFydENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoc3RhcnRYLCBzdGFydFkpICYmXG4gICAgICAhdGhpcy4jYXJlRW5kQ29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh7XG4gICAgICAgIHNoaXBMZW5ndGg6IHNoaXBPYmoubGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgIH0pICYmXG4gICAgICAhdGhpcy4jaXNGaWxsZWRQYXRoKHtcbiAgICAgICAgcGF0aExlbmd0aDogc2hpcE9iai5sZW5ndGgsXG4gICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgIHN0YXJ0WCxcbiAgICAgICAgc3RhcnRZLFxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcmVtb3ZlKHsgaWQsIGlzVmVydGljYWwsIGxlbmd0aCwgc3RhcnRYLCBzdGFydFkgfSkge1xuICAgIGNvbnN0IFthY3R1YWxTdGFydFgsIGFjdHVhbFN0YXJ0WV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKFxuICAgICAgc3RhcnRYLFxuICAgICAgc3RhcnRZXG4gICAgKTtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgZm9yIChsZXQgY3VycmVudFkgPSAwOyBjdXJyZW50WSA8IGxlbmd0aDsgY3VycmVudFkrKykge1xuICAgICAgICB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WSAtIGN1cnJlbnRZXVthY3R1YWxTdGFydFhdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgY3VycmVudFggPSAwOyBjdXJyZW50WCA8IGxlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WV1bYWN0dWFsU3RhcnRYICsgY3VycmVudFhdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy4jcmVtb3ZlU2hpcEZyb21MaXN0T2ZQbGFjZWRTaGlwcyhpZCk7XG4gIH1cblxuICBwbGFjZSh7IHNoaXBPYmosIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBpZiAoIXRoaXMuaXNQbGFjZW1lbnRMZWdhbCh7IHNoaXBPYmosIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBjb29yZGluYXRlcyBhcmUgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ2FtZWJvYXJkXCIpO1xuICAgIH1cblxuICAgIFtzdGFydFgsIHN0YXJ0WV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHN0YXJ0WCwgc3RhcnRZKTtcblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WSA9IDA7IGN1cnJlbnRZIDwgc2hpcE9iai5sZW5ndGg7IGN1cnJlbnRZKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVtzdGFydFkgLSBjdXJyZW50WV1bc3RhcnRYXSA9IHNoaXBPYmo7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRYID0gMDsgY3VycmVudFggPCBzaGlwT2JqLmxlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W3N0YXJ0WV1bc3RhcnRYICsgY3VycmVudFhdID0gc2hpcE9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiNhZGRTaGlwVG9MaXN0T2ZTaGlwcyhzaGlwT2JqKTtcbiAgfVxuXG4gIGlzU2hpcFBsYWNlZE9uQ29vcmRpbmF0ZXMoeCwgeSkge1xuICAgIGNvbnN0IFthY3R1YWxYLCBhY3R1YWxZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoeCwgeSk7XG4gICAgcmV0dXJuICEhdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxZXVthY3R1YWxYXTtcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgIGlmICh0aGlzLiNhcmVTdGFydENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoeCwgeSkgfHwgdGhpcy4jaXNIaXQoeCwgeSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdpdmVuIGNvb3JkaW5hdGVzIGFyZSBvdXQgb2YgYm91bmRzIG9mIHRoZSBnYW1lYm9hcmRcIik7XG4gICAgfVxuICAgIGNvbnN0IFthY3R1YWxYLCBhY3R1YWxZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoeCwgeSk7XG4gICAgdGhpcy5oaXRDZWxsc0JvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF0gPSB0cnVlO1xuXG4gICAgY29uc3QgaGl0U2hpcCA9IHRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gICAgaWYgKGhpdFNoaXApIHtcbiAgICAgIGhpdFNoaXAuaGl0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFyZUFsbFNoaXBzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0T2ZTaGlwcy5ldmVyeSgoc2hpcE9iaikgPT4ge1xuICAgICAgcmV0dXJuIHNoaXBPYmouaXNTdW5rO1xuICAgIH0pO1xuICB9XG5cbiAgI3JlbW92ZVNoaXBGcm9tTGlzdE9mUGxhY2VkU2hpcHMoaWQpIHtcbiAgICB0aGlzLmxpc3RPZlNoaXBzID0gdGhpcy5saXN0T2ZTaGlwcy5maWx0ZXIoKHNoaXApID0+IHNoaXAuaWQgIT0gaWQpO1xuICB9XG5cbiAgI2lzSGl0KHgsIHkpIHtcbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHJldHVybiB0aGlzLmhpdENlbGxzQm9hcmRBcnJheVthY3R1YWxZXVthY3R1YWxYXTtcbiAgfVxuXG4gICNpc0ZpbGxlZFBhdGgoeyBwYXRoTGVuZ3RoLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgY29uc3QgW2FjdHVhbFN0YXJ0WCwgYWN0dWFsU3RhcnRZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoXG4gICAgICBzdGFydFgsXG4gICAgICBzdGFydFlcbiAgICApO1xuXG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRZID0gMDsgY3VycmVudFkgPCBwYXRoTGVuZ3RoOyBjdXJyZW50WSsrKSB7XG4gICAgICAgIGlmICghIXRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsU3RhcnRZIC0gY3VycmVudFldW2FjdHVhbFN0YXJ0WF0pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WCA9IDA7IGN1cnJlbnRYIDwgcGF0aExlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICBpZiAoISF0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WV1bYWN0dWFsU3RhcnRYICsgY3VycmVudFhdKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAjYWRkU2hpcFRvTGlzdE9mU2hpcHMoc2hpcE9iaikge1xuICAgIHRoaXMubGlzdE9mU2hpcHMucHVzaChzaGlwT2JqKTtcbiAgfVxuXG4gICNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpIHtcbiAgICByZXR1cm4gW3ggLSAxLCB5IC0gMV07XG4gIH1cblxuICAjYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHgsIHkpIHtcbiAgICByZXR1cm4geCA8IDAgfHwgeSA8IDAgfHwgeCA+IEJPQVJEX1NJWkUgfHwgeSA+IEJPQVJEX1NJWkU7XG4gIH1cblxuICAjYXJlRW5kQ29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh7IHNoaXBMZW5ndGgsIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgY29uc3QgZW5kWSA9IHN0YXJ0WSAtIHNoaXBMZW5ndGg7XG4gICAgICByZXR1cm4gZW5kWSA8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyBzaGlwTGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiBlbmRYID4gQk9BUkRfU0laRTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBDb21wdXRlclBsYXllciB9IGZyb20gXCIuL2NvbXB1dGVyXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5pbXBvcnQgeyBTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG5cbmNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIocGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQpO1xuY29uc3QgY29tcHV0ZXIgPSBDb21wdXRlclBsYXllcihjb21wdXRlckJvYXJkLCBwbGF5ZXJCb2FyZCk7XG5cbmZ1bmN0aW9uIHJlbW92ZVNoaXBVSUZyb21Cb2FyZChzaGlwT2JqKSB7XG4gIGNvbnNvbGUubG9nKFwiUmVtb3ZhbFwiKTtcbiAgcGxheWVyQm9hcmQucmVtb3ZlKHtcbiAgICBpZDogc2hpcE9iai5pZCxcbiAgICBzVmVydGljYWw6IHNoaXBPYmouaXNWZXJ0aWNhbCxcbiAgICBsZW5ndGg6IHNoaXBPYmoubGVuZ3RoLFxuICAgIHN0YXJ0WDogc2hpcE9iai5zdGFydFgsXG4gICAgc3RhcnRZOiBzaGlwT2JqLnN0YXJ0WSxcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb2VzU2hpcENyb3NzQW55U2hpcHModGlsZXNVbmRlclNoaXApIHtcbiAgcmV0dXJuIHRpbGVzVW5kZXJTaGlwLnNvbWUoKHRpbGVVaSkgPT5cbiAgICBwbGF5ZXJCb2FyZC5pc1NoaXBQbGFjZWRPbkNvb3JkaW5hdGVzKHRpbGVVaS54LCB0aWxlVWkueSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwVUlPbkJvYXJkKHNoaXBPYmopIHtcbiAgY29uc3QgZ2FtZXBsYXlTaGlwID0gbmV3IFNoaXAoc2hpcE9iai5sZW5ndGgsIHNoaXBPYmouaWQpO1xuICBwbGF5ZXJCb2FyZC5wbGFjZSh7XG4gICAgc2hpcE9iajogZ2FtZXBsYXlTaGlwLFxuICAgIGlzVmVydGljYWw6IGZhbHNlLFxuICAgIHN0YXJ0WDogc2hpcE9iai5zdGFydFgsXG4gICAgc3RhcnRZOiBzaGlwT2JqLnN0YXJ0WSxcbiAgfSk7XG4gIGNvbnNvbGUubG9nKHBsYXllckJvYXJkKTtcbn1cblxuUHViU3ViLm9uKFwicGxhY2VTaGlwVUlPbkJvYXJkXCIsIHBsYWNlU2hpcFVJT25Cb2FyZCk7XG5QdWJTdWIub24oXCJyZW1vdmVTaGlwRnJvbUJvYXJkXCIsIHJlbW92ZVNoaXBVSUZyb21Cb2FyZCk7XG4iLCJleHBvcnQgZnVuY3Rpb24gUGxheWVyKGJvYXJkLCBlbmVteUJvYXJkKSB7XG4gIGNvbnN0IHRha2VUdXJuID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICB0cnkge1xuICAgICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiWW91ciBtb3ZlIGlzIGlsbGVnYWwhIFRyeSBoaXR0aW5nIGFub3RoZXIgY2VsbC5cIik7XG4gICAgfVxuICB9O1xuICByZXR1cm4geyB0YWtlVHVybiB9O1xufVxuIiwiZXhwb3J0IGNsYXNzIFNoaXAge1xuICB0aW1lc0hpdCA9IDA7XG5cbiAgY29uc3RydWN0b3IobGVuZ3RoLCBpZCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLnRpbWVzSGl0Kys7XG4gIH1cblxuICBnZXQgaXNTdW5rKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVzSGl0ID49IHRoaXMubGVuZ3RoO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBTSElQX1BMQUNFTUVOVF9PTl9USUxFX1hfT0ZGU0VULFxuICBTSElQX1BMQUNFTUVOVF9PTl9USUxFX1lfT0ZGU0VULFxuICBUSUxFX1NJWkVfUFgsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4vUHViU3ViXCI7XG5pbXBvcnQgeyBTSElQX1dJRFRIX0NPRUZGSUNJRU5ULCBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0VGlsZXNVbmRlclNoaXAgfSBmcm9tIFwiLi90aWxlVUlcIjtcbmltcG9ydCB7IGRvZXNTaGlwQ3Jvc3NBbnlTaGlwcyB9IGZyb20gXCIuL2dhbWVwbGF5L2dhbWVwbGF5LW9iamVjdHMtaGFuZGxlclwiO1xuZXhwb3J0IGNsYXNzIFNoaXBVSSB7XG4gIHN0YXRpYyBtb3ZhYmxlU2hpcCA9IG51bGw7XG4gIHN0YXRpYyBhbGxTaGlwcyA9IFtdO1xuICBzdGF0aWMgdXNlZElEcyA9IFtdO1xuICBzdGF0aWMgSURfTUFYX1NJWkUgPSAyO1xuICBvbkJvYXJkID0gZmFsc2U7XG4gIG9mZnNldFggPSAwO1xuICBvZmZzZXRZID0gMDtcbiAgc3RhcnRYID0gbnVsbDtcbiAgc3RhcnRZID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihzaGlwRWxlbWVudCwgbGVuZ3RoLCBpc1JvdGF0ZWQpIHtcbiAgICBTaGlwVUkuYWxsU2hpcHMucHVzaCh0aGlzKTtcbiAgICBjb25zdCBJRCA9IFNoaXBVSS4jZ2VuZXJhdGVTaGlwSUQoKTtcbiAgICB0aGlzLmlkID0gSUQ7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XG5cbiAgICB0aGlzLnNoaXBFbGVtZW50ID0gc2hpcEVsZW1lbnQ7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5pZCA9IElEO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRvY2stc2hpcFwiKTtcbiAgICB0aGlzLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoYGxlbmd0aC0ke2xlbmd0aH1gKTtcbiAgICBpZiAoaXNSb3RhdGVkKSB7XG4gICAgICB0aGlzLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJyb3RhdGVkXCIpO1xuICAgIH1cbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLndpZHRoID1cbiAgICAgIGxlbmd0aCAqIFRJTEVfU0laRV9QWCArIFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgKyBcInB4XCI7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5oZWlnaHQgPVxuICAgICAgVElMRV9TSVpFX1BYICsgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgKyBcInB4XCI7XG5cbiAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB0aGlzLm9yaWdpblkgPSByZWN0LnRvcDtcbiAgICB0aGlzLm9yaWdpblggPSByZWN0LmxlZnQ7XG5cbiAgICBzaGlwRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICBTaGlwVUkubW92YWJsZVNoaXAgPSB0aGlzO1xuXG4gICAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMub2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgdGhpcy5vZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgY29uc29sZS5sb2coZS5jbGllbnRZLCByZWN0LnRvcCwgdGhpcy5vZmZzZXRZKTtcbiAgICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgI2dlbmVyYXRlU2hpcElEKCkge1xuICAgIGxldCBpZCA9IG51bGw7XG4gICAgZG8ge1xuICAgICAgaWQgPSBwYXJzZUludChNYXRoLnJhbmRvbSgpICogMTAgKiogU2hpcFVJLklEX01BWF9TSVpFKTtcbiAgICB9IHdoaWxlIChTaGlwVUkudXNlZElEcy5pbmNsdWRlcyhpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1NoaXBQb3NpdGlvbkxlZ2FsKFNoaXBVSSwgdGlsZXNVbmRlclNoaXApIHtcbiAgY29uc3QgaXNTaGlwT3ZlckFueVRpbGVzID0gdGlsZXNVbmRlclNoaXAubGVuZ3RoID4gMDtcbiAgY29uc3QgaXNTaGlwT3V0T2ZCb3VuZHMgPSB0aWxlc1VuZGVyU2hpcC5sZW5ndGggIT09IFNoaXBVSS5tb3ZhYmxlU2hpcC5sZW5ndGg7XG4gIHJldHVybiAoXG4gICAgaXNTaGlwT3ZlckFueVRpbGVzICYmXG4gICAgIWRvZXNTaGlwQ3Jvc3NBbnlTaGlwcyh0aWxlc1VuZGVyU2hpcCkgJiZcbiAgICAhaXNTaGlwT3V0T2ZCb3VuZHNcbiAgKTtcbn1cblxuZnVuY3Rpb24gc2V0U2hpcFN0YXJ0Q29vcmRpbmF0ZXMoc2hpcFVJLCB0aWxlc1VuZGVyU2hpcCkge1xuICBzaGlwVUkuc3RhcnRYID0gdGlsZXNVbmRlclNoaXBbMF0ueDtcbiAgc2hpcFVJLnN0YXJ0WSA9IHRpbGVzVW5kZXJTaGlwWzBdLnk7XG59XG5cbmZ1bmN0aW9uIHNldFNoaXBPcmlnaW5Ub1RpbGUoc2hpcFVJLCB0aWxlVUkpIHtcbiAgY29uc3QgdGlsZVJlY3QgPSB0aWxlVUkudGlsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHNoaXBVSS5vcmlnaW5ZID1cbiAgICB0aWxlUmVjdC50b3AgK1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgK1xuICAgIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWV9PRkZTRVQ7XG4gIHNoaXBVSS5vcmlnaW5YID0gdGlsZVJlY3QubGVmdCArIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQ7XG59XG5cbmZ1bmN0aW9uIG1vdmUoZSwgc2hpcCkge1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IGUucGFnZVkgLSBzaGlwLm9mZnNldFkgKyBcInB4XCI7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUubGVmdCA9IGUucGFnZVggLSBzaGlwLm9mZnNldFggKyBcInB4XCI7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KHNoaXAsIGlzU2hpcFBvc2l0aW9uTGVnYWwpIHtcbiAgaWYgKCFpc1NoaXBQb3NpdGlvbkxlZ2FsKSB7XG4gICAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwic3RhdGljXCI7XG4gIH0gZWxzZSB7XG4gICAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS50b3AgPSBTaGlwVUkubW92YWJsZVNoaXAub3JpZ2luWSArIFwicHhcIjtcbiAgICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLmxlZnQgPSBTaGlwVUkubW92YWJsZVNoaXAub3JpZ2luWCArIFwicHhcIjtcbiAgfVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PiB7XG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcbiAgICBtb3ZlKGUsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgUHViU3ViLmVtaXQoXCJzaGlwSXNNb3ZpbmdcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgaWYgKFNoaXBVSS5tb3ZhYmxlU2hpcCkge1xuICAgIFB1YlN1Yi5lbWl0KFwibm9TaGlwTW92ZW1lbnRcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgICBjb25zdCB0aWxlc1VuZGVyU2hpcCA9IGdldFRpbGVzVW5kZXJTaGlwKFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgY29uc3QgbWF5QmVQbGFjZWRPbkJvYXJkID0gaXNTaGlwUG9zaXRpb25MZWdhbChTaGlwVUksIHRpbGVzVW5kZXJTaGlwKTtcblxuICAgIGlmIChTaGlwVUkubW92YWJsZVNoaXAub25Cb2FyZCkge1xuICAgICAgUHViU3ViLmVtaXQoXCJyZW1vdmVTaGlwRnJvbUJvYXJkXCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgICBTaGlwVUkubW92YWJsZVNoaXAub25Cb2FyZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAobWF5QmVQbGFjZWRPbkJvYXJkKSB7XG4gICAgICBzZXRTaGlwU3RhcnRDb29yZGluYXRlcyhTaGlwVUkubW92YWJsZVNoaXAsIHRpbGVzVW5kZXJTaGlwKTtcbiAgICAgIHNldFNoaXBPcmlnaW5Ub1RpbGUoU2hpcFVJLm1vdmFibGVTaGlwLCB0aWxlc1VuZGVyU2hpcFswXSk7XG4gICAgICBTaGlwVUkubW92YWJsZVNoaXAub25Cb2FyZCA9IHRydWU7XG5cbiAgICAgIFB1YlN1Yi5lbWl0KFwicGxhY2VTaGlwVUlPbkJvYXJkXCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIlN1Y2ggc2hpcCBwbGFjZW1lbnQgaXMgaWxsZWdhbFwiKTtcbiAgICB9XG5cbiAgICByZXNldChTaGlwVUkubW92YWJsZVNoaXAsIG1heUJlUGxhY2VkT25Cb2FyZCk7XG4gICAgU2hpcFVJLm1vdmFibGVTaGlwID0gbnVsbDtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBUSUxFX1NJWkVfUFggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xuaW1wb3J0IHsgZW5lbXlHcmlkIH0gZnJvbSBcIi4vdXRpbGl0aWVzL2dyaWQtaGFuZGxlclwiO1xuXG5mdW5jdGlvbiB0aWxlQmVsb25nc1RvRW5lbXlHcmlkKHRpbGUsIGVuZW15R3JpZCkge1xuICByZXR1cm4gdGlsZS5wYXJlbnRFbGVtZW50ID09IGVuZW15R3JpZDtcbn1cblxuZnVuY3Rpb24gaXNTaGlwT3ZlclRpbGUodGlsZSwgc2hpcCwgbGVuZ3RoLCBpc1JvdGF0ZWQsIGJhc2VMZW5ndGgpIHtcbiAgaWYgKHRpbGVCZWxvbmdzVG9FbmVteUdyaWQodGlsZSwgZW5lbXlHcmlkKSkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCB0aWxlUmVjdCA9IHRpbGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHNoaXBSZWN0ID0gc2hpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZGlmZmVyZW5jZVRvcCA9IE1hdGguYWJzKHRpbGVSZWN0LnRvcCAtIHNoaXBSZWN0LnRvcCk7XG4gICAgY29uc3QgZGlmZmVyZW5jZUxlZnQgPSBNYXRoLmFicyh0aWxlUmVjdC5sZWZ0IC0gc2hpcFJlY3QubGVmdCk7XG4gICAgY29uc3QgZGlmZmVyZW5jZUJvdHRvbSA9IGlzUm90YXRlZFxuICAgICAgPyBNYXRoLmFicyh0aWxlUmVjdC5ib3R0b20gLSAoc2hpcFJlY3QuYm90dG9tIC0gYmFzZUxlbmd0aCAqIGkpKVxuICAgICAgOiBNYXRoLmFicyh0aWxlUmVjdC5ib3R0b20gLSBzaGlwUmVjdC5ib3R0b20pO1xuICAgIGNvbnN0IGRpZmZlcmVuY2VSaWdodCA9IGlzUm90YXRlZFxuICAgICAgPyBNYXRoLmFicyh0aWxlUmVjdC5yaWdodCAtIHNoaXBSZWN0LnJpZ2h0KVxuICAgICAgOiBNYXRoLmFicyh0aWxlUmVjdC5yaWdodCAtIChzaGlwUmVjdC5yaWdodCAtIGJhc2VMZW5ndGggKiBpKSk7XG5cbiAgICBpZiAoXG4gICAgICAoZGlmZmVyZW5jZVRvcCA8IHRpbGVSZWN0LmhlaWdodCAvIDIgfHxcbiAgICAgICAgZGlmZmVyZW5jZUxlZnQgPCB0aWxlUmVjdC53aWR0aCAvIDIpICYmXG4gICAgICBkaWZmZXJlbmNlQm90dG9tIDwgdGlsZVJlY3QuaGVpZ2h0IC8gMiAmJlxuICAgICAgZGlmZmVyZW5jZVJpZ2h0IDwgdGlsZVJlY3Qud2lkdGggLyAyICYmXG4gICAgICBkaWZmZXJlbmNlVG9wIDwgdGlsZVJlY3QuaGVpZ2h0IC8gMlxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGlsZXNVbmRlclNoaXAoc2hpcFVJKSB7XG4gIHJldHVybiBUaWxlVUkuYWxsVGlsZXMuZmlsdGVyKCh0aWxlVUkpID0+XG4gICAgaXNTaGlwT3ZlclRpbGUoXG4gICAgICB0aWxlVUkudGlsZUVsZW1lbnQsXG4gICAgICBzaGlwVUkuc2hpcEVsZW1lbnQsXG4gICAgICBzaGlwVUkubGVuZ3RoLFxuICAgICAgc2hpcFVJLmlzUm90YXRlZCxcbiAgICAgIFRJTEVfU0laRV9QWFxuICAgIClcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFRpbGVVSSB7XG4gIHN0YXRpYyBhbGxUaWxlcyA9IFtdO1xuICBjb25zdHJ1Y3Rvcih0aWxlRWxlbWVudCwgeCwgeSkge1xuICAgIFRpbGVVSS5hbGxUaWxlcy5wdXNoKHRoaXMpO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnRpbGVFbGVtZW50ID0gdGlsZUVsZW1lbnQ7XG4gICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGlsZVwiKTtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueCA9IHg7XG4gICAgdGhpcy50aWxlRWxlbWVudC5kYXRhc2V0LnkgPSB5O1xuICAgIHRoaXMudGlsZUVsZW1lbnQud2lkdGggPSBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG5cbiAgICBQdWJTdWIub24oXCJzaGlwSXNNb3ZpbmdcIiwgKHNoaXApID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgaXNTaGlwT3ZlclRpbGUoXG4gICAgICAgICAgdGhpcy50aWxlRWxlbWVudCxcbiAgICAgICAgICBzaGlwLnNoaXBFbGVtZW50LFxuICAgICAgICAgIHNoaXAubGVuZ3RoLFxuICAgICAgICAgIHNoaXAuaXNSb3RhdGVkLFxuICAgICAgICAgIFRJTEVfU0laRV9QWFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFB1YlN1Yi5vbihcIm5vU2hpcE1vdmVtZW50XCIsICgpID0+IHtcbiAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuaW1wb3J0IHsgU2hpcFVJIH0gZnJvbSBcIi4uL3NoaXBVSVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTaGlwVUkobGVuZ3RoLCByb3RhdGVkKSB7XG4gIGNvbnN0IHNoaXAgPSBuZXcgU2hpcFVJKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksIGxlbmd0aCwgcm90YXRlZCk7XG4gIHJldHVybiBzaGlwLnNoaXBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwdXNoU2hpcFRvRG9jayhzaGlwRWxlbWVudCkge1xuICBkb2NrLmFwcGVuZENoaWxkKHNoaXBFbGVtZW50KTtcbn1cblxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcblxuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgKCkgPT4ge1xuICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcblxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoNCwgdHJ1ZSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMywgZmFsc2UpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDMsIGZhbHNlKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyLCBmYWxzZSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMiwgZmFsc2UpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDIsIGZhbHNlKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxLCBmYWxzZSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSwgZmFsc2UpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDEsIGZhbHNlKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxLCBmYWxzZSkpO1xufSk7XG5cblB1YlN1Yi5vbihcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIiwgKCkgPT4ge1xuICBpZiAoZG9jay5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XG4gIH0gZWxzZSB7XG4gICAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xuICB9XG59KTtcbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcblxuY29uc3QgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTID0ge1xuICBzaGlwUGxhY2VtZW50QWZ0ZXJDbGljazogXCJTdGFydCBwbGFjaW5nIHNoaXBzXCIsXG4gIGdhbWVwbGF5QWZ0ZXJDbGljazogXCJTdGFydCBnYW1lXCIsXG59O1xuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xubWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9IE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5zaGlwUGxhY2VtZW50QWZ0ZXJDbGljaztcblxubWFpbkFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBzd2l0Y2ggKG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQpIHtcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5nYW1lcGxheUFmdGVyQ2xpY2s6IHtcbiAgICAgIFB1YlN1Yi5lbWl0KFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5zaGlwUGxhY2VtZW50QWZ0ZXJDbGljazoge1xuICAgICAgUHViU3ViLmVtaXQoXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiKTtcbiAgICAgIG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPVxuICAgICAgICBNQUlOX0FDVElPTl9CVVRUT05fTkFNRVMuZ2FtZXBsYXlBZnRlckNsaWNrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFRpbGVVSSB9IGZyb20gXCIuLi90aWxlVUlcIjtcbmltcG9ydCB7IEJPQVJEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5cbmV4cG9ydCBjb25zdCBbZW5lbXlHcmlkLCBwbGF5ZXJHcmlkXSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmlkXCIpO1xuZmlsbEdyaWRXaXRoQ2VsbHMoZW5lbXlHcmlkKTtcbmZpbGxHcmlkV2l0aENlbGxzKHBsYXllckdyaWQpO1xuc2V0R3JpZFRpbGVTaXplKGVuZW15R3JpZCk7XG5zZXRHcmlkVGlsZVNpemUocGxheWVyR3JpZCk7XG5cbmZ1bmN0aW9uIGZpbGxHcmlkV2l0aENlbGxzKGdyaWQpIHtcbiAgZm9yIChsZXQgeSA9IDA7IHkgPCBCT0FSRF9TSVpFOyB5KyspIHtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEJPQVJEX1NJWkU7IHgrKykge1xuICAgICAgY29uc3QgdGlsZSA9IG5ldyBUaWxlVUkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgeCArIDEsIHkgKyAxKTtcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQodGlsZS50aWxlRWxlbWVudCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEdyaWRUaWxlU2l6ZShncmlkKSB7XG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtcbiAgICBUSUxFX1NJWkVfUFggKyBcInB4XCJcbiAgfSlgO1xuICBncmlkLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7Qk9BUkRfU0laRX0sICR7VElMRV9TSVpFX1BYICsgXCJweFwifSlgO1xufVxuXG5mdW5jdGlvbiBncmV5T3V0RW5lbXlHcmlkKCkge1xuICBlbmVteUdyaWQuY2xhc3NMaXN0LmFkZChcImdyZXllZC1vdXRcIik7XG59XG5cblB1YlN1Yi5vbihcImZpbGxHcmlkV2l0aENlbGxzXCIsIGZpbGxHcmlkV2l0aENlbGxzKTtcblB1YlN1Yi5vbihcInNldEdyaWRUaWxlU2l6ZVwiLCBzZXRHcmlkVGlsZVNpemUpO1xuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgZ3JleU91dEVuZW15R3JpZCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vdXRpbGl0aWVzL2dyaWQtaGFuZGxlclwiO1xuaW1wb3J0IFwiLi9zaGlwVUlcIjtcbmltcG9ydCBcIi4vdGlsZVVJXCI7XG5pbXBvcnQgXCIuL3V0aWxpdGllcy9kb2NrLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vdXRpbGl0aWVzL2dhbWUtYnV0dG9uLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vZ2FtZXBsYXkvZ2FtZXBsYXktb2JqZWN0cy1oYW5kbGVyXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=