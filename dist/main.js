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
    // check every coordinate if there is a ship with such id
    // replace every single such cell with "null"
    const [actualStartX, actualStartY] = this.#convertBoardCoordsToArrayCoords(
      startX,
      startY
    );
    if (
      !this.#isEveryCellTakenByShipOfSuchID(
        id,
        isVertical,
        length,
        actualStartX,
        actualStartY
      )
    ) {
      console.error("Not all cells on the path have a ship with such id");
    } else {
      if (isVertical) {
        for (let currentY = 0; currentY < pathLength; currentY++) {
          this.shipsOnBoardArray[actualStartY - currentY][actualStartX] = null;
        }
      } else {
        for (let currentX = 0; currentX < pathLength; currentX++) {
          this.shipsOnBoardArray[actualStartY][actualStartX + currentX] = null;
        }
      }
    }
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

  #isEveryCellTakenByShipOfSuchID(id, isVertical, pathLength, startX, startY) {
    const [actualStartX, actualStartY] = this.#convertBoardCoordsToArrayCoords(
      startX,
      startY
    );

    if (isVertical) {
      for (let currentY = 0; currentY < pathLength; currentY++) {
        if (
          this.shipsOnBoardArray[actualStartY - currentY][actualStartX].id !==
          id
        ) {
          return false;
        }
      }
    } else {
      for (let currentX = 0; currentX < pathLength; currentX++) {
        if (
          this.shipsOnBoardArray[actualStartY][actualStartX + currentX].id !==
          id
        ) {
          return false;
        }
      }
    }

    return true;
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
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameplay/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/gameplay/player.js");
/* harmony import */ var _computer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computer */ "./src/gameplay/computer.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ship */ "./src/gameplay/ship.js");






const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();
const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();

const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player(playerBoard, computerBoard);
const computer = (0,_computer__WEBPACK_IMPORTED_MODULE_2__.ComputerPlayer)(computerBoard, playerBoard);

function placeShipUIOnBoard({ shipObj, x, y }) {
  const gameplayShip = new _ship__WEBPACK_IMPORTED_MODULE_4__.Ship(shipObj.length, shipObj.id);
  playerBoard.place({
    shipObj: gameplayShip,
    isVertical: false,
    startX: x,
    startY: y,
  });
  console.log(playerBoard);
}

_PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.on("checkIfShipCrossesAnyShips", (data) => {
  if (
    data.tilesUnderShip.every(
      (tileUi) => !playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
    )
  ) {
    _PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.emit("placementIsLegal", data.tilesUnderShip);
    placeShipUIOnBoard({
      shipObj: data.shipUI,
      x: data.x,
      y: data.y,
    });
  } else {
    _PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.emit("placementIsIllegal");
  }
});


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




class ShipUI {
  static movableShip = null;
  static allShips = [];
  static usedIDs = [];
  static ID_MAX_SIZE = 2;
  offsetX = 0;
  offsetY = 0;
  // tilesPlaced = [];

  constructor(shipElement, length) {
    ShipUI.allShips.push(this);
    const ID = ShipUI.#generateShipID();
    this.id = ID;
    this.length = length;

    this.shipElement = shipElement;
    this.shipElement.id = ID;
    this.shipElement.classList.add("dock-ship");
    this.shipElement.classList.add(`length-${length}`);
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

function reset(ship, isShipOverAnyTiles) {
  ship.shipElement.style.top = ShipUI.movableShip.originY + "px";
  ship.shipElement.style.left = ShipUI.movableShip.originX + "px";
  if (!isShipOverAnyTiles) {
    ship.shipElement.style.position = "static";
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
    const isShipOverAnyTiles = tilesUnderShip.length > 0;
    const isShipOutOfBounds =
      tilesUnderShip.length !== ShipUI.movableShip.length;
    const isShipPositionLegal = isShipOverAnyTiles && !isShipOutOfBounds;

    if (isShipPositionLegal) {
      _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("checkIfShipCrossesAnyShips", {
        tilesUnderShip,
        x: tilesUnderShip[0].x,
        y: tilesUnderShip[0].y,
        shipUI: ShipUI.movableShip,
      });
    } else {
      _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("placementIsIllegal");
    }

    reset(ShipUI.movableShip, isShipPositionLegal);
    ShipUI.movableShip = null;
  }
});

_PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("placementIsLegal", (tilesUnderShip) => {
  setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
});

_PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("placementIsIllegal", () => {
  console.warn("Such ship placement is illegal");
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



function shipIsOverTile(tile, ship, length, isRotated, baseLength) {
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
    shipIsOverTile(
      tileUI.tileElement,
      shipUI.shipElement,
      shipUI.length,
      false,
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
        shipIsOverTile(
          this.tileElement,
          ship.shipElement,
          ship.length,
          false,
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



function createShipUI(length) {
  const ship = new _shipUI__WEBPACK_IMPORTED_MODULE_1__.ShipUI(document.createElement("div"), length);
  return ship.shipElement;
}

function pushShipToDock(shipElement) {
  dock.appendChild(shipElement);
}

const dock = document.querySelector(".dock");

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipToDock(createShipUI(4));
  pushShipToDock(createShipUI(3));
  pushShipToDock(createShipUI(3));
  pushShipToDock(createShipUI(2));
  pushShipToDock(createShipUI(2));
  pushShipToDock(createShipUI(2));
  pushShipToDock(createShipUI(1));
  pushShipToDock(createShipUI(1));
  pushShipToDock(createShipUI(1));
  pushShipToDock(createShipUI(1));
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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tileUI */ "./src/tileUI.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");





const [gridLeft, gridRight] = document.getElementsByClassName("grid");
fillGridWithCells(gridLeft);
fillGridWithCells(gridRight);
setGridTileSize(gridLeft);
setGridTileSize(gridRight);

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

_PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on("fillGridWithCells", fillGridWithCells);
_PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on("setGridTileSize", setGridTileSize);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3BDa0M7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QjJDO0FBQ1Q7QUFDTztBQUNQOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLElBQUksa0RBQVUsRUFBRTtBQUNsQyxvQkFBb0IsSUFBSSxrREFBVSxFQUFFO0FBQ3BDLHVCQUF1QiwyQ0FBTTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxrREFBVSxDQUFDO0FBQ3hELElBQUksb0RBQVk7QUFDaEIsR0FBRztBQUNILDBDQUEwQyxrREFBVSxDQUFDLElBQUksb0RBQVksUUFBUTtBQUM3RTs7QUFFQSwyQ0FBTTtBQUNOLDJDQUFNOzs7Ozs7O1VDNUJOO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNoQjtBQUNBO0FBQ2dCO0FBQ087QUFDSSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dhbWVwbGF5L2dhbWVwbGF5LW9iamVjdHMtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9nYW1lcGxheS9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9zaGlwVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdGlsZVVJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3V0aWxpdGllcy9kb2NrLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2dhbWUtYnV0dG9uLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2dyaWQtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBQdWJTdWIgPSAoKCkgPT4ge1xuICBjb25zdCBFVkVOVFMgPSB7fTtcblxuICBmdW5jdGlvbiBvbihldmVudE5hbWUsIGZuKSB7XG4gICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBFVkVOVFNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9mZihldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XG4gICAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdLmZpbHRlcihcbiAgICAgICAgKGN1cnJlbnRGbikgPT4gY3VycmVudEZuICE9IGZuXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgY29uc29sZS5sb2coZXZlbnROYW1lICsgXCIgRVZFTlQgV0FTIENBTExFRFwiKTtcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdLmZvckVhY2goKGZuKSA9PiB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgb24sIG9mZiwgZW1pdCB9O1xufSkoKTtcbiIsImV4cG9ydCBjb25zdCBUSUxFX1NJWkVfUFggPSA1MDtcbmV4cG9ydCBjb25zdCBCT0FSRF9TSVpFID0gMTA7XG5leHBvcnQgY29uc3QgU0hJUF9QTEFDRU1FTlRfT05fVElMRV9ZX09GRlNFVCA9IFRJTEVfU0laRV9QWCAvIDEwO1xuZXhwb3J0IGNvbnN0IFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQgPSBUSUxFX1NJWkVfUFggLyAxMDtcblxuLy8gc2hpcCBzZXR0aW5nc1xuZXhwb3J0IGNvbnN0IFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UID0gLTEwO1xuZXhwb3J0IGNvbnN0IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgPSAtMTA7XG4iLCJpbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29tcHV0ZXJQbGF5ZXIoY29tcHV0ZXJCb2FyZCwgZW5lbXlCb2FyZCkge1xuICBjb25zdCB1bnVzZWRDb29yZGluYXRlc09iaiA9ICgoKSA9PiB7XG4gICAgY29uc3QgdW51c2VkQ29vcmRpbmF0ZXNPYmogPSB7fTtcbiAgICBjb25zdCB5Q29vcmRpbmF0ZXNJbk9uZUNvbHVtbiA9IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMF07XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBCT0FSRF9TSVpFOyBpKyspIHtcbiAgICAgIHVudXNlZENvb3JkaW5hdGVzT2JqW2ldID0gWy4uLnlDb29yZGluYXRlc0luT25lQ29sdW1uXTtcbiAgICB9XG4gICAgcmV0dXJuIHVudXNlZENvb3JkaW5hdGVzT2JqO1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnRGcm9tQXJyYXkodmFsdWUsIGFycmF5KSB7XG4gICAgY29uc3QgYXJyYXlDb3B5ID0gWy4uLmFycmF5XTtcbiAgICBjb25zdCBpbmRleE9mVmFsdWUgPSBhcnJheUNvcHkuaW5kZXhPZih2YWx1ZSk7XG4gICAgYXJyYXlDb3B5LnNwbGljZShpbmRleE9mVmFsdWUsIDEpO1xuICAgIHJldHVybiBhcnJheUNvcHk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSYW5kb21Db29yZGluYXRlcygpIHtcbiAgICBjb25zdCBwb3NzaWJsZVhWYWx1ZXMgPSBPYmplY3Qua2V5cyh1bnVzZWRDb29yZGluYXRlc09iaik7XG4gICAgY29uc3QgeCA9XG4gICAgICBwb3NzaWJsZVhWYWx1ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVYVmFsdWVzLmxlbmd0aCldO1xuICAgIGNvbnN0IHBvc3NpYmxlWVZhbHVlcyA9IHVudXNlZENvb3JkaW5hdGVzT2JqW3hdO1xuICAgIGNvbnN0IHkgPVxuICAgICAgcG9zc2libGVZVmFsdWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlWVZhbHVlcy5sZW5ndGgpXTtcblxuICAgIHVudXNlZENvb3JkaW5hdGVzT2JqW3hdID0gcmVtb3ZlRWxlbWVudEZyb21BcnJheShcbiAgICAgIHksXG4gICAgICB1bnVzZWRDb29yZGluYXRlc09ialt4XVxuICAgICk7XG4gICAgaWYgKHVudXNlZENvb3JkaW5hdGVzT2JqW3hdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVsZXRlIHVudXNlZENvb3JkaW5hdGVzT2JqW3hdO1xuICAgIH1cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVR1cm4oKSB7XG4gICAgY29uc3QgW3gsIHldID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gIH1cblxuICByZXR1cm4geyB1bnVzZWRDb29yZGluYXRlc09iaiwgbWFrZVR1cm4gfTtcbn1cbiIsImltcG9ydCB7IEJPQVJEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmZ1bmN0aW9uIGdldEFycmF5T2ZTYW1lVmFsdWVzKHNpemUsIHZhbHVlKSB7XG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgYXJyYXkucHVzaChbXSk7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgIGFycmF5W2ldLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBjbGFzcyBHYW1lYm9hcmQge1xuICBoaXRDZWxsc0JvYXJkQXJyYXkgPSBnZXRBcnJheU9mU2FtZVZhbHVlcyhCT0FSRF9TSVpFLCBmYWxzZSk7XG4gIHNoaXBzT25Cb2FyZEFycmF5ID0gZ2V0QXJyYXlPZlNhbWVWYWx1ZXMoQk9BUkRfU0laRSwgbnVsbCk7XG4gIGxpc3RPZlNoaXBzID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGlzUGxhY2VtZW50TGVnYWwoeyBzaGlwT2JqLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICF0aGlzLiNhcmVTdGFydENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoc3RhcnRYLCBzdGFydFkpICYmXG4gICAgICAhdGhpcy4jYXJlRW5kQ29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh7XG4gICAgICAgIHNoaXBMZW5ndGg6IHNoaXBPYmoubGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgIH0pICYmXG4gICAgICAhdGhpcy4jaXNGaWxsZWRQYXRoKHtcbiAgICAgICAgcGF0aExlbmd0aDogc2hpcE9iai5sZW5ndGgsXG4gICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgIHN0YXJ0WCxcbiAgICAgICAgc3RhcnRZLFxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcmVtb3ZlKHsgaWQsIGlzVmVydGljYWwsIGxlbmd0aCwgc3RhcnRYLCBzdGFydFkgfSkge1xuICAgIC8vIGNoZWNrIGV2ZXJ5IGNvb3JkaW5hdGUgaWYgdGhlcmUgaXMgYSBzaGlwIHdpdGggc3VjaCBpZFxuICAgIC8vIHJlcGxhY2UgZXZlcnkgc2luZ2xlIHN1Y2ggY2VsbCB3aXRoIFwibnVsbFwiXG4gICAgY29uc3QgW2FjdHVhbFN0YXJ0WCwgYWN0dWFsU3RhcnRZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoXG4gICAgICBzdGFydFgsXG4gICAgICBzdGFydFlcbiAgICApO1xuICAgIGlmIChcbiAgICAgICF0aGlzLiNpc0V2ZXJ5Q2VsbFRha2VuQnlTaGlwT2ZTdWNoSUQoXG4gICAgICAgIGlkLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICBsZW5ndGgsXG4gICAgICAgIGFjdHVhbFN0YXJ0WCxcbiAgICAgICAgYWN0dWFsU3RhcnRZXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTm90IGFsbCBjZWxscyBvbiB0aGUgcGF0aCBoYXZlIGEgc2hpcCB3aXRoIHN1Y2ggaWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICAgIGZvciAobGV0IGN1cnJlbnRZID0gMDsgY3VycmVudFkgPCBwYXRoTGVuZ3RoOyBjdXJyZW50WSsrKSB7XG4gICAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxTdGFydFkgLSBjdXJyZW50WV1bYWN0dWFsU3RhcnRYXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGN1cnJlbnRYID0gMDsgY3VycmVudFggPCBwYXRoTGVuZ3RoOyBjdXJyZW50WCsrKSB7XG4gICAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxTdGFydFldW2FjdHVhbFN0YXJ0WCArIGN1cnJlbnRYXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwbGFjZSh7IHNoaXBPYmosIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBpZiAoIXRoaXMuaXNQbGFjZW1lbnRMZWdhbCh7IHNoaXBPYmosIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBjb29yZGluYXRlcyBhcmUgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ2FtZWJvYXJkXCIpO1xuICAgIH1cblxuICAgIFtzdGFydFgsIHN0YXJ0WV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHN0YXJ0WCwgc3RhcnRZKTtcblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WSA9IDA7IGN1cnJlbnRZIDwgc2hpcE9iai5sZW5ndGg7IGN1cnJlbnRZKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVtzdGFydFkgLSBjdXJyZW50WV1bc3RhcnRYXSA9IHNoaXBPYmo7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRYID0gMDsgY3VycmVudFggPCBzaGlwT2JqLmxlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W3N0YXJ0WV1bc3RhcnRYICsgY3VycmVudFhdID0gc2hpcE9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiNhZGRTaGlwVG9MaXN0T2ZTaGlwcyhzaGlwT2JqKTtcbiAgfVxuXG4gIGlzU2hpcFBsYWNlZE9uQ29vcmRpbmF0ZXMoeCwgeSkge1xuICAgIGNvbnN0IFthY3R1YWxYLCBhY3R1YWxZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoeCwgeSk7XG4gICAgcmV0dXJuICEhdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxZXVthY3R1YWxYXTtcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgIGlmICh0aGlzLiNhcmVTdGFydENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoeCwgeSkgfHwgdGhpcy4jaXNIaXQoeCwgeSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdpdmVuIGNvb3JkaW5hdGVzIGFyZSBvdXQgb2YgYm91bmRzIG9mIHRoZSBnYW1lYm9hcmRcIik7XG4gICAgfVxuICAgIGNvbnN0IFthY3R1YWxYLCBhY3R1YWxZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoeCwgeSk7XG4gICAgdGhpcy5oaXRDZWxsc0JvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF0gPSB0cnVlO1xuXG4gICAgY29uc3QgaGl0U2hpcCA9IHRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gICAgaWYgKGhpdFNoaXApIHtcbiAgICAgIGhpdFNoaXAuaGl0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFyZUFsbFNoaXBzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0T2ZTaGlwcy5ldmVyeSgoc2hpcE9iaikgPT4ge1xuICAgICAgcmV0dXJuIHNoaXBPYmouaXNTdW5rO1xuICAgIH0pO1xuICB9XG5cbiAgI2lzRXZlcnlDZWxsVGFrZW5CeVNoaXBPZlN1Y2hJRChpZCwgaXNWZXJ0aWNhbCwgcGF0aExlbmd0aCwgc3RhcnRYLCBzdGFydFkpIHtcbiAgICBjb25zdCBbYWN0dWFsU3RhcnRYLCBhY3R1YWxTdGFydFldID0gdGhpcy4jY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3JkcyhcbiAgICAgIHN0YXJ0WCxcbiAgICAgIHN0YXJ0WVxuICAgICk7XG5cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgZm9yIChsZXQgY3VycmVudFkgPSAwOyBjdXJyZW50WSA8IHBhdGhMZW5ndGg7IGN1cnJlbnRZKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsU3RhcnRZIC0gY3VycmVudFldW2FjdHVhbFN0YXJ0WF0uaWQgIT09XG4gICAgICAgICAgaWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRYID0gMDsgY3VycmVudFggPCBwYXRoTGVuZ3RoOyBjdXJyZW50WCsrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WV1bYWN0dWFsU3RhcnRYICsgY3VycmVudFhdLmlkICE9PVxuICAgICAgICAgIGlkXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgI2lzSGl0KHgsIHkpIHtcbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHJldHVybiB0aGlzLmhpdENlbGxzQm9hcmRBcnJheVthY3R1YWxZXVthY3R1YWxYXTtcbiAgfVxuXG4gICNpc0ZpbGxlZFBhdGgoeyBwYXRoTGVuZ3RoLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgY29uc3QgW2FjdHVhbFN0YXJ0WCwgYWN0dWFsU3RhcnRZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoXG4gICAgICBzdGFydFgsXG4gICAgICBzdGFydFlcbiAgICApO1xuXG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRZID0gMDsgY3VycmVudFkgPCBwYXRoTGVuZ3RoOyBjdXJyZW50WSsrKSB7XG4gICAgICAgIGlmICghIXRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsU3RhcnRZIC0gY3VycmVudFldW2FjdHVhbFN0YXJ0WF0pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WCA9IDA7IGN1cnJlbnRYIDwgcGF0aExlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICBpZiAoISF0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WV1bYWN0dWFsU3RhcnRYICsgY3VycmVudFhdKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAjYWRkU2hpcFRvTGlzdE9mU2hpcHMoc2hpcE9iaikge1xuICAgIHRoaXMubGlzdE9mU2hpcHMucHVzaChzaGlwT2JqKTtcbiAgfVxuXG4gICNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpIHtcbiAgICByZXR1cm4gW3ggLSAxLCB5IC0gMV07XG4gIH1cblxuICAjYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHgsIHkpIHtcbiAgICByZXR1cm4geCA8IDAgfHwgeSA8IDAgfHwgeCA+IEJPQVJEX1NJWkUgfHwgeSA+IEJPQVJEX1NJWkU7XG4gIH1cblxuICAjYXJlRW5kQ29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh7IHNoaXBMZW5ndGgsIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgY29uc3QgZW5kWSA9IHN0YXJ0WSAtIHNoaXBMZW5ndGg7XG4gICAgICByZXR1cm4gZW5kWSA8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyBzaGlwTGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiBlbmRYID4gQk9BUkRfU0laRTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBDb21wdXRlclBsYXllciB9IGZyb20gXCIuL2NvbXB1dGVyXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5pbXBvcnQgeyBTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG5cbmNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIocGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQpO1xuY29uc3QgY29tcHV0ZXIgPSBDb21wdXRlclBsYXllcihjb21wdXRlckJvYXJkLCBwbGF5ZXJCb2FyZCk7XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcFVJT25Cb2FyZCh7IHNoaXBPYmosIHgsIHkgfSkge1xuICBjb25zdCBnYW1lcGxheVNoaXAgPSBuZXcgU2hpcChzaGlwT2JqLmxlbmd0aCwgc2hpcE9iai5pZCk7XG4gIHBsYXllckJvYXJkLnBsYWNlKHtcbiAgICBzaGlwT2JqOiBnYW1lcGxheVNoaXAsXG4gICAgaXNWZXJ0aWNhbDogZmFsc2UsXG4gICAgc3RhcnRYOiB4LFxuICAgIHN0YXJ0WTogeSxcbiAgfSk7XG4gIGNvbnNvbGUubG9nKHBsYXllckJvYXJkKTtcbn1cblxuUHViU3ViLm9uKFwiY2hlY2tJZlNoaXBDcm9zc2VzQW55U2hpcHNcIiwgKGRhdGEpID0+IHtcbiAgaWYgKFxuICAgIGRhdGEudGlsZXNVbmRlclNoaXAuZXZlcnkoXG4gICAgICAodGlsZVVpKSA9PiAhcGxheWVyQm9hcmQuaXNTaGlwUGxhY2VkT25Db29yZGluYXRlcyh0aWxlVWkueCwgdGlsZVVpLnkpXG4gICAgKVxuICApIHtcbiAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudElzTGVnYWxcIiwgZGF0YS50aWxlc1VuZGVyU2hpcCk7XG4gICAgcGxhY2VTaGlwVUlPbkJvYXJkKHtcbiAgICAgIHNoaXBPYmo6IGRhdGEuc2hpcFVJLFxuICAgICAgeDogZGF0YS54LFxuICAgICAgeTogZGF0YS55LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIFB1YlN1Yi5lbWl0KFwicGxhY2VtZW50SXNJbGxlZ2FsXCIpO1xuICB9XG59KTtcbiIsImV4cG9ydCBmdW5jdGlvbiBQbGF5ZXIoYm9hcmQsIGVuZW15Qm9hcmQpIHtcbiAgY29uc3QgdGFrZVR1cm4gPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHRyeSB7XG4gICAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coXCJZb3VyIG1vdmUgaXMgaWxsZWdhbCEgVHJ5IGhpdHRpbmcgYW5vdGhlciBjZWxsLlwiKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB7IHRha2VUdXJuIH07XG59XG4iLCJleHBvcnQgY2xhc3MgU2hpcCB7XG4gIHRpbWVzSGl0ID0gMDtcblxuICBjb25zdHJ1Y3RvcihsZW5ndGgsIGlkKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5pZCA9IGlkO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQrKztcbiAgfVxuXG4gIGdldCBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZXNIaXQgPj0gdGhpcy5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQsXG4gIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWV9PRkZTRVQsXG4gIFRJTEVfU0laRV9QWCxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQsIFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRUaWxlc1VuZGVyU2hpcCB9IGZyb20gXCIuL3RpbGVVSVwiO1xuZXhwb3J0IGNsYXNzIFNoaXBVSSB7XG4gIHN0YXRpYyBtb3ZhYmxlU2hpcCA9IG51bGw7XG4gIHN0YXRpYyBhbGxTaGlwcyA9IFtdO1xuICBzdGF0aWMgdXNlZElEcyA9IFtdO1xuICBzdGF0aWMgSURfTUFYX1NJWkUgPSAyO1xuICBvZmZzZXRYID0gMDtcbiAgb2Zmc2V0WSA9IDA7XG4gIC8vIHRpbGVzUGxhY2VkID0gW107XG5cbiAgY29uc3RydWN0b3Ioc2hpcEVsZW1lbnQsIGxlbmd0aCkge1xuICAgIFNoaXBVSS5hbGxTaGlwcy5wdXNoKHRoaXMpO1xuICAgIGNvbnN0IElEID0gU2hpcFVJLiNnZW5lcmF0ZVNoaXBJRCgpO1xuICAgIHRoaXMuaWQgPSBJRDtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblxuICAgIHRoaXMuc2hpcEVsZW1lbnQgPSBzaGlwRWxlbWVudDtcbiAgICB0aGlzLnNoaXBFbGVtZW50LmlkID0gSUQ7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZG9jay1zaGlwXCIpO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbGVuZ3RoLSR7bGVuZ3RofWApO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUud2lkdGggPVxuICAgICAgbGVuZ3RoICogVElMRV9TSVpFX1BYICsgU0hJUF9XSURUSF9DT0VGRklDSUVOVCArIFwicHhcIjtcbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLmhlaWdodCA9XG4gICAgICBUSUxFX1NJWkVfUFggKyBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCArIFwicHhcIjtcblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNoaXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMub3JpZ2luWSA9IHJlY3QudG9wO1xuICAgIHRoaXMub3JpZ2luWCA9IHJlY3QubGVmdDtcblxuICAgIHNoaXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNoaXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5vZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICB0aGlzLm9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICBjb25zb2xlLmxvZyhlLmNsaWVudFksIHJlY3QudG9wLCB0aGlzLm9mZnNldFkpO1xuICAgICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyAjZ2VuZXJhdGVTaGlwSUQoKSB7XG4gICAgbGV0IGlkID0gbnVsbDtcbiAgICBkbyB7XG4gICAgICBpZCA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAxMCAqKiBTaGlwVUkuSURfTUFYX1NJWkUpO1xuICAgIH0gd2hpbGUgKFNoaXBVSS51c2VkSURzLmluY2x1ZGVzKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFNoaXBPcmlnaW5Ub1RpbGUoc2hpcFVJLCB0aWxlVUkpIHtcbiAgY29uc3QgdGlsZVJlY3QgPSB0aWxlVUkudGlsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHNoaXBVSS5vcmlnaW5ZID1cbiAgICB0aWxlUmVjdC50b3AgK1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgK1xuICAgIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWV9PRkZTRVQ7XG4gIHNoaXBVSS5vcmlnaW5YID0gdGlsZVJlY3QubGVmdCArIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQ7XG59XG5cbmZ1bmN0aW9uIG1vdmUoZSwgc2hpcCkge1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IGUucGFnZVkgLSBzaGlwLm9mZnNldFkgKyBcInB4XCI7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUubGVmdCA9IGUucGFnZVggLSBzaGlwLm9mZnNldFggKyBcInB4XCI7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KHNoaXAsIGlzU2hpcE92ZXJBbnlUaWxlcykge1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IFNoaXBVSS5tb3ZhYmxlU2hpcC5vcmlnaW5ZICsgXCJweFwiO1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLmxlZnQgPSBTaGlwVUkubW92YWJsZVNoaXAub3JpZ2luWCArIFwicHhcIjtcbiAgaWYgKCFpc1NoaXBPdmVyQW55VGlsZXMpIHtcbiAgICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJzdGF0aWNcIjtcbiAgfVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PiB7XG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcbiAgICBtb3ZlKGUsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgUHViU3ViLmVtaXQoXCJzaGlwSXNNb3ZpbmdcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgaWYgKFNoaXBVSS5tb3ZhYmxlU2hpcCkge1xuICAgIFB1YlN1Yi5lbWl0KFwibm9TaGlwTW92ZW1lbnRcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgICBjb25zdCB0aWxlc1VuZGVyU2hpcCA9IGdldFRpbGVzVW5kZXJTaGlwKFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgY29uc3QgaXNTaGlwT3ZlckFueVRpbGVzID0gdGlsZXNVbmRlclNoaXAubGVuZ3RoID4gMDtcbiAgICBjb25zdCBpc1NoaXBPdXRPZkJvdW5kcyA9XG4gICAgICB0aWxlc1VuZGVyU2hpcC5sZW5ndGggIT09IFNoaXBVSS5tb3ZhYmxlU2hpcC5sZW5ndGg7XG4gICAgY29uc3QgaXNTaGlwUG9zaXRpb25MZWdhbCA9IGlzU2hpcE92ZXJBbnlUaWxlcyAmJiAhaXNTaGlwT3V0T2ZCb3VuZHM7XG5cbiAgICBpZiAoaXNTaGlwUG9zaXRpb25MZWdhbCkge1xuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmU2hpcENyb3NzZXNBbnlTaGlwc1wiLCB7XG4gICAgICAgIHRpbGVzVW5kZXJTaGlwLFxuICAgICAgICB4OiB0aWxlc1VuZGVyU2hpcFswXS54LFxuICAgICAgICB5OiB0aWxlc1VuZGVyU2hpcFswXS55LFxuICAgICAgICBzaGlwVUk6IFNoaXBVSS5tb3ZhYmxlU2hpcCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudElzSWxsZWdhbFwiKTtcbiAgICB9XG5cbiAgICByZXNldChTaGlwVUkubW92YWJsZVNoaXAsIGlzU2hpcFBvc2l0aW9uTGVnYWwpO1xuICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IG51bGw7XG4gIH1cbn0pO1xuXG5QdWJTdWIub24oXCJwbGFjZW1lbnRJc0xlZ2FsXCIsICh0aWxlc1VuZGVyU2hpcCkgPT4ge1xuICBzZXRTaGlwT3JpZ2luVG9UaWxlKFNoaXBVSS5tb3ZhYmxlU2hpcCwgdGlsZXNVbmRlclNoaXBbMF0pO1xufSk7XG5cblB1YlN1Yi5vbihcInBsYWNlbWVudElzSWxsZWdhbFwiLCAoKSA9PiB7XG4gIGNvbnNvbGUud2FybihcIlN1Y2ggc2hpcCBwbGFjZW1lbnQgaXMgaWxsZWdhbFwiKTtcbn0pO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcblxuZnVuY3Rpb24gc2hpcElzT3ZlclRpbGUodGlsZSwgc2hpcCwgbGVuZ3RoLCBpc1JvdGF0ZWQsIGJhc2VMZW5ndGgpIHtcbiAgY29uc3QgdGlsZVJlY3QgPSB0aWxlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBzaGlwUmVjdCA9IHNoaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGRpZmZlcmVuY2VUb3AgPSBNYXRoLmFicyh0aWxlUmVjdC50b3AgLSBzaGlwUmVjdC50b3ApO1xuICAgIGNvbnN0IGRpZmZlcmVuY2VMZWZ0ID0gTWF0aC5hYnModGlsZVJlY3QubGVmdCAtIHNoaXBSZWN0LmxlZnQpO1xuICAgIGNvbnN0IGRpZmZlcmVuY2VCb3R0b20gPSBpc1JvdGF0ZWRcbiAgICAgID8gTWF0aC5hYnModGlsZVJlY3QuYm90dG9tIC0gKHNoaXBSZWN0LmJvdHRvbSAtIGJhc2VMZW5ndGggKiBpKSlcbiAgICAgIDogTWF0aC5hYnModGlsZVJlY3QuYm90dG9tIC0gc2hpcFJlY3QuYm90dG9tKTtcbiAgICBjb25zdCBkaWZmZXJlbmNlUmlnaHQgPSBpc1JvdGF0ZWRcbiAgICAgID8gTWF0aC5hYnModGlsZVJlY3QucmlnaHQgLSBzaGlwUmVjdC5yaWdodClcbiAgICAgIDogTWF0aC5hYnModGlsZVJlY3QucmlnaHQgLSAoc2hpcFJlY3QucmlnaHQgLSBiYXNlTGVuZ3RoICogaSkpO1xuXG4gICAgaWYgKFxuICAgICAgKGRpZmZlcmVuY2VUb3AgPCB0aWxlUmVjdC5oZWlnaHQgLyAyIHx8XG4gICAgICAgIGRpZmZlcmVuY2VMZWZ0IDwgdGlsZVJlY3Qud2lkdGggLyAyKSAmJlxuICAgICAgZGlmZmVyZW5jZUJvdHRvbSA8IHRpbGVSZWN0LmhlaWdodCAvIDIgJiZcbiAgICAgIGRpZmZlcmVuY2VSaWdodCA8IHRpbGVSZWN0LndpZHRoIC8gMiAmJlxuICAgICAgZGlmZmVyZW5jZVRvcCA8IHRpbGVSZWN0LmhlaWdodCAvIDJcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGVzVW5kZXJTaGlwKHNoaXBVSSkge1xuICByZXR1cm4gVGlsZVVJLmFsbFRpbGVzLmZpbHRlcigodGlsZVVJKSA9PlxuICAgIHNoaXBJc092ZXJUaWxlKFxuICAgICAgdGlsZVVJLnRpbGVFbGVtZW50LFxuICAgICAgc2hpcFVJLnNoaXBFbGVtZW50LFxuICAgICAgc2hpcFVJLmxlbmd0aCxcbiAgICAgIGZhbHNlLFxuICAgICAgVElMRV9TSVpFX1BYXG4gICAgKVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgVGlsZVVJIHtcbiAgc3RhdGljIGFsbFRpbGVzID0gW107XG4gIGNvbnN0cnVjdG9yKHRpbGVFbGVtZW50LCB4LCB5KSB7XG4gICAgVGlsZVVJLmFsbFRpbGVzLnB1c2godGhpcyk7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMudGlsZUVsZW1lbnQgPSB0aWxlRWxlbWVudDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0aWxlXCIpO1xuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC54ID0geDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueSA9IHk7XG4gICAgdGhpcy50aWxlRWxlbWVudC53aWR0aCA9IFRJTEVfU0laRV9QWCArIFwicHhcIjtcblxuICAgIFB1YlN1Yi5vbihcInNoaXBJc01vdmluZ1wiLCAoc2hpcCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBzaGlwSXNPdmVyVGlsZShcbiAgICAgICAgICB0aGlzLnRpbGVFbGVtZW50LFxuICAgICAgICAgIHNoaXAuc2hpcEVsZW1lbnQsXG4gICAgICAgICAgc2hpcC5sZW5ndGgsXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgVElMRV9TSVpFX1BYXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJob3ZlcmVkV2l0aFNoaXBcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkV2l0aFNoaXBcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgUHViU3ViLm9uKFwibm9TaGlwTW92ZW1lbnRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5pbXBvcnQgeyBTaGlwVUkgfSBmcm9tIFwiLi4vc2hpcFVJXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoaXBVSShsZW5ndGgpIHtcbiAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwVUkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgbGVuZ3RoKTtcbiAgcmV0dXJuIHNoaXAuc2hpcEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHB1c2hTaGlwVG9Eb2NrKHNoaXBFbGVtZW50KSB7XG4gIGRvY2suYXBwZW5kQ2hpbGQoc2hpcEVsZW1lbnQpO1xufVxuXG5jb25zdCBkb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NrXCIpO1xuXG5QdWJTdWIub24oXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiLCAoKSA9PiB7XG4gIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuXG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSg0KSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgzKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgzKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG59KTtcblxuUHViU3ViLm9uKFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiLCAoKSA9PiB7XG4gIGlmIChkb2NrLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBhbGVydChcIkRvY2sgaXMgbm90IGVtcHR5IVwiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcIk5vbmVcIjtcbiAgICBQdWJTdWIuZW1pdChcImdhbWVTdGFydHNcIik7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuXG5jb25zdCBNQUlOX0FDVElPTl9CVVRUT05fTkFNRVMgPSB7XG4gIHNoaXBQbGFjZW1lbnRBZnRlckNsaWNrOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcbiAgZ2FtZXBsYXlBZnRlckNsaWNrOiBcIlN0YXJ0IGdhbWVcIixcbn07XG5jb25zdCBtYWluQWN0aW9uQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWFjdGlvbi1idXR0b25cIik7XG5tYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID0gTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLnNoaXBQbGFjZW1lbnRBZnRlckNsaWNrO1xuXG5tYWluQWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIHN3aXRjaCAobWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCkge1xuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLmdhbWVwbGF5QWZ0ZXJDbGljazoge1xuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLnNoaXBQbGFjZW1lbnRBZnRlckNsaWNrOiB7XG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIpO1xuICAgICAgbWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5nYW1lcGxheUFmdGVyQ2xpY2s7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGlsZVVJIH0gZnJvbSBcIi4uL3RpbGVVSVwiO1xuaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcblxuY29uc3QgW2dyaWRMZWZ0LCBncmlkUmlnaHRdID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyaWRcIik7XG5maWxsR3JpZFdpdGhDZWxscyhncmlkTGVmdCk7XG5maWxsR3JpZFdpdGhDZWxscyhncmlkUmlnaHQpO1xuc2V0R3JpZFRpbGVTaXplKGdyaWRMZWZ0KTtcbnNldEdyaWRUaWxlU2l6ZShncmlkUmlnaHQpO1xuXG5mdW5jdGlvbiBmaWxsR3JpZFdpdGhDZWxscyhncmlkKSB7XG4gIGZvciAobGV0IHkgPSAwOyB5IDwgQk9BUkRfU0laRTsgeSsrKSB7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9TSVpFOyB4KyspIHtcbiAgICAgIGNvbnN0IHRpbGUgPSBuZXcgVGlsZVVJKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksIHggKyAxLCB5ICsgMSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKHRpbGUudGlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRHcmlkVGlsZVNpemUoZ3JpZCkge1xuICBncmlkLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Qk9BUkRfU0laRX0sICR7XG4gICAgVElMRV9TSVpFX1BYICsgXCJweFwiXG4gIH0pYDtcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1RJTEVfU0laRV9QWCArIFwicHhcIn0pYDtcbn1cblxuUHViU3ViLm9uKFwiZmlsbEdyaWRXaXRoQ2VsbHNcIiwgZmlsbEdyaWRXaXRoQ2VsbHMpO1xuUHViU3ViLm9uKFwic2V0R3JpZFRpbGVTaXplXCIsIHNldEdyaWRUaWxlU2l6ZSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vdXRpbGl0aWVzL2dyaWQtaGFuZGxlclwiO1xuaW1wb3J0IFwiLi9zaGlwVUlcIjtcbmltcG9ydCBcIi4vdGlsZVVJXCI7XG5pbXBvcnQgXCIuL3V0aWxpdGllcy9kb2NrLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vdXRpbGl0aWVzL2dhbWUtYnV0dG9uLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vZ2FtZXBsYXkvZ2FtZXBsYXktb2JqZWN0cy1oYW5kbGVyXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=