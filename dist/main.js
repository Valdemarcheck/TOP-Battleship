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
/* harmony export */   SHIP_WIDTH_COEFFICIENT: () => (/* binding */ SHIP_WIDTH_COEFFICIENT),
/* harmony export */   TILE_SIZE_PX: () => (/* binding */ TILE_SIZE_PX)
/* harmony export */ });
const TILE_SIZE_PX = 50;
const BOARD_SIZE = 10;

// ship settings
const SHIP_HEIGHT_COEFFICIENT = -10;
const SHIP_WIDTH_COEFFICIENT = -10;


/***/ }),

/***/ "./src/dock-manager.js":
/*!*****************************!*\
  !*** ./src/dock-manager.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
/* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shipUI */ "./src/shipUI.js");


const SHIPS = [];

function createShip(length) {
  const ship = new _shipUI__WEBPACK_IMPORTED_MODULE_1__.ShipUI(document.createElement("div"), length);
  SHIPS.push(ship);
  return ship.shipElement;
}

function pushShipToDock(shipElement) {
  dock.appendChild(shipElement);
}

const dock = document.querySelector(".dock");

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipToDock(createShip(4));
  pushShipToDock(createShip(3));
  pushShipToDock(createShip(3));
  pushShipToDock(createShip(2));
  pushShipToDock(createShip(2));
  pushShipToDock(createShip(2));
  pushShipToDock(createShip(1));
  pushShipToDock(createShip(1));
  pushShipToDock(createShip(1));
  pushShipToDock(createShip(1));
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

/***/ "./src/grid-setup.js":
/*!***************************!*\
  !*** ./src/grid-setup.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillGridWithCells: () => (/* binding */ fillGridWithCells),
/* harmony export */   setGridTileSize: () => (/* binding */ setGridTileSize)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");




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



class ShipUI {
  static movableShip = null;
  offsetX = 0;
  offsetY = 0;
  tilesPlaced = [];

  constructor(shipElement, length) {
    this.length = length;
    this.shipElement = shipElement;
    this.shipElement.classList.add("dock-ship");
    this.shipElement.classList.add(`length-${length}`);
    this.shipElement.style.width =
      length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_WIDTH_COEFFICIENT + "px";
    this.shipElement.style.height =
      _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_HEIGHT_COEFFICIENT + "px";

    const rect = this.shipElement.getBoundingClientRect();
    this.startY = rect.top;
    this.startX = rect.left;

    shipElement.addEventListener("mousedown", (e) => {
      ShipUI.movableShip = this;

      const rect = this.shipElement.getBoundingClientRect();
      this.offsetY = e.clientY - rect.top;
      this.offsetX = e.clientX - rect.left;
      console.log(e.clientY, rect.top, this.offsetY);
      this.shipElement.style.position = "absolute";
    });
  }
}

function move(e, ship) {
  ship.shipElement.style.top = e.pageY - ship.offsetY + "px";
  ship.shipElement.style.left = e.pageX - ship.offsetX + "px";
}

function reset(ship) {
  ship.shipElement.style.top = ShipUI.movableShip.startY + "px";
  ship.shipElement.style.left = ShipUI.movableShip.startX + "px";
  ship.shipElement.style.position = "static";
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
    reset(ShipUI.movableShip);
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
/* harmony export */   TileUI: () => (/* binding */ TileUI)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");



function elementIsInside(inner, outer, length, isRotated, baseLength) {
  const innerRect = inner.getBoundingClientRect();
  const outerRect = outer.getBoundingClientRect();

  for (let i = 0; i < length; i++) {
    const differenceTop = Math.abs(innerRect.top - outerRect.top);
    const differenceLeft = Math.abs(innerRect.left - outerRect.left);
    const differenceBottom = isRotated
      ? Math.abs(innerRect.bottom - (outerRect.bottom - baseLength * i))
      : Math.abs(innerRect.bottom - outerRect.bottom);
    const differenceRight = isRotated
      ? Math.abs(innerRect.right - outerRect.right)
      : Math.abs(innerRect.right - (outerRect.right - baseLength * i));

    if (
      (differenceTop < innerRect.height / 2 ||
        differenceLeft < innerRect.width / 2) &&
      differenceBottom < innerRect.height / 2 &&
      differenceRight < innerRect.width / 2 &&
      differenceTop < innerRect.height / 2
    ) {
      return true;
    }
  }

  return false;
}

class TileUI {
  filled = false;
  constructor(tileElement, x, y) {
    this.tileElement = tileElement;
    this.tileElement.classList.add("tile");
    this.tileElement.dataset.x = x;
    this.tileElement.dataset.y = y;
    this.tileElement.width = _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";

    _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on("shipIsMoving", (ship) => {
      if (
        elementIsInside(
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
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
/* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shipUI */ "./src/shipUI.js");
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
/* harmony import */ var _dock_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dock-manager */ "./src/dock-manager.js");
/* harmony import */ var _grid_setup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./grid-setup */ "./src/grid-setup.js");






const MAIN_ACTION_BUTTON_PRESET_NAMES = {
  nextPlacementStage: "Start placing ships",
  nextGameStage: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent =
  MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage;

const [gridLeft, gridRight] = document.getElementsByClassName("grid");
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_4__.setGridTileSize)(gridLeft);
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_4__.setGridTileSize)(gridRight);
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_4__.fillGridWithCells)(gridLeft);
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_4__.fillGridWithCells)(gridRight);

mainActionButton.addEventListener("click", () => {
  switch (mainActionButton.textContent) {
    case MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage: {
      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("checkIfAllShipsWerePlaced");
      break;
    }
    case MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage: {
      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("placementOfShipsHasStarted");
      mainActionButton.textContent =
        MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage;
      break;
    }
  }
});

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("gameStarts", () => {
  mainActionButton.style.display = "None";
  gridLeft.childNodes.forEach((tile) => {
    tile.classList.add("greyed-out");
  });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNoQjtBQUNBO0FBQ007QUFDMEM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBZTtBQUNmLDREQUFlO0FBQ2YsOERBQWlCO0FBQ2pCLDhEQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sMkNBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDJDQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2RvY2stbWFuYWdlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9ncmlkLXNldHVwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3NoaXBVSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy90aWxlVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgUHViU3ViID0gKCgpID0+IHtcclxuICBjb25zdCBFVkVOVFMgPSB7fTtcclxuXHJcbiAgZnVuY3Rpb24gb24oZXZlbnROYW1lLCBmbikge1xyXG4gICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXSB8fCBbXTtcclxuICAgIEVWRU5UU1tldmVudE5hbWVdLnB1c2goZm4pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb2ZmKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xyXG4gICAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdLmZpbHRlcihcclxuICAgICAgICAoY3VycmVudEZuKSA9PiBjdXJyZW50Rm4gIT0gZm5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUgKyBcIiBFVkVOVCBXQVMgQ0FMTEVEXCIpO1xyXG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XHJcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgZm4oZGF0YSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgb24sIG9mZiwgZW1pdCB9O1xyXG59KSgpO1xyXG4iLCJleHBvcnQgY29uc3QgVElMRV9TSVpFX1BYID0gNTA7XHJcbmV4cG9ydCBjb25zdCBCT0FSRF9TSVpFID0gMTA7XHJcblxyXG4vLyBzaGlwIHNldHRpbmdzXHJcbmV4cG9ydCBjb25zdCBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCA9IC0xMDtcclxuZXhwb3J0IGNvbnN0IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgPSAtMTA7XHJcbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5pbXBvcnQgeyBTaGlwVUkgfSBmcm9tIFwiLi9zaGlwVUlcIjtcclxuY29uc3QgU0hJUFMgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNoaXAobGVuZ3RoKSB7XHJcbiAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwVUkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgbGVuZ3RoKTtcclxuICBTSElQUy5wdXNoKHNoaXApO1xyXG4gIHJldHVybiBzaGlwLnNoaXBFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwdXNoU2hpcFRvRG9jayhzaGlwRWxlbWVudCkge1xyXG4gIGRvY2suYXBwZW5kQ2hpbGQoc2hpcEVsZW1lbnQpO1xyXG59XHJcblxyXG5jb25zdCBkb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NrXCIpO1xyXG5cclxuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgKCkgPT4ge1xyXG4gIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG5cclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDQpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDMpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDMpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDIpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDIpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDIpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDEpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDEpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDEpKTtcclxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDEpKTtcclxufSk7XHJcblxyXG5QdWJTdWIub24oXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIsICgpID0+IHtcclxuICBpZiAoZG9jay5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICBhbGVydChcIkRvY2sgaXMgbm90IGVtcHR5IVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XHJcbiAgICBQdWJTdWIuZW1pdChcImdhbWVTdGFydHNcIik7XHJcbiAgfVxyXG59KTtcclxuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IFRpbGVVSSB9IGZyb20gXCIuL3RpbGVVSVwiO1xyXG5pbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZCkge1xyXG4gIGZvciAobGV0IHkgPSAwOyB5IDwgQk9BUkRfU0laRTsgeSsrKSB7XHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEJPQVJEX1NJWkU7IHgrKykge1xyXG4gICAgICBjb25zdCB0aWxlID0gbmV3IFRpbGVVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCB4ICsgMSwgeSArIDEpO1xyXG4gICAgICBncmlkLmFwcGVuZENoaWxkKHRpbGUudGlsZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEdyaWRUaWxlU2l6ZShncmlkKSB7XHJcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1xyXG4gICAgVElMRV9TSVpFX1BYICsgXCJweFwiXHJcbiAgfSlgO1xyXG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtUSUxFX1NJWkVfUFggKyBcInB4XCJ9KWA7XHJcbn1cclxuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5pbXBvcnQgeyBTSElQX1dJRFRIX0NPRUZGSUNJRU5ULCBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5leHBvcnQgY2xhc3MgU2hpcFVJIHtcclxuICBzdGF0aWMgbW92YWJsZVNoaXAgPSBudWxsO1xyXG4gIG9mZnNldFggPSAwO1xyXG4gIG9mZnNldFkgPSAwO1xyXG4gIHRpbGVzUGxhY2VkID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNoaXBFbGVtZW50LCBsZW5ndGgpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgdGhpcy5zaGlwRWxlbWVudCA9IHNoaXBFbGVtZW50O1xyXG4gICAgdGhpcy5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZG9jay1zaGlwXCIpO1xyXG4gICAgdGhpcy5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBsZW5ndGgtJHtsZW5ndGh9YCk7XHJcbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLndpZHRoID1cclxuICAgICAgbGVuZ3RoICogVElMRV9TSVpFX1BYICsgU0hJUF9XSURUSF9DT0VGRklDSUVOVCArIFwicHhcIjtcclxuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID1cclxuICAgICAgVElMRV9TSVpFX1BYICsgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgKyBcInB4XCI7XHJcblxyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuc2hpcEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLnN0YXJ0WSA9IHJlY3QudG9wO1xyXG4gICAgdGhpcy5zdGFydFggPSByZWN0LmxlZnQ7XHJcblxyXG4gICAgc2hpcEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICBTaGlwVUkubW92YWJsZVNoaXAgPSB0aGlzO1xyXG5cclxuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuc2hpcEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHRoaXMub2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gICAgICB0aGlzLm9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuY2xpZW50WSwgcmVjdC50b3AsIHRoaXMub2Zmc2V0WSk7XHJcbiAgICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vdmUoZSwgc2hpcCkge1xyXG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUudG9wID0gZS5wYWdlWSAtIHNoaXAub2Zmc2V0WSArIFwicHhcIjtcclxuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYIC0gc2hpcC5vZmZzZXRYICsgXCJweFwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldChzaGlwKSB7XHJcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS50b3AgPSBTaGlwVUkubW92YWJsZVNoaXAuc3RhcnRZICsgXCJweFwiO1xyXG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUubGVmdCA9IFNoaXBVSS5tb3ZhYmxlU2hpcC5zdGFydFggKyBcInB4XCI7XHJcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwic3RhdGljXCI7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IHtcclxuICBpZiAoU2hpcFVJLm1vdmFibGVTaGlwKSB7XHJcbiAgICBtb3ZlKGUsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XHJcbiAgICBQdWJTdWIuZW1pdChcInNoaXBJc01vdmluZ1wiLCBTaGlwVUkubW92YWJsZVNoaXApO1xyXG4gIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoKSA9PiB7XHJcbiAgaWYgKFNoaXBVSS5tb3ZhYmxlU2hpcCkge1xyXG4gICAgUHViU3ViLmVtaXQoXCJub1NoaXBNb3ZlbWVudFwiLCBTaGlwVUkubW92YWJsZVNoaXApO1xyXG4gICAgcmVzZXQoU2hpcFVJLm1vdmFibGVTaGlwKTtcclxuICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IG51bGw7XHJcbiAgfVxyXG59KTtcclxuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5cclxuZnVuY3Rpb24gZWxlbWVudElzSW5zaWRlKGlubmVyLCBvdXRlciwgbGVuZ3RoLCBpc1JvdGF0ZWQsIGJhc2VMZW5ndGgpIHtcclxuICBjb25zdCBpbm5lclJlY3QgPSBpbm5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICBjb25zdCBvdXRlclJlY3QgPSBvdXRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZVRvcCA9IE1hdGguYWJzKGlubmVyUmVjdC50b3AgLSBvdXRlclJlY3QudG9wKTtcclxuICAgIGNvbnN0IGRpZmZlcmVuY2VMZWZ0ID0gTWF0aC5hYnMoaW5uZXJSZWN0LmxlZnQgLSBvdXRlclJlY3QubGVmdCk7XHJcbiAgICBjb25zdCBkaWZmZXJlbmNlQm90dG9tID0gaXNSb3RhdGVkXHJcbiAgICAgID8gTWF0aC5hYnMoaW5uZXJSZWN0LmJvdHRvbSAtIChvdXRlclJlY3QuYm90dG9tIC0gYmFzZUxlbmd0aCAqIGkpKVxyXG4gICAgICA6IE1hdGguYWJzKGlubmVyUmVjdC5ib3R0b20gLSBvdXRlclJlY3QuYm90dG9tKTtcclxuICAgIGNvbnN0IGRpZmZlcmVuY2VSaWdodCA9IGlzUm90YXRlZFxyXG4gICAgICA/IE1hdGguYWJzKGlubmVyUmVjdC5yaWdodCAtIG91dGVyUmVjdC5yaWdodClcclxuICAgICAgOiBNYXRoLmFicyhpbm5lclJlY3QucmlnaHQgLSAob3V0ZXJSZWN0LnJpZ2h0IC0gYmFzZUxlbmd0aCAqIGkpKTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIChkaWZmZXJlbmNlVG9wIDwgaW5uZXJSZWN0LmhlaWdodCAvIDIgfHxcclxuICAgICAgICBkaWZmZXJlbmNlTGVmdCA8IGlubmVyUmVjdC53aWR0aCAvIDIpICYmXHJcbiAgICAgIGRpZmZlcmVuY2VCb3R0b20gPCBpbm5lclJlY3QuaGVpZ2h0IC8gMiAmJlxyXG4gICAgICBkaWZmZXJlbmNlUmlnaHQgPCBpbm5lclJlY3Qud2lkdGggLyAyICYmXHJcbiAgICAgIGRpZmZlcmVuY2VUb3AgPCBpbm5lclJlY3QuaGVpZ2h0IC8gMlxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGlsZVVJIHtcclxuICBmaWxsZWQgPSBmYWxzZTtcclxuICBjb25zdHJ1Y3Rvcih0aWxlRWxlbWVudCwgeCwgeSkge1xyXG4gICAgdGhpcy50aWxlRWxlbWVudCA9IHRpbGVFbGVtZW50O1xyXG4gICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGlsZVwiKTtcclxuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC54ID0geDtcclxuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC55ID0geTtcclxuICAgIHRoaXMudGlsZUVsZW1lbnQud2lkdGggPSBUSUxFX1NJWkVfUFggKyBcInB4XCI7XHJcblxyXG4gICAgUHViU3ViLm9uKFwic2hpcElzTW92aW5nXCIsIChzaGlwKSA9PiB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBlbGVtZW50SXNJbnNpZGUoXHJcbiAgICAgICAgICB0aGlzLnRpbGVFbGVtZW50LFxyXG4gICAgICAgICAgc2hpcC5zaGlwRWxlbWVudCxcclxuICAgICAgICAgIHNoaXAubGVuZ3RoLFxyXG4gICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICBUSUxFX1NJWkVfUFhcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhvdmVyZWRXaXRoU2hpcFwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkV2l0aFNoaXBcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgUHViU3ViLm9uKFwibm9TaGlwTW92ZW1lbnRcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkV2l0aFNoaXBcIik7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcclxuaW1wb3J0IFwiLi9zaGlwVUlcIjtcclxuaW1wb3J0IFwiLi90aWxlVUlcIjtcclxuaW1wb3J0IFwiLi9kb2NrLW1hbmFnZXJcIjtcclxuaW1wb3J0IHsgc2V0R3JpZFRpbGVTaXplLCBmaWxsR3JpZFdpdGhDZWxscyB9IGZyb20gXCIuL2dyaWQtc2V0dXBcIjtcclxuXHJcbmNvbnN0IE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMgPSB7XHJcbiAgbmV4dFBsYWNlbWVudFN0YWdlOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcclxuICBuZXh0R2FtZVN0YWdlOiBcIlN0YXJ0IGdhbWVcIixcclxufTtcclxuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xyXG5tYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID1cclxuICBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRQbGFjZW1lbnRTdGFnZTtcclxuXHJcbmNvbnN0IFtncmlkTGVmdCwgZ3JpZFJpZ2h0XSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmlkXCIpO1xyXG5zZXRHcmlkVGlsZVNpemUoZ3JpZExlZnQpO1xyXG5zZXRHcmlkVGlsZVNpemUoZ3JpZFJpZ2h0KTtcclxuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZExlZnQpO1xyXG5maWxsR3JpZFdpdGhDZWxscyhncmlkUmlnaHQpO1xyXG5cclxubWFpbkFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHN3aXRjaCAobWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCkge1xyXG4gICAgY2FzZSBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRHYW1lU3RhZ2U6IHtcclxuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0UGxhY2VtZW50U3RhZ2U6IHtcclxuICAgICAgUHViU3ViLmVtaXQoXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiKTtcclxuICAgICAgbWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0R2FtZVN0YWdlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuUHViU3ViLm9uKFwiZ2FtZVN0YXJ0c1wiLCAoKSA9PiB7XHJcbiAgbWFpbkFjdGlvbkJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XHJcbiAgZ3JpZExlZnQuY2hpbGROb2Rlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJncmV5ZWQtb3V0XCIpO1xyXG4gIH0pO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9