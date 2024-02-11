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
/* harmony export */   TILE_SIZE_PX: () => (/* binding */ TILE_SIZE_PX)
/* harmony export */ });
const TILE_SIZE_PX = 50;
const BOARD_SIZE = 10;


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


const SHIP_HEIGHT_COEFFICIENT = -10;
const SHIP_WIDTH_COEFFICIENT = -10;
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
      length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + SHIP_WIDTH_COEFFICIENT + "px";
    this.shipElement.style.height =
      _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + SHIP_HEIGHT_COEFFICIENT + "px";

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
      (differenceTop <= innerRect.height / 2 ||
        differenceLeft <= innerRect.width / 2) &&
      differenceBottom <= innerRect.height / 2 &&
      differenceRight <= innerRect.width / 2
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aEI7QUFDQTtBQUNNO0FBQzBDO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQWU7QUFDZiw0REFBZTtBQUNmLDhEQUFpQjtBQUNqQiw4REFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQ0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvUHViU3ViLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9kb2NrLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ3JpZC1zZXR1cC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9zaGlwVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdGlsZVVJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFB1YlN1YiA9ICgoKSA9PiB7XHJcbiAgY29uc3QgRVZFTlRTID0ge307XHJcblxyXG4gIGZ1bmN0aW9uIG9uKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0gfHwgW107XHJcbiAgICBFVkVOVFNbZXZlbnROYW1lXS5wdXNoKGZuKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9mZihldmVudE5hbWUsIGZuKSB7XHJcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcclxuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXS5maWx0ZXIoXHJcbiAgICAgICAgKGN1cnJlbnRGbikgPT4gY3VycmVudEZuICE9IGZuXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgY29uc29sZS5sb2coZXZlbnROYW1lICsgXCIgRVZFTlQgV0FTIENBTExFRFwiKTtcclxuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xyXG4gICAgICBFVkVOVFNbZXZlbnROYW1lXS5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgIGZuKGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IG9uLCBvZmYsIGVtaXQgfTtcclxufSkoKTtcclxuIiwiZXhwb3J0IGNvbnN0IFRJTEVfU0laRV9QWCA9IDUwO1xyXG5leHBvcnQgY29uc3QgQk9BUkRfU0laRSA9IDEwO1xyXG4iLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcclxuaW1wb3J0IHsgU2hpcFVJIH0gZnJvbSBcIi4vc2hpcFVJXCI7XHJcbmNvbnN0IFNISVBTID0gW107XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTaGlwKGxlbmd0aCkge1xyXG4gIGNvbnN0IHNoaXAgPSBuZXcgU2hpcFVJKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksIGxlbmd0aCk7XHJcbiAgU0hJUFMucHVzaChzaGlwKTtcclxuICByZXR1cm4gc2hpcC5zaGlwRWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gcHVzaFNoaXBUb0RvY2soc2hpcEVsZW1lbnQpIHtcclxuICBkb2NrLmFwcGVuZENoaWxkKHNoaXBFbGVtZW50KTtcclxufVxyXG5cclxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcclxuXHJcblB1YlN1Yi5vbihcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIsICgpID0+IHtcclxuICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuXHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCg0KSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgzKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgzKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgyKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgyKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgyKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgxKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgxKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgxKSk7XHJcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgxKSk7XHJcbn0pO1xyXG5cclxuUHViU3ViLm9uKFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiLCAoKSA9PiB7XHJcbiAgaWYgKGRvY2suY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xyXG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xyXG4gIH1cclxufSk7XHJcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBUaWxlVUkgfSBmcm9tIFwiLi90aWxlVUlcIjtcclxuaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxHcmlkV2l0aENlbGxzKGdyaWQpIHtcclxuICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1NJWkU7IHkrKykge1xyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9TSVpFOyB4KyspIHtcclxuICAgICAgY29uc3QgdGlsZSA9IG5ldyBUaWxlVUkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgeCArIDEsIHkgKyAxKTtcclxuICAgICAgZ3JpZC5hcHBlbmRDaGlsZCh0aWxlLnRpbGVFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRHcmlkVGlsZVNpemUoZ3JpZCkge1xyXG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtcclxuICAgIFRJTEVfU0laRV9QWCArIFwicHhcIlxyXG4gIH0pYDtcclxuICBncmlkLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7Qk9BUkRfU0laRX0sICR7VElMRV9TSVpFX1BYICsgXCJweFwifSlgO1xyXG59XHJcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcclxuY29uc3QgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgPSAtMTA7XHJcbmNvbnN0IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgPSAtMTA7XHJcbmV4cG9ydCBjbGFzcyBTaGlwVUkge1xyXG4gIHN0YXRpYyBtb3ZhYmxlU2hpcCA9IG51bGw7XHJcbiAgb2Zmc2V0WCA9IDA7XHJcbiAgb2Zmc2V0WSA9IDA7XHJcbiAgdGlsZXNQbGFjZWQgPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2hpcEVsZW1lbnQsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB0aGlzLnNoaXBFbGVtZW50ID0gc2hpcEVsZW1lbnQ7XHJcbiAgICB0aGlzLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkb2NrLXNoaXBcIik7XHJcbiAgICB0aGlzLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoYGxlbmd0aC0ke2xlbmd0aH1gKTtcclxuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUud2lkdGggPVxyXG4gICAgICBsZW5ndGggKiBUSUxFX1NJWkVfUFggKyBTSElQX1dJRFRIX0NPRUZGSUNJRU5UICsgXCJweFwiO1xyXG4gICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5oZWlnaHQgPVxyXG4gICAgICBUSUxFX1NJWkVfUFggKyBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCArIFwicHhcIjtcclxuXHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuc3RhcnRZID0gcmVjdC50b3A7XHJcbiAgICB0aGlzLnN0YXJ0WCA9IHJlY3QubGVmdDtcclxuXHJcbiAgICBzaGlwRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XHJcbiAgICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IHRoaXM7XHJcblxyXG4gICAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgdGhpcy5vZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgICAgIHRoaXMub2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgICAgY29uc29sZS5sb2coZS5jbGllbnRZLCByZWN0LnRvcCwgdGhpcy5vZmZzZXRZKTtcclxuICAgICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbW92ZShlLCBzaGlwKSB7XHJcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS50b3AgPSBlLnBhZ2VZIC0gc2hpcC5vZmZzZXRZICsgXCJweFwiO1xyXG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUubGVmdCA9IGUucGFnZVggLSBzaGlwLm9mZnNldFggKyBcInB4XCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0KHNoaXApIHtcclxuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IFNoaXBVSS5tb3ZhYmxlU2hpcC5zdGFydFkgKyBcInB4XCI7XHJcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gU2hpcFVJLm1vdmFibGVTaGlwLnN0YXJ0WCArIFwicHhcIjtcclxuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJzdGF0aWNcIjtcclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xyXG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcclxuICAgIG1vdmUoZSwgU2hpcFVJLm1vdmFibGVTaGlwKTtcclxuICAgIFB1YlN1Yi5lbWl0KFwic2hpcElzTW92aW5nXCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcclxuICBpZiAoU2hpcFVJLm1vdmFibGVTaGlwKSB7XHJcbiAgICBQdWJTdWIuZW1pdChcIm5vU2hpcE1vdmVtZW50XCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XHJcbiAgICByZXNldChTaGlwVUkubW92YWJsZVNoaXApO1xyXG4gICAgU2hpcFVJLm1vdmFibGVTaGlwID0gbnVsbDtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBUSUxFX1NJWkVfUFggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4vUHViU3ViXCI7XHJcblxyXG5mdW5jdGlvbiBlbGVtZW50SXNJbnNpZGUoaW5uZXIsIG91dGVyLCBsZW5ndGgsIGlzUm90YXRlZCwgYmFzZUxlbmd0aCkge1xyXG4gIGNvbnN0IGlubmVyUmVjdCA9IGlubmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIGNvbnN0IG91dGVyUmVjdCA9IG91dGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBkaWZmZXJlbmNlVG9wID0gTWF0aC5hYnMoaW5uZXJSZWN0LnRvcCAtIG91dGVyUmVjdC50b3ApO1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZUxlZnQgPSBNYXRoLmFicyhpbm5lclJlY3QubGVmdCAtIG91dGVyUmVjdC5sZWZ0KTtcclxuICAgIGNvbnN0IGRpZmZlcmVuY2VCb3R0b20gPSBpc1JvdGF0ZWRcclxuICAgICAgPyBNYXRoLmFicyhpbm5lclJlY3QuYm90dG9tIC0gKG91dGVyUmVjdC5ib3R0b20gLSBiYXNlTGVuZ3RoICogaSkpXHJcbiAgICAgIDogTWF0aC5hYnMoaW5uZXJSZWN0LmJvdHRvbSAtIG91dGVyUmVjdC5ib3R0b20pO1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZVJpZ2h0ID0gaXNSb3RhdGVkXHJcbiAgICAgID8gTWF0aC5hYnMoaW5uZXJSZWN0LnJpZ2h0IC0gb3V0ZXJSZWN0LnJpZ2h0KVxyXG4gICAgICA6IE1hdGguYWJzKGlubmVyUmVjdC5yaWdodCAtIChvdXRlclJlY3QucmlnaHQgLSBiYXNlTGVuZ3RoICogaSkpO1xyXG5cclxuICAgIGlmIChcclxuICAgICAgKGRpZmZlcmVuY2VUb3AgPD0gaW5uZXJSZWN0LmhlaWdodCAvIDIgfHxcclxuICAgICAgICBkaWZmZXJlbmNlTGVmdCA8PSBpbm5lclJlY3Qud2lkdGggLyAyKSAmJlxyXG4gICAgICBkaWZmZXJlbmNlQm90dG9tIDw9IGlubmVyUmVjdC5oZWlnaHQgLyAyICYmXHJcbiAgICAgIGRpZmZlcmVuY2VSaWdodCA8PSBpbm5lclJlY3Qud2lkdGggLyAyXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlVUkge1xyXG4gIGZpbGxlZCA9IGZhbHNlO1xyXG4gIGNvbnN0cnVjdG9yKHRpbGVFbGVtZW50LCB4LCB5KSB7XHJcbiAgICB0aGlzLnRpbGVFbGVtZW50ID0gdGlsZUVsZW1lbnQ7XHJcbiAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0aWxlXCIpO1xyXG4gICAgdGhpcy50aWxlRWxlbWVudC5kYXRhc2V0LnggPSB4O1xyXG4gICAgdGhpcy50aWxlRWxlbWVudC5kYXRhc2V0LnkgPSB5O1xyXG4gICAgdGhpcy50aWxlRWxlbWVudC53aWR0aCA9IFRJTEVfU0laRV9QWCArIFwicHhcIjtcclxuXHJcbiAgICBQdWJTdWIub24oXCJzaGlwSXNNb3ZpbmdcIiwgKHNoaXApID0+IHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGVsZW1lbnRJc0luc2lkZShcclxuICAgICAgICAgIHRoaXMudGlsZUVsZW1lbnQsXHJcbiAgICAgICAgICBzaGlwLnNoaXBFbGVtZW50LFxyXG4gICAgICAgICAgc2hpcC5sZW5ndGgsXHJcbiAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgIFRJTEVfU0laRV9QWFxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBQdWJTdWIub24oXCJub1NoaXBNb3ZlbWVudFwiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5pbXBvcnQgXCIuL3NoaXBVSVwiO1xyXG5pbXBvcnQgXCIuL3RpbGVVSVwiO1xyXG5pbXBvcnQgXCIuL2RvY2stbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBzZXRHcmlkVGlsZVNpemUsIGZpbGxHcmlkV2l0aENlbGxzIH0gZnJvbSBcIi4vZ3JpZC1zZXR1cFwiO1xyXG5cclxuY29uc3QgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUyA9IHtcclxuICBuZXh0UGxhY2VtZW50U3RhZ2U6IFwiU3RhcnQgcGxhY2luZyBzaGlwc1wiLFxyXG4gIG5leHRHYW1lU3RhZ2U6IFwiU3RhcnQgZ2FtZVwiLFxyXG59O1xyXG5jb25zdCBtYWluQWN0aW9uQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWFjdGlvbi1idXR0b25cIik7XHJcbm1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPVxyXG4gIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dFBsYWNlbWVudFN0YWdlO1xyXG5cclxuY29uc3QgW2dyaWRMZWZ0LCBncmlkUmlnaHRdID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyaWRcIik7XHJcbnNldEdyaWRUaWxlU2l6ZShncmlkTGVmdCk7XHJcbnNldEdyaWRUaWxlU2l6ZShncmlkUmlnaHQpO1xyXG5maWxsR3JpZFdpdGhDZWxscyhncmlkTGVmdCk7XHJcbmZpbGxHcmlkV2l0aENlbGxzKGdyaWRSaWdodCk7XHJcblxyXG5tYWluQWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgc3dpdGNoIChtYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50KSB7XHJcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dEdhbWVTdGFnZToge1xyXG4gICAgICBQdWJTdWIuZW1pdChcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY2FzZSBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRQbGFjZW1lbnRTdGFnZToge1xyXG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIpO1xyXG4gICAgICBtYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID1cclxuICAgICAgICBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRHYW1lU3RhZ2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5QdWJTdWIub24oXCJnYW1lU3RhcnRzXCIsICgpID0+IHtcclxuICBtYWluQWN0aW9uQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIk5vbmVcIjtcclxuICBncmlkTGVmdC5jaGlsZE5vZGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcImdyZXllZC1vdXRcIik7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=