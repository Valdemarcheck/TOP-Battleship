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

  place({ shipObj, isVertical, startX, startY }) {
    if (
      this.#areStartCoordinatesOutOfBounds(startX, startY) ||
      this.#areEndCoordinatesOutOfBounds({
        shipLength: shipObj.length,
        isVertical,
        startX,
        startY,
      }) ||
      this.#isFilledPath({
        pathLength: shipObj.length,
        isVertical,
        startX,
        startY,
      })
    ) {
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





const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();
const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();

const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player(playerBoard, computerBoard);
const computer = (0,_computer__WEBPACK_IMPORTED_MODULE_2__.ComputerPlayer)(computerBoard, playerBoard);

_PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.on("checkIfPlayerCellIsFree", (data) => {
  if (
    data.tilesUnderShip.every(
      (tileUi) => !playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
    )
  ) {
    console.log(data.tilesUnderShip);
    _PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.emit("theCellIsNotTaken", data.tilesUnderShip);
  } else {
    _PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.emit("theCellIsTaken");
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

    if (isShipOverAnyTiles) {
      _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit("checkIfPlayerCellIsFree", {
        tilesUnderShip,
        coordinates: {
          x: tilesUnderShip[0].x,
          y: tilesUnderShip[0].y,
        },
      });
    }

    reset(ShipUI.movableShip, isShipOverAnyTiles);
    ShipUI.movableShip = null;
  }
});

_PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("theCellIsNotTaken", (tilesUnderShip) => {
  console.log(tilesUnderShip[0]);
  setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
  // ShipUI.movableShip.tilesPlaced = [...tilesUnderShip];
});

_PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("theCellIsTaken", () => {
  console.warn("Cell you are trying to put your ship on is taken");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNoQjtBQUNBO0FBQ2dCO0FBQ087QUFDSSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dhbWVwbGF5L2dhbWVwbGF5LW9iamVjdHMtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9nYW1lcGxheS9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvc2hpcFVJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3RpbGVVSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy91dGlsaXRpZXMvZG9jay1oYW5kbGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3V0aWxpdGllcy9nYW1lLWJ1dHRvbi1oYW5kbGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3V0aWxpdGllcy9ncmlkLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgUHViU3ViID0gKCgpID0+IHtcbiAgY29uc3QgRVZFTlRTID0ge307XG5cbiAgZnVuY3Rpb24gb24oZXZlbnROYW1lLCBmbikge1xuICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0gfHwgW107XG4gICAgRVZFTlRTW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gIH1cblxuICBmdW5jdGlvbiBvZmYoZXZlbnROYW1lLCBmbikge1xuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXS5maWx0ZXIoXG4gICAgICAgIChjdXJyZW50Rm4pID0+IGN1cnJlbnRGbiAhPSBmblxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50TmFtZSArIFwiIEVWRU5UIFdBUyBDQUxMRURcIik7XG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XG4gICAgICBFVkVOVFNbZXZlbnROYW1lXS5mb3JFYWNoKChmbikgPT4ge1xuICAgICAgICBmbihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG9uLCBvZmYsIGVtaXQgfTtcbn0pKCk7XG4iLCJleHBvcnQgY29uc3QgVElMRV9TSVpFX1BYID0gNTA7XG5leHBvcnQgY29uc3QgQk9BUkRfU0laRSA9IDEwO1xuZXhwb3J0IGNvbnN0IFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWV9PRkZTRVQgPSBUSUxFX1NJWkVfUFggLyAxMDtcbmV4cG9ydCBjb25zdCBTSElQX1BMQUNFTUVOVF9PTl9USUxFX1hfT0ZGU0VUID0gVElMRV9TSVpFX1BYIC8gMTA7XG5cbi8vIHNoaXAgc2V0dGluZ3NcbmV4cG9ydCBjb25zdCBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCA9IC0xMDtcbmV4cG9ydCBjb25zdCBTSElQX1dJRFRIX0NPRUZGSUNJRU5UID0gLTEwO1xuIiwiaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQm9hcmQsIGVuZW15Qm9hcmQpIHtcbiAgY29uc3QgdW51c2VkQ29vcmRpbmF0ZXNPYmogPSAoKCkgPT4ge1xuICAgIGNvbnN0IHVudXNlZENvb3JkaW5hdGVzT2JqID0ge307XG4gICAgY29uc3QgeUNvb3JkaW5hdGVzSW5PbmVDb2x1bW4gPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gQk9BUkRfU0laRTsgaSsrKSB7XG4gICAgICB1bnVzZWRDb29yZGluYXRlc09ialtpXSA9IFsuLi55Q29vcmRpbmF0ZXNJbk9uZUNvbHVtbl07XG4gICAgfVxuICAgIHJldHVybiB1bnVzZWRDb29yZGluYXRlc09iajtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiByZW1vdmVFbGVtZW50RnJvbUFycmF5KHZhbHVlLCBhcnJheSkge1xuICAgIGNvbnN0IGFycmF5Q29weSA9IFsuLi5hcnJheV07XG4gICAgY29uc3QgaW5kZXhPZlZhbHVlID0gYXJyYXlDb3B5LmluZGV4T2YodmFsdWUpO1xuICAgIGFycmF5Q29weS5zcGxpY2UoaW5kZXhPZlZhbHVlLCAxKTtcbiAgICByZXR1cm4gYXJyYXlDb3B5O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKSB7XG4gICAgY29uc3QgcG9zc2libGVYVmFsdWVzID0gT2JqZWN0LmtleXModW51c2VkQ29vcmRpbmF0ZXNPYmopO1xuICAgIGNvbnN0IHggPVxuICAgICAgcG9zc2libGVYVmFsdWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlWFZhbHVlcy5sZW5ndGgpXTtcbiAgICBjb25zdCBwb3NzaWJsZVlWYWx1ZXMgPSB1bnVzZWRDb29yZGluYXRlc09ialt4XTtcbiAgICBjb25zdCB5ID1cbiAgICAgIHBvc3NpYmxlWVZhbHVlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZVlWYWx1ZXMubGVuZ3RoKV07XG5cbiAgICB1bnVzZWRDb29yZGluYXRlc09ialt4XSA9IHJlbW92ZUVsZW1lbnRGcm9tQXJyYXkoXG4gICAgICB5LFxuICAgICAgdW51c2VkQ29vcmRpbmF0ZXNPYmpbeF1cbiAgICApO1xuICAgIGlmICh1bnVzZWRDb29yZGluYXRlc09ialt4XS5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlbGV0ZSB1bnVzZWRDb29yZGluYXRlc09ialt4XTtcbiAgICB9XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VUdXJuKCkge1xuICAgIGNvbnN0IFt4LCB5XSA9IGdldFJhbmRvbUNvb3JkaW5hdGVzKCk7XG4gICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICB9XG5cbiAgcmV0dXJuIHsgdW51c2VkQ29vcmRpbmF0ZXNPYmosIG1ha2VUdXJuIH07XG59XG4iLCJpbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5mdW5jdGlvbiBnZXRBcnJheU9mU2FtZVZhbHVlcyhzaXplLCB2YWx1ZSkge1xuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGFycmF5LnB1c2goW10pO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICBhcnJheVtpXS5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgaGl0Q2VsbHNCb2FyZEFycmF5ID0gZ2V0QXJyYXlPZlNhbWVWYWx1ZXMoQk9BUkRfU0laRSwgZmFsc2UpO1xuICBzaGlwc09uQm9hcmRBcnJheSA9IGdldEFycmF5T2ZTYW1lVmFsdWVzKEJPQVJEX1NJWkUsIG51bGwpO1xuICBsaXN0T2ZTaGlwcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwbGFjZSh7IHNoaXBPYmosIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLiNhcmVTdGFydENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoc3RhcnRYLCBzdGFydFkpIHx8XG4gICAgICB0aGlzLiNhcmVFbmRDb29yZGluYXRlc091dE9mQm91bmRzKHtcbiAgICAgICAgc2hpcExlbmd0aDogc2hpcE9iai5sZW5ndGgsXG4gICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgIHN0YXJ0WCxcbiAgICAgICAgc3RhcnRZLFxuICAgICAgfSkgfHxcbiAgICAgIHRoaXMuI2lzRmlsbGVkUGF0aCh7XG4gICAgICAgIHBhdGhMZW5ndGg6IHNoaXBPYmoubGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgIH0pXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBjb29yZGluYXRlcyBhcmUgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ2FtZWJvYXJkXCIpO1xuICAgIH1cblxuICAgIFtzdGFydFgsIHN0YXJ0WV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHN0YXJ0WCwgc3RhcnRZKTtcblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WSA9IDA7IGN1cnJlbnRZIDwgc2hpcE9iai5sZW5ndGg7IGN1cnJlbnRZKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVtzdGFydFkgLSBjdXJyZW50WV1bc3RhcnRYXSA9IHNoaXBPYmo7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRYID0gMDsgY3VycmVudFggPCBzaGlwT2JqLmxlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W3N0YXJ0WV1bc3RhcnRYICsgY3VycmVudFhdID0gc2hpcE9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiNhZGRTaGlwVG9MaXN0T2ZTaGlwcyhzaGlwT2JqKTtcbiAgfVxuXG4gIGlzU2hpcFBsYWNlZE9uQ29vcmRpbmF0ZXMoeCwgeSkge1xuICAgIGNvbnN0IFthY3R1YWxYLCBhY3R1YWxZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoeCwgeSk7XG4gICAgcmV0dXJuICEhdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxZXVthY3R1YWxYXTtcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgIGlmICh0aGlzLiNhcmVTdGFydENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoeCwgeSkgfHwgdGhpcy4jaXNIaXQoeCwgeSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdpdmVuIGNvb3JkaW5hdGVzIGFyZSBvdXQgb2YgYm91bmRzIG9mIHRoZSBnYW1lYm9hcmRcIik7XG4gICAgfVxuICAgIGNvbnN0IFthY3R1YWxYLCBhY3R1YWxZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoeCwgeSk7XG4gICAgdGhpcy5oaXRDZWxsc0JvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF0gPSB0cnVlO1xuXG4gICAgY29uc3QgaGl0U2hpcCA9IHRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gICAgaWYgKGhpdFNoaXApIHtcbiAgICAgIGhpdFNoaXAuaGl0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFyZUFsbFNoaXBzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0T2ZTaGlwcy5ldmVyeSgoc2hpcE9iaikgPT4ge1xuICAgICAgcmV0dXJuIHNoaXBPYmouaXNTdW5rO1xuICAgIH0pO1xuICB9XG5cbiAgI2lzSGl0KHgsIHkpIHtcbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHJldHVybiB0aGlzLmhpdENlbGxzQm9hcmRBcnJheVthY3R1YWxZXVthY3R1YWxYXTtcbiAgfVxuXG4gICNpc0ZpbGxlZFBhdGgoeyBwYXRoTGVuZ3RoLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgY29uc3QgW2FjdHVhbFN0YXJ0WCwgYWN0dWFsU3RhcnRZXSA9IHRoaXMuI2NvbnZlcnRCb2FyZENvb3Jkc1RvQXJyYXlDb29yZHMoXG4gICAgICBzdGFydFgsXG4gICAgICBzdGFydFlcbiAgICApO1xuXG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRZID0gMDsgY3VycmVudFkgPCBwYXRoTGVuZ3RoOyBjdXJyZW50WSsrKSB7XG4gICAgICAgIGlmICghIXRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsU3RhcnRZIC0gY3VycmVudFldW2FjdHVhbFN0YXJ0WF0pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WCA9IDA7IGN1cnJlbnRYIDwgcGF0aExlbmd0aDsgY3VycmVudFgrKykge1xuICAgICAgICBpZiAoISF0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WV1bYWN0dWFsU3RhcnRYICsgY3VycmVudFhdKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAjYWRkU2hpcFRvTGlzdE9mU2hpcHMoc2hpcE9iaikge1xuICAgIHRoaXMubGlzdE9mU2hpcHMucHVzaChzaGlwT2JqKTtcbiAgfVxuXG4gICNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpIHtcbiAgICByZXR1cm4gW3ggLSAxLCB5IC0gMV07XG4gIH1cblxuICAjYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHgsIHkpIHtcbiAgICByZXR1cm4geCA8IDAgfHwgeSA8IDAgfHwgeCA+IEJPQVJEX1NJWkUgfHwgeSA+IEJPQVJEX1NJWkU7XG4gIH1cblxuICAjYXJlRW5kQ29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh7IHNoaXBMZW5ndGgsIGlzVmVydGljYWwsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgY29uc3QgZW5kWSA9IHN0YXJ0WSAtIHNoaXBMZW5ndGg7XG4gICAgICByZXR1cm4gZW5kWSA8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyBzaGlwTGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiBlbmRYID4gQk9BUkRfU0laRTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBDb21wdXRlclBsYXllciB9IGZyb20gXCIuL2NvbXB1dGVyXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5cbmNvbnN0IHBsYXllckJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcblxuY29uc3QgcGxheWVyID0gbmV3IFBsYXllcihwbGF5ZXJCb2FyZCwgY29tcHV0ZXJCb2FyZCk7XG5jb25zdCBjb21wdXRlciA9IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQm9hcmQsIHBsYXllckJvYXJkKTtcblxuUHViU3ViLm9uKFwiY2hlY2tJZlBsYXllckNlbGxJc0ZyZWVcIiwgKGRhdGEpID0+IHtcbiAgaWYgKFxuICAgIGRhdGEudGlsZXNVbmRlclNoaXAuZXZlcnkoXG4gICAgICAodGlsZVVpKSA9PiAhcGxheWVyQm9hcmQuaXNTaGlwUGxhY2VkT25Db29yZGluYXRlcyh0aWxlVWkueCwgdGlsZVVpLnkpXG4gICAgKVxuICApIHtcbiAgICBjb25zb2xlLmxvZyhkYXRhLnRpbGVzVW5kZXJTaGlwKTtcbiAgICBQdWJTdWIuZW1pdChcInRoZUNlbGxJc05vdFRha2VuXCIsIGRhdGEudGlsZXNVbmRlclNoaXApO1xuICB9IGVsc2Uge1xuICAgIFB1YlN1Yi5lbWl0KFwidGhlQ2VsbElzVGFrZW5cIik7XG4gIH1cbn0pO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIFBsYXllcihib2FyZCwgZW5lbXlCb2FyZCkge1xuICBjb25zdCB0YWtlVHVybiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdHJ5IHtcbiAgICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIllvdXIgbW92ZSBpcyBpbGxlZ2FsISBUcnkgaGl0dGluZyBhbm90aGVyIGNlbGwuXCIpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHsgdGFrZVR1cm4gfTtcbn1cbiIsImltcG9ydCB7XG4gIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQsXG4gIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWV9PRkZTRVQsXG4gIFRJTEVfU0laRV9QWCxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQsIFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRUaWxlc1VuZGVyU2hpcCB9IGZyb20gXCIuL3RpbGVVSVwiO1xuZXhwb3J0IGNsYXNzIFNoaXBVSSB7XG4gIHN0YXRpYyBtb3ZhYmxlU2hpcCA9IG51bGw7XG4gIHN0YXRpYyBhbGxTaGlwcyA9IFtdO1xuICBzdGF0aWMgdXNlZElEcyA9IFtdO1xuICBzdGF0aWMgSURfTUFYX1NJWkUgPSAyO1xuICBvZmZzZXRYID0gMDtcbiAgb2Zmc2V0WSA9IDA7XG4gIC8vIHRpbGVzUGxhY2VkID0gW107XG5cbiAgY29uc3RydWN0b3Ioc2hpcEVsZW1lbnQsIGxlbmd0aCkge1xuICAgIFNoaXBVSS5hbGxTaGlwcy5wdXNoKHRoaXMpO1xuICAgIGNvbnN0IElEID0gU2hpcFVJLiNnZW5lcmF0ZVNoaXBJRCgpO1xuICAgIHRoaXMuaWQgPSBJRDtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblxuICAgIHRoaXMuc2hpcEVsZW1lbnQgPSBzaGlwRWxlbWVudDtcbiAgICB0aGlzLnNoaXBFbGVtZW50LmlkID0gSUQ7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZG9jay1zaGlwXCIpO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbGVuZ3RoLSR7bGVuZ3RofWApO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUud2lkdGggPVxuICAgICAgbGVuZ3RoICogVElMRV9TSVpFX1BYICsgU0hJUF9XSURUSF9DT0VGRklDSUVOVCArIFwicHhcIjtcbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLmhlaWdodCA9XG4gICAgICBUSUxFX1NJWkVfUFggKyBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCArIFwicHhcIjtcblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNoaXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMub3JpZ2luWSA9IHJlY3QudG9wO1xuICAgIHRoaXMub3JpZ2luWCA9IHJlY3QubGVmdDtcblxuICAgIHNoaXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNoaXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5vZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICB0aGlzLm9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICBjb25zb2xlLmxvZyhlLmNsaWVudFksIHJlY3QudG9wLCB0aGlzLm9mZnNldFkpO1xuICAgICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyAjZ2VuZXJhdGVTaGlwSUQoKSB7XG4gICAgbGV0IGlkID0gbnVsbDtcbiAgICBkbyB7XG4gICAgICBpZCA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAxMCAqKiBTaGlwVUkuSURfTUFYX1NJWkUpO1xuICAgIH0gd2hpbGUgKFNoaXBVSS51c2VkSURzLmluY2x1ZGVzKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFNoaXBPcmlnaW5Ub1RpbGUoc2hpcFVJLCB0aWxlVUkpIHtcbiAgY29uc3QgdGlsZVJlY3QgPSB0aWxlVUkudGlsZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHNoaXBVSS5vcmlnaW5ZID1cbiAgICB0aWxlUmVjdC50b3AgK1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgK1xuICAgIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWV9PRkZTRVQ7XG4gIHNoaXBVSS5vcmlnaW5YID0gdGlsZVJlY3QubGVmdCArIFNISVBfUExBQ0VNRU5UX09OX1RJTEVfWF9PRkZTRVQ7XG59XG5cbmZ1bmN0aW9uIG1vdmUoZSwgc2hpcCkge1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IGUucGFnZVkgLSBzaGlwLm9mZnNldFkgKyBcInB4XCI7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUubGVmdCA9IGUucGFnZVggLSBzaGlwLm9mZnNldFggKyBcInB4XCI7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KHNoaXAsIGlzU2hpcE92ZXJBbnlUaWxlcykge1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IFNoaXBVSS5tb3ZhYmxlU2hpcC5vcmlnaW5ZICsgXCJweFwiO1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLmxlZnQgPSBTaGlwVUkubW92YWJsZVNoaXAub3JpZ2luWCArIFwicHhcIjtcbiAgaWYgKCFpc1NoaXBPdmVyQW55VGlsZXMpIHtcbiAgICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJzdGF0aWNcIjtcbiAgfVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PiB7XG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcbiAgICBtb3ZlKGUsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgUHViU3ViLmVtaXQoXCJzaGlwSXNNb3ZpbmdcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgaWYgKFNoaXBVSS5tb3ZhYmxlU2hpcCkge1xuICAgIFB1YlN1Yi5lbWl0KFwibm9TaGlwTW92ZW1lbnRcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgICBjb25zdCB0aWxlc1VuZGVyU2hpcCA9IGdldFRpbGVzVW5kZXJTaGlwKFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgY29uc3QgaXNTaGlwT3ZlckFueVRpbGVzID0gdGlsZXNVbmRlclNoaXAubGVuZ3RoID4gMDtcblxuICAgIGlmIChpc1NoaXBPdmVyQW55VGlsZXMpIHtcbiAgICAgIFB1YlN1Yi5lbWl0KFwiY2hlY2tJZlBsYXllckNlbGxJc0ZyZWVcIiwge1xuICAgICAgICB0aWxlc1VuZGVyU2hpcCxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHtcbiAgICAgICAgICB4OiB0aWxlc1VuZGVyU2hpcFswXS54LFxuICAgICAgICAgIHk6IHRpbGVzVW5kZXJTaGlwWzBdLnksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNldChTaGlwVUkubW92YWJsZVNoaXAsIGlzU2hpcE92ZXJBbnlUaWxlcyk7XG4gICAgU2hpcFVJLm1vdmFibGVTaGlwID0gbnVsbDtcbiAgfVxufSk7XG5cblB1YlN1Yi5vbihcInRoZUNlbGxJc05vdFRha2VuXCIsICh0aWxlc1VuZGVyU2hpcCkgPT4ge1xuICBjb25zb2xlLmxvZyh0aWxlc1VuZGVyU2hpcFswXSk7XG4gIHNldFNoaXBPcmlnaW5Ub1RpbGUoU2hpcFVJLm1vdmFibGVTaGlwLCB0aWxlc1VuZGVyU2hpcFswXSk7XG4gIC8vIFNoaXBVSS5tb3ZhYmxlU2hpcC50aWxlc1BsYWNlZCA9IFsuLi50aWxlc1VuZGVyU2hpcF07XG59KTtcblxuUHViU3ViLm9uKFwidGhlQ2VsbElzVGFrZW5cIiwgKCkgPT4ge1xuICBjb25zb2xlLndhcm4oXCJDZWxsIHlvdSBhcmUgdHJ5aW5nIHRvIHB1dCB5b3VyIHNoaXAgb24gaXMgdGFrZW5cIik7XG59KTtcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4vUHViU3ViXCI7XG5cbmZ1bmN0aW9uIHNoaXBJc092ZXJUaWxlKHRpbGUsIHNoaXAsIGxlbmd0aCwgaXNSb3RhdGVkLCBiYXNlTGVuZ3RoKSB7XG4gIGNvbnN0IHRpbGVSZWN0ID0gdGlsZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qgc2hpcFJlY3QgPSBzaGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkaWZmZXJlbmNlVG9wID0gTWF0aC5hYnModGlsZVJlY3QudG9wIC0gc2hpcFJlY3QudG9wKTtcbiAgICBjb25zdCBkaWZmZXJlbmNlTGVmdCA9IE1hdGguYWJzKHRpbGVSZWN0LmxlZnQgLSBzaGlwUmVjdC5sZWZ0KTtcbiAgICBjb25zdCBkaWZmZXJlbmNlQm90dG9tID0gaXNSb3RhdGVkXG4gICAgICA/IE1hdGguYWJzKHRpbGVSZWN0LmJvdHRvbSAtIChzaGlwUmVjdC5ib3R0b20gLSBiYXNlTGVuZ3RoICogaSkpXG4gICAgICA6IE1hdGguYWJzKHRpbGVSZWN0LmJvdHRvbSAtIHNoaXBSZWN0LmJvdHRvbSk7XG4gICAgY29uc3QgZGlmZmVyZW5jZVJpZ2h0ID0gaXNSb3RhdGVkXG4gICAgICA/IE1hdGguYWJzKHRpbGVSZWN0LnJpZ2h0IC0gc2hpcFJlY3QucmlnaHQpXG4gICAgICA6IE1hdGguYWJzKHRpbGVSZWN0LnJpZ2h0IC0gKHNoaXBSZWN0LnJpZ2h0IC0gYmFzZUxlbmd0aCAqIGkpKTtcblxuICAgIGlmIChcbiAgICAgIChkaWZmZXJlbmNlVG9wIDwgdGlsZVJlY3QuaGVpZ2h0IC8gMiB8fFxuICAgICAgICBkaWZmZXJlbmNlTGVmdCA8IHRpbGVSZWN0LndpZHRoIC8gMikgJiZcbiAgICAgIGRpZmZlcmVuY2VCb3R0b20gPCB0aWxlUmVjdC5oZWlnaHQgLyAyICYmXG4gICAgICBkaWZmZXJlbmNlUmlnaHQgPCB0aWxlUmVjdC53aWR0aCAvIDIgJiZcbiAgICAgIGRpZmZlcmVuY2VUb3AgPCB0aWxlUmVjdC5oZWlnaHQgLyAyXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaWxlc1VuZGVyU2hpcChzaGlwVUkpIHtcbiAgcmV0dXJuIFRpbGVVSS5hbGxUaWxlcy5maWx0ZXIoKHRpbGVVSSkgPT5cbiAgICBzaGlwSXNPdmVyVGlsZShcbiAgICAgIHRpbGVVSS50aWxlRWxlbWVudCxcbiAgICAgIHNoaXBVSS5zaGlwRWxlbWVudCxcbiAgICAgIHNoaXBVSS5sZW5ndGgsXG4gICAgICBmYWxzZSxcbiAgICAgIFRJTEVfU0laRV9QWFxuICAgIClcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFRpbGVVSSB7XG4gIHN0YXRpYyBhbGxUaWxlcyA9IFtdO1xuICBjb25zdHJ1Y3Rvcih0aWxlRWxlbWVudCwgeCwgeSkge1xuICAgIFRpbGVVSS5hbGxUaWxlcy5wdXNoKHRoaXMpO1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnRpbGVFbGVtZW50ID0gdGlsZUVsZW1lbnQ7XG4gICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGlsZVwiKTtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueCA9IHg7XG4gICAgdGhpcy50aWxlRWxlbWVudC5kYXRhc2V0LnkgPSB5O1xuICAgIHRoaXMudGlsZUVsZW1lbnQud2lkdGggPSBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG5cbiAgICBQdWJTdWIub24oXCJzaGlwSXNNb3ZpbmdcIiwgKHNoaXApID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgc2hpcElzT3ZlclRpbGUoXG4gICAgICAgICAgdGhpcy50aWxlRWxlbWVudCxcbiAgICAgICAgICBzaGlwLnNoaXBFbGVtZW50LFxuICAgICAgICAgIHNoaXAubGVuZ3RoLFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIFRJTEVfU0laRV9QWFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFB1YlN1Yi5vbihcIm5vU2hpcE1vdmVtZW50XCIsICgpID0+IHtcbiAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuaW1wb3J0IHsgU2hpcFVJIH0gZnJvbSBcIi4uL3NoaXBVSVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTaGlwVUkobGVuZ3RoKSB7XG4gIGNvbnN0IHNoaXAgPSBuZXcgU2hpcFVJKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksIGxlbmd0aCk7XG4gIHJldHVybiBzaGlwLnNoaXBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwdXNoU2hpcFRvRG9jayhzaGlwRWxlbWVudCkge1xuICBkb2NrLmFwcGVuZENoaWxkKHNoaXBFbGVtZW50KTtcbn1cblxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcblxuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgKCkgPT4ge1xuICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcblxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoNCkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMykpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMykpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xufSk7XG5cblB1YlN1Yi5vbihcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIiwgKCkgPT4ge1xuICBpZiAoZG9jay5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XG4gIH0gZWxzZSB7XG4gICAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xuICB9XG59KTtcbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcblxuY29uc3QgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTID0ge1xuICBzaGlwUGxhY2VtZW50QWZ0ZXJDbGljazogXCJTdGFydCBwbGFjaW5nIHNoaXBzXCIsXG4gIGdhbWVwbGF5QWZ0ZXJDbGljazogXCJTdGFydCBnYW1lXCIsXG59O1xuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xubWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9IE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5zaGlwUGxhY2VtZW50QWZ0ZXJDbGljaztcblxubWFpbkFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBzd2l0Y2ggKG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQpIHtcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5nYW1lcGxheUFmdGVyQ2xpY2s6IHtcbiAgICAgIFB1YlN1Yi5lbWl0KFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5zaGlwUGxhY2VtZW50QWZ0ZXJDbGljazoge1xuICAgICAgUHViU3ViLmVtaXQoXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiKTtcbiAgICAgIG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPVxuICAgICAgICBNQUlOX0FDVElPTl9CVVRUT05fTkFNRVMuZ2FtZXBsYXlBZnRlckNsaWNrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFRpbGVVSSB9IGZyb20gXCIuLi90aWxlVUlcIjtcbmltcG9ydCB7IEJPQVJEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5cbmNvbnN0IFtncmlkTGVmdCwgZ3JpZFJpZ2h0XSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmlkXCIpO1xuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZExlZnQpO1xuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZFJpZ2h0KTtcbnNldEdyaWRUaWxlU2l6ZShncmlkTGVmdCk7XG5zZXRHcmlkVGlsZVNpemUoZ3JpZFJpZ2h0KTtcblxuZnVuY3Rpb24gZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZCkge1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1NJWkU7IHkrKykge1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQk9BUkRfU0laRTsgeCsrKSB7XG4gICAgICBjb25zdCB0aWxlID0gbmV3IFRpbGVVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCB4ICsgMSwgeSArIDEpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZCh0aWxlLnRpbGVFbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0R3JpZFRpbGVTaXplKGdyaWQpIHtcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1xuICAgIFRJTEVfU0laRV9QWCArIFwicHhcIlxuICB9KWA7XG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtUSUxFX1NJWkVfUFggKyBcInB4XCJ9KWA7XG59XG5cblB1YlN1Yi5vbihcImZpbGxHcmlkV2l0aENlbGxzXCIsIGZpbGxHcmlkV2l0aENlbGxzKTtcblB1YlN1Yi5vbihcInNldEdyaWRUaWxlU2l6ZVwiLCBzZXRHcmlkVGlsZVNpemUpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3V0aWxpdGllcy9ncmlkLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vc2hpcFVJXCI7XG5pbXBvcnQgXCIuL3RpbGVVSVwiO1xuaW1wb3J0IFwiLi91dGlsaXRpZXMvZG9jay1oYW5kbGVyXCI7XG5pbXBvcnQgXCIuL3V0aWxpdGllcy9nYW1lLWJ1dHRvbi1oYW5kbGVyXCI7XG5pbXBvcnQgXCIuL2dhbWVwbGF5L2dhbWVwbGF5LW9iamVjdHMtaGFuZGxlclwiO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9