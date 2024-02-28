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




const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();
const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();

const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player(playerBoard, computerBoard);
const computer = (0,_computer__WEBPACK_IMPORTED_MODULE_2__.ComputerPlayer)(computerBoard, playerBoard);


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
  offsetX = 0;
  offsetY = 0;
  tilesPlaced = [];

  constructor(shipElement, length) {
    ShipUI.allShips.push(this);
    const ID = ShipUI.generateShipID();
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

  // static generateShipID() {
  //   let id = null
  //   do {
  //     id = Math.random()
  //   }
  // }
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
      setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
      ShipUI.movableShip.tilesPlaced = [...tilesUnderShip];
    }
    reset(ShipUI.movableShip, isShipOverAnyTiles);
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
  filled = false;
  static allTiles = [];
  constructor(tileElement, x, y) {
    TileUI.allTiles.push(this);
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







console.log(Math.random());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0EsSUFBSTtBQUNKO0FBQ0EsSUFBSSwyQ0FBTTtBQUNWO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3BDa0M7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QjJDO0FBQ1Q7QUFDTztBQUNQOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLElBQUksa0RBQVUsRUFBRTtBQUNsQyxvQkFBb0IsSUFBSSxrREFBVSxFQUFFO0FBQ3BDLHVCQUF1QiwyQ0FBTTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxrREFBVSxDQUFDO0FBQ3hELElBQUksb0RBQVk7QUFDaEIsR0FBRztBQUNILDBDQUEwQyxrREFBVSxDQUFDLElBQUksb0RBQVksUUFBUTtBQUM3RTs7QUFFQSwyQ0FBTTtBQUNOLDJDQUFNOzs7Ozs7O1VDNUJOO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNoQjtBQUNBO0FBQ2dCO0FBQ087QUFDSTs7QUFFN0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dhbWVwbGF5L2NvbXB1dGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dhbWVwbGF5L2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9nYW1lcGxheS9nYW1lcGxheS1vYmplY3RzLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvcGxheWVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3NoaXBVSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy90aWxlVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2RvY2staGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy91dGlsaXRpZXMvZ2FtZS1idXR0b24taGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy91dGlsaXRpZXMvZ3JpZC1oYW5kbGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFB1YlN1YiA9ICgoKSA9PiB7XG4gIGNvbnN0IEVWRU5UUyA9IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdIHx8IFtdO1xuICAgIEVWRU5UU1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9XG5cbiAgZnVuY3Rpb24gb2ZmKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0uZmlsdGVyKFxuICAgICAgICAoY3VycmVudEZuKSA9PiBjdXJyZW50Rm4gIT0gZm5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUgKyBcIiBFVkVOVCBXQVMgQ0FMTEVEXCIpO1xuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0uZm9yRWFjaCgoZm4pID0+IHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBvbiwgb2ZmLCBlbWl0IH07XG59KSgpO1xuIiwiZXhwb3J0IGNvbnN0IFRJTEVfU0laRV9QWCA9IDUwO1xuZXhwb3J0IGNvbnN0IEJPQVJEX1NJWkUgPSAxMDtcbmV4cG9ydCBjb25zdCBTSElQX1BMQUNFTUVOVF9PTl9USUxFX1lfT0ZGU0VUID0gVElMRV9TSVpFX1BYIC8gMTA7XG5leHBvcnQgY29uc3QgU0hJUF9QTEFDRU1FTlRfT05fVElMRV9YX09GRlNFVCA9IFRJTEVfU0laRV9QWCAvIDEwO1xuXG4vLyBzaGlwIHNldHRpbmdzXG5leHBvcnQgY29uc3QgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgPSAtMTA7XG5leHBvcnQgY29uc3QgU0hJUF9XSURUSF9DT0VGRklDSUVOVCA9IC0xMDtcbiIsImltcG9ydCB7IEJPQVJEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21wdXRlclBsYXllcihjb21wdXRlckJvYXJkLCBlbmVteUJvYXJkKSB7XG4gIGNvbnN0IHVudXNlZENvb3JkaW5hdGVzT2JqID0gKCgpID0+IHtcbiAgICBjb25zdCB1bnVzZWRDb29yZGluYXRlc09iaiA9IHt9O1xuICAgIGNvbnN0IHlDb29yZGluYXRlc0luT25lQ29sdW1uID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwXTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IEJPQVJEX1NJWkU7IGkrKykge1xuICAgICAgdW51c2VkQ29vcmRpbmF0ZXNPYmpbaV0gPSBbLi4ueUNvb3JkaW5hdGVzSW5PbmVDb2x1bW5dO1xuICAgIH1cbiAgICByZXR1cm4gdW51c2VkQ29vcmRpbmF0ZXNPYmo7XG4gIH0pKCk7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudEZyb21BcnJheSh2YWx1ZSwgYXJyYXkpIHtcbiAgICBjb25zdCBhcnJheUNvcHkgPSBbLi4uYXJyYXldO1xuICAgIGNvbnN0IGluZGV4T2ZWYWx1ZSA9IGFycmF5Q29weS5pbmRleE9mKHZhbHVlKTtcbiAgICBhcnJheUNvcHkuc3BsaWNlKGluZGV4T2ZWYWx1ZSwgMSk7XG4gICAgcmV0dXJuIGFycmF5Q29weTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJhbmRvbUNvb3JkaW5hdGVzKCkge1xuICAgIGNvbnN0IHBvc3NpYmxlWFZhbHVlcyA9IE9iamVjdC5rZXlzKHVudXNlZENvb3JkaW5hdGVzT2JqKTtcbiAgICBjb25zdCB4ID1cbiAgICAgIHBvc3NpYmxlWFZhbHVlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZVhWYWx1ZXMubGVuZ3RoKV07XG4gICAgY29uc3QgcG9zc2libGVZVmFsdWVzID0gdW51c2VkQ29vcmRpbmF0ZXNPYmpbeF07XG4gICAgY29uc3QgeSA9XG4gICAgICBwb3NzaWJsZVlWYWx1ZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVZVmFsdWVzLmxlbmd0aCldO1xuXG4gICAgdW51c2VkQ29vcmRpbmF0ZXNPYmpbeF0gPSByZW1vdmVFbGVtZW50RnJvbUFycmF5KFxuICAgICAgeSxcbiAgICAgIHVudXNlZENvb3JkaW5hdGVzT2JqW3hdXG4gICAgKTtcbiAgICBpZiAodW51c2VkQ29vcmRpbmF0ZXNPYmpbeF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBkZWxldGUgdW51c2VkQ29vcmRpbmF0ZXNPYmpbeF07XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlVHVybigpIHtcbiAgICBjb25zdCBbeCwgeV0gPSBnZXRSYW5kb21Db29yZGluYXRlcygpO1xuICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgfVxuXG4gIHJldHVybiB7IHVudXNlZENvb3JkaW5hdGVzT2JqLCBtYWtlVHVybiB9O1xufVxuIiwiaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZnVuY3Rpb24gZ2V0QXJyYXlPZlNhbWVWYWx1ZXMoc2l6ZSwgdmFsdWUpIHtcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBhcnJheS5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgYXJyYXlbaV0ucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGNsYXNzIEdhbWVib2FyZCB7XG4gIGhpdENlbGxzQm9hcmRBcnJheSA9IGdldEFycmF5T2ZTYW1lVmFsdWVzKEJPQVJEX1NJWkUsIGZhbHNlKTtcbiAgc2hpcHNPbkJvYXJkQXJyYXkgPSBnZXRBcnJheU9mU2FtZVZhbHVlcyhCT0FSRF9TSVpFLCBudWxsKTtcbiAgbGlzdE9mU2hpcHMgPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcGxhY2UoeyBzaGlwT2JqLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy4jYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHN0YXJ0WCwgc3RhcnRZKSB8fFxuICAgICAgdGhpcy4jYXJlRW5kQ29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh7XG4gICAgICAgIHNoaXBMZW5ndGg6IHNoaXBPYmoubGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgIH0pIHx8XG4gICAgICB0aGlzLiNpc0ZpbGxlZFBhdGgoe1xuICAgICAgICBwYXRoTGVuZ3RoOiBzaGlwT2JqLmxlbmd0aCxcbiAgICAgICAgaXNWZXJ0aWNhbCxcbiAgICAgICAgc3RhcnRYLFxuICAgICAgICBzdGFydFksXG4gICAgICB9KVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2l2ZW4gY29vcmRpbmF0ZXMgYXJlIG91dCBvZiBib3VuZHMgb2YgdGhlIGdhbWVib2FyZFwiKTtcbiAgICB9XG5cbiAgICBbc3RhcnRYLCBzdGFydFldID0gdGhpcy4jY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3JkcyhzdGFydFgsIHN0YXJ0WSk7XG5cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgZm9yIChsZXQgY3VycmVudFkgPSAwOyBjdXJyZW50WSA8IHNoaXBPYmoubGVuZ3RoOyBjdXJyZW50WSsrKSB7XG4gICAgICAgIHRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbc3RhcnRZIC0gY3VycmVudFldW3N0YXJ0WF0gPSBzaGlwT2JqO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WCA9IDA7IGN1cnJlbnRYIDwgc2hpcE9iai5sZW5ndGg7IGN1cnJlbnRYKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVtzdGFydFldW3N0YXJ0WCArIGN1cnJlbnRYXSA9IHNoaXBPYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jYWRkU2hpcFRvTGlzdE9mU2hpcHMoc2hpcE9iaik7XG4gIH1cblxuICBpc1NoaXBQbGFjZWRPbkNvb3JkaW5hdGVzKHgsIHkpIHtcbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHJldHVybiAhIXRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKHgsIHkpIHtcbiAgICBpZiAodGhpcy4jYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHgsIHkpIHx8IHRoaXMuI2lzSGl0KHgsIHkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBjb29yZGluYXRlcyBhcmUgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ2FtZWJvYXJkXCIpO1xuICAgIH1cbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHRoaXMuaGl0Q2VsbHNCb2FyZEFycmF5W2FjdHVhbFldW2FjdHVhbFhdID0gdHJ1ZTtcblxuICAgIGNvbnN0IGhpdFNoaXAgPSB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFldW2FjdHVhbFhdO1xuICAgIGlmIChoaXRTaGlwKSB7XG4gICAgICBoaXRTaGlwLmhpdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhcmVBbGxTaGlwc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdE9mU2hpcHMuZXZlcnkoKHNoaXBPYmopID0+IHtcbiAgICAgIHJldHVybiBzaGlwT2JqLmlzU3VuaztcbiAgICB9KTtcbiAgfVxuXG4gICNpc0hpdCh4LCB5KSB7XG4gICAgY29uc3QgW2FjdHVhbFgsIGFjdHVhbFldID0gdGhpcy4jY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3Jkcyh4LCB5KTtcbiAgICByZXR1cm4gdGhpcy5oaXRDZWxsc0JvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gIH1cblxuICAjaXNGaWxsZWRQYXRoKHsgcGF0aExlbmd0aCwgaXNWZXJ0aWNhbCwgc3RhcnRYLCBzdGFydFkgfSkge1xuICAgIGNvbnN0IFthY3R1YWxTdGFydFgsIGFjdHVhbFN0YXJ0WV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKFxuICAgICAgc3RhcnRYLFxuICAgICAgc3RhcnRZXG4gICAgKTtcblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WSA9IDA7IGN1cnJlbnRZIDwgcGF0aExlbmd0aDsgY3VycmVudFkrKykge1xuICAgICAgICBpZiAoISF0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WSAtIGN1cnJlbnRZXVthY3R1YWxTdGFydFhdKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgY3VycmVudFggPSAwOyBjdXJyZW50WCA8IHBhdGhMZW5ndGg7IGN1cnJlbnRYKyspIHtcbiAgICAgICAgaWYgKCEhdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxTdGFydFldW2FjdHVhbFN0YXJ0WCArIGN1cnJlbnRYXSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgI2FkZFNoaXBUb0xpc3RPZlNoaXBzKHNoaXBPYmopIHtcbiAgICB0aGlzLmxpc3RPZlNoaXBzLnB1c2goc2hpcE9iaik7XG4gIH1cblxuICAjY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3Jkcyh4LCB5KSB7XG4gICAgcmV0dXJuIFt4IC0gMSwgeSAtIDFdO1xuICB9XG5cbiAgI2FyZVN0YXJ0Q29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh4LCB5KSB7XG4gICAgcmV0dXJuIHggPCAwIHx8IHkgPCAwIHx8IHggPiBCT0FSRF9TSVpFIHx8IHkgPiBCT0FSRF9TSVpFO1xuICB9XG5cbiAgI2FyZUVuZENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoeyBzaGlwTGVuZ3RoLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGNvbnN0IGVuZFkgPSBzdGFydFkgLSBzaGlwTGVuZ3RoO1xuICAgICAgcmV0dXJuIGVuZFkgPCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlbmRYID0gc3RhcnRYICsgc2hpcExlbmd0aCAtIDE7XG4gICAgICByZXR1cm4gZW5kWCA+IEJPQVJEX1NJWkU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBHYW1lYm9hcmQgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgQ29tcHV0ZXJQbGF5ZXIgfSBmcm9tIFwiLi9jb21wdXRlclwiO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG5cbmNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIocGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQpO1xuY29uc3QgY29tcHV0ZXIgPSBDb21wdXRlclBsYXllcihjb21wdXRlckJvYXJkLCBwbGF5ZXJCb2FyZCk7XG4iLCJleHBvcnQgZnVuY3Rpb24gUGxheWVyKGJvYXJkLCBlbmVteUJvYXJkKSB7XG4gIGNvbnN0IHRha2VUdXJuID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICB0cnkge1xuICAgICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiWW91ciBtb3ZlIGlzIGlsbGVnYWwhIFRyeSBoaXR0aW5nIGFub3RoZXIgY2VsbC5cIik7XG4gICAgfVxuICB9O1xuICByZXR1cm4geyB0YWtlVHVybiB9O1xufVxuIiwiaW1wb3J0IHtcbiAgU0hJUF9QTEFDRU1FTlRfT05fVElMRV9YX09GRlNFVCxcbiAgU0hJUF9QTEFDRU1FTlRfT05fVElMRV9ZX09GRlNFVCxcbiAgVElMRV9TSVpFX1BYLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xuaW1wb3J0IHsgU0hJUF9XSURUSF9DT0VGRklDSUVOVCwgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldFRpbGVzVW5kZXJTaGlwIH0gZnJvbSBcIi4vdGlsZVVJXCI7XG5leHBvcnQgY2xhc3MgU2hpcFVJIHtcbiAgc3RhdGljIG1vdmFibGVTaGlwID0gbnVsbDtcbiAgc3RhdGljIGFsbFNoaXBzID0gW107XG4gIHN0YXRpYyB1c2VkSURzID0gW107XG4gIG9mZnNldFggPSAwO1xuICBvZmZzZXRZID0gMDtcbiAgdGlsZXNQbGFjZWQgPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzaGlwRWxlbWVudCwgbGVuZ3RoKSB7XG4gICAgU2hpcFVJLmFsbFNoaXBzLnB1c2godGhpcyk7XG4gICAgY29uc3QgSUQgPSBTaGlwVUkuZ2VuZXJhdGVTaGlwSUQoKTtcbiAgICB0aGlzLmlkID0gSUQ7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICB0aGlzLnNoaXBFbGVtZW50ID0gc2hpcEVsZW1lbnQ7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5pZCA9IElEO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRvY2stc2hpcFwiKTtcbiAgICB0aGlzLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoYGxlbmd0aC0ke2xlbmd0aH1gKTtcbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLndpZHRoID1cbiAgICAgIGxlbmd0aCAqIFRJTEVfU0laRV9QWCArIFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgKyBcInB4XCI7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5oZWlnaHQgPVxuICAgICAgVElMRV9TSVpFX1BYICsgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgKyBcInB4XCI7XG5cbiAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB0aGlzLm9yaWdpblkgPSByZWN0LnRvcDtcbiAgICB0aGlzLm9yaWdpblggPSByZWN0LmxlZnQ7XG5cbiAgICBzaGlwRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICBTaGlwVUkubW92YWJsZVNoaXAgPSB0aGlzO1xuXG4gICAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMub2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgdGhpcy5vZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgY29uc29sZS5sb2coZS5jbGllbnRZLCByZWN0LnRvcCwgdGhpcy5vZmZzZXRZKTtcbiAgICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgfSk7XG4gIH1cblxuICAvLyBzdGF0aWMgZ2VuZXJhdGVTaGlwSUQoKSB7XG4gIC8vICAgbGV0IGlkID0gbnVsbFxuICAvLyAgIGRvIHtcbiAgLy8gICAgIGlkID0gTWF0aC5yYW5kb20oKVxuICAvLyAgIH1cbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBzZXRTaGlwT3JpZ2luVG9UaWxlKHNoaXBVSSwgdGlsZVVJKSB7XG4gIGNvbnN0IHRpbGVSZWN0ID0gdGlsZVVJLnRpbGVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBzaGlwVUkub3JpZ2luWSA9XG4gICAgdGlsZVJlY3QudG9wICtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wICtcbiAgICBTSElQX1BMQUNFTUVOVF9PTl9USUxFX1lfT0ZGU0VUO1xuICBzaGlwVUkub3JpZ2luWCA9IHRpbGVSZWN0LmxlZnQgKyBTSElQX1BMQUNFTUVOVF9PTl9USUxFX1hfT0ZGU0VUO1xufVxuXG5mdW5jdGlvbiBtb3ZlKGUsIHNoaXApIHtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS50b3AgPSBlLnBhZ2VZIC0gc2hpcC5vZmZzZXRZICsgXCJweFwiO1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYIC0gc2hpcC5vZmZzZXRYICsgXCJweFwiO1xufVxuXG5mdW5jdGlvbiByZXNldChzaGlwLCBpc1NoaXBPdmVyQW55VGlsZXMpIHtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS50b3AgPSBTaGlwVUkubW92YWJsZVNoaXAub3JpZ2luWSArIFwicHhcIjtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gU2hpcFVJLm1vdmFibGVTaGlwLm9yaWdpblggKyBcInB4XCI7XG4gIGlmICghaXNTaGlwT3ZlckFueVRpbGVzKSB7XG4gICAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwic3RhdGljXCI7XG4gIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xuICBpZiAoU2hpcFVJLm1vdmFibGVTaGlwKSB7XG4gICAgbW92ZShlLCBTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIFB1YlN1Yi5lbWl0KFwic2hpcElzTW92aW5nXCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gIH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoKSA9PiB7XG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcbiAgICBQdWJTdWIuZW1pdChcIm5vU2hpcE1vdmVtZW50XCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgY29uc3QgdGlsZXNVbmRlclNoaXAgPSBnZXRUaWxlc1VuZGVyU2hpcChTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIGNvbnN0IGlzU2hpcE92ZXJBbnlUaWxlcyA9IHRpbGVzVW5kZXJTaGlwLmxlbmd0aCA+IDA7XG5cbiAgICBpZiAoaXNTaGlwT3ZlckFueVRpbGVzKSB7XG4gICAgICBzZXRTaGlwT3JpZ2luVG9UaWxlKFNoaXBVSS5tb3ZhYmxlU2hpcCwgdGlsZXNVbmRlclNoaXBbMF0pO1xuICAgICAgU2hpcFVJLm1vdmFibGVTaGlwLnRpbGVzUGxhY2VkID0gWy4uLnRpbGVzVW5kZXJTaGlwXTtcbiAgICB9XG4gICAgcmVzZXQoU2hpcFVJLm1vdmFibGVTaGlwLCBpc1NoaXBPdmVyQW55VGlsZXMpO1xuICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IG51bGw7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcblxuZnVuY3Rpb24gc2hpcElzT3ZlclRpbGUodGlsZSwgc2hpcCwgbGVuZ3RoLCBpc1JvdGF0ZWQsIGJhc2VMZW5ndGgpIHtcbiAgY29uc3QgdGlsZVJlY3QgPSB0aWxlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBzaGlwUmVjdCA9IHNoaXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGRpZmZlcmVuY2VUb3AgPSBNYXRoLmFicyh0aWxlUmVjdC50b3AgLSBzaGlwUmVjdC50b3ApO1xuICAgIGNvbnN0IGRpZmZlcmVuY2VMZWZ0ID0gTWF0aC5hYnModGlsZVJlY3QubGVmdCAtIHNoaXBSZWN0LmxlZnQpO1xuICAgIGNvbnN0IGRpZmZlcmVuY2VCb3R0b20gPSBpc1JvdGF0ZWRcbiAgICAgID8gTWF0aC5hYnModGlsZVJlY3QuYm90dG9tIC0gKHNoaXBSZWN0LmJvdHRvbSAtIGJhc2VMZW5ndGggKiBpKSlcbiAgICAgIDogTWF0aC5hYnModGlsZVJlY3QuYm90dG9tIC0gc2hpcFJlY3QuYm90dG9tKTtcbiAgICBjb25zdCBkaWZmZXJlbmNlUmlnaHQgPSBpc1JvdGF0ZWRcbiAgICAgID8gTWF0aC5hYnModGlsZVJlY3QucmlnaHQgLSBzaGlwUmVjdC5yaWdodClcbiAgICAgIDogTWF0aC5hYnModGlsZVJlY3QucmlnaHQgLSAoc2hpcFJlY3QucmlnaHQgLSBiYXNlTGVuZ3RoICogaSkpO1xuXG4gICAgaWYgKFxuICAgICAgKGRpZmZlcmVuY2VUb3AgPCB0aWxlUmVjdC5oZWlnaHQgLyAyIHx8XG4gICAgICAgIGRpZmZlcmVuY2VMZWZ0IDwgdGlsZVJlY3Qud2lkdGggLyAyKSAmJlxuICAgICAgZGlmZmVyZW5jZUJvdHRvbSA8IHRpbGVSZWN0LmhlaWdodCAvIDIgJiZcbiAgICAgIGRpZmZlcmVuY2VSaWdodCA8IHRpbGVSZWN0LndpZHRoIC8gMiAmJlxuICAgICAgZGlmZmVyZW5jZVRvcCA8IHRpbGVSZWN0LmhlaWdodCAvIDJcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGVzVW5kZXJTaGlwKHNoaXBVSSkge1xuICByZXR1cm4gVGlsZVVJLmFsbFRpbGVzLmZpbHRlcigodGlsZVVJKSA9PlxuICAgIHNoaXBJc092ZXJUaWxlKFxuICAgICAgdGlsZVVJLnRpbGVFbGVtZW50LFxuICAgICAgc2hpcFVJLnNoaXBFbGVtZW50LFxuICAgICAgc2hpcFVJLmxlbmd0aCxcbiAgICAgIGZhbHNlLFxuICAgICAgVElMRV9TSVpFX1BYXG4gICAgKVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgVGlsZVVJIHtcbiAgZmlsbGVkID0gZmFsc2U7XG4gIHN0YXRpYyBhbGxUaWxlcyA9IFtdO1xuICBjb25zdHJ1Y3Rvcih0aWxlRWxlbWVudCwgeCwgeSkge1xuICAgIFRpbGVVSS5hbGxUaWxlcy5wdXNoKHRoaXMpO1xuICAgIHRoaXMudGlsZUVsZW1lbnQgPSB0aWxlRWxlbWVudDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0aWxlXCIpO1xuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC54ID0geDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueSA9IHk7XG4gICAgdGhpcy50aWxlRWxlbWVudC53aWR0aCA9IFRJTEVfU0laRV9QWCArIFwicHhcIjtcblxuICAgIFB1YlN1Yi5vbihcInNoaXBJc01vdmluZ1wiLCAoc2hpcCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBzaGlwSXNPdmVyVGlsZShcbiAgICAgICAgICB0aGlzLnRpbGVFbGVtZW50LFxuICAgICAgICAgIHNoaXAuc2hpcEVsZW1lbnQsXG4gICAgICAgICAgc2hpcC5sZW5ndGgsXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgVElMRV9TSVpFX1BYXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJob3ZlcmVkV2l0aFNoaXBcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkV2l0aFNoaXBcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgUHViU3ViLm9uKFwibm9TaGlwTW92ZW1lbnRcIiwgKCkgPT4ge1xuICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5pbXBvcnQgeyBTaGlwVUkgfSBmcm9tIFwiLi4vc2hpcFVJXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoaXBVSShsZW5ndGgpIHtcbiAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwVUkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgbGVuZ3RoKTtcbiAgcmV0dXJuIHNoaXAuc2hpcEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHB1c2hTaGlwVG9Eb2NrKHNoaXBFbGVtZW50KSB7XG4gIGRvY2suYXBwZW5kQ2hpbGQoc2hpcEVsZW1lbnQpO1xufVxuXG5jb25zdCBkb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NrXCIpO1xuXG5QdWJTdWIub24oXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiLCAoKSA9PiB7XG4gIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuXG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSg0KSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgzKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgzKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxKSk7XG59KTtcblxuUHViU3ViLm9uKFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiLCAoKSA9PiB7XG4gIGlmIChkb2NrLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBhbGVydChcIkRvY2sgaXMgbm90IGVtcHR5IVwiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcIk5vbmVcIjtcbiAgICBQdWJTdWIuZW1pdChcImdhbWVTdGFydHNcIik7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuXG5jb25zdCBNQUlOX0FDVElPTl9CVVRUT05fTkFNRVMgPSB7XG4gIHNoaXBQbGFjZW1lbnRBZnRlckNsaWNrOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcbiAgZ2FtZXBsYXlBZnRlckNsaWNrOiBcIlN0YXJ0IGdhbWVcIixcbn07XG5jb25zdCBtYWluQWN0aW9uQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWFjdGlvbi1idXR0b25cIik7XG5tYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID0gTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLnNoaXBQbGFjZW1lbnRBZnRlckNsaWNrO1xuXG5tYWluQWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIHN3aXRjaCAobWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCkge1xuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLmdhbWVwbGF5QWZ0ZXJDbGljazoge1xuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLnNoaXBQbGFjZW1lbnRBZnRlckNsaWNrOiB7XG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIpO1xuICAgICAgbWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5nYW1lcGxheUFmdGVyQ2xpY2s7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGlsZVVJIH0gZnJvbSBcIi4uL3RpbGVVSVwiO1xuaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcblxuY29uc3QgW2dyaWRMZWZ0LCBncmlkUmlnaHRdID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyaWRcIik7XG5maWxsR3JpZFdpdGhDZWxscyhncmlkTGVmdCk7XG5maWxsR3JpZFdpdGhDZWxscyhncmlkUmlnaHQpO1xuc2V0R3JpZFRpbGVTaXplKGdyaWRMZWZ0KTtcbnNldEdyaWRUaWxlU2l6ZShncmlkUmlnaHQpO1xuXG5mdW5jdGlvbiBmaWxsR3JpZFdpdGhDZWxscyhncmlkKSB7XG4gIGZvciAobGV0IHkgPSAwOyB5IDwgQk9BUkRfU0laRTsgeSsrKSB7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9TSVpFOyB4KyspIHtcbiAgICAgIGNvbnN0IHRpbGUgPSBuZXcgVGlsZVVJKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksIHggKyAxLCB5ICsgMSk7XG4gICAgICBncmlkLmFwcGVuZENoaWxkKHRpbGUudGlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRHcmlkVGlsZVNpemUoZ3JpZCkge1xuICBncmlkLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Qk9BUkRfU0laRX0sICR7XG4gICAgVElMRV9TSVpFX1BYICsgXCJweFwiXG4gIH0pYDtcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1RJTEVfU0laRV9QWCArIFwicHhcIn0pYDtcbn1cblxuUHViU3ViLm9uKFwiZmlsbEdyaWRXaXRoQ2VsbHNcIiwgZmlsbEdyaWRXaXRoQ2VsbHMpO1xuUHViU3ViLm9uKFwic2V0R3JpZFRpbGVTaXplXCIsIHNldEdyaWRUaWxlU2l6ZSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vdXRpbGl0aWVzL2dyaWQtaGFuZGxlclwiO1xuaW1wb3J0IFwiLi9zaGlwVUlcIjtcbmltcG9ydCBcIi4vdGlsZVVJXCI7XG5pbXBvcnQgXCIuL3V0aWxpdGllcy9kb2NrLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vdXRpbGl0aWVzL2dhbWUtYnV0dG9uLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vZ2FtZXBsYXkvZ2FtZXBsYXktb2JqZWN0cy1oYW5kbGVyXCI7XG5cbmNvbnNvbGUubG9nKE1hdGgucmFuZG9tKCkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9