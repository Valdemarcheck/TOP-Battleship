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

/***/ "./src/dock-manager.js":
/*!*****************************!*\
  !*** ./src/dock-manager.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");


function createShipImg(length) {
  const shipImg = document.createElement("img");
  shipImg.src = `./images/${length}ship.png`;
  shipImg.classList.add("dock-ship");
  shipImg.classList.add("length-" + length);

  return shipImg;
}

function pushShipImgToDock(shipImg) {
  dock.appendChild(shipImg);
}

const dock = document.querySelector(".dock");

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipImgToDock(createShipImg(4));
  pushShipImgToDock(createShipImg(3));
  pushShipImgToDock(createShipImg(3));
  pushShipImgToDock(createShipImg(2));
  pushShipImgToDock(createShipImg(2));
  pushShipImgToDock(createShipImg(2));
  pushShipImgToDock(createShipImg(1));
  pushShipImgToDock(createShipImg(1));
  pushShipImgToDock(createShipImg(1));
  pushShipImgToDock(createShipImg(1));
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
/* harmony export */   "default": () => (/* binding */ fillGridWithCells)
/* harmony export */ });
/* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");

const BOARD_SIZE = 10;

function fillGridWithCells(grid) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const tile = new _tileUI__WEBPACK_IMPORTED_MODULE_0__.TileUI(document.createElement("div"));
      grid.appendChild(tile.tileElement);
    }
  }
}


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
class TileUI {
  filled = false;
  constructor(tileElement, x, y) {
    this.tileElement = tileElement;
    this.tileElement.classList.add("tile");
    this.tileElement.dataset.x = x;
    this.tileElement.dataset.y = y;
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
/* harmony import */ var _dock_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dock-manager */ "./src/dock-manager.js");
/* harmony import */ var _grid_setup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./grid-setup */ "./src/grid-setup.js");




const MAIN_ACTION_BUTTON_PRESET_NAMES = {
  nextPlacementStage: "Start placing ships",
  nextGameStage: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent =
  MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage;

const [gridLeft, gridRight] = document.getElementsByClassName("grid");
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_2__["default"])(gridLeft);
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_2__["default"])(gridRight);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzFCaUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLE9BQU87QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQ0FBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJLDJDQUFNO0FBQ1Y7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkNpQztBQUNsQztBQUNBO0FBQ2U7QUFDZixrQkFBa0IsZ0JBQWdCO0FBQ2xDLG9CQUFvQixnQkFBZ0I7QUFDcEMsdUJBQXVCLDJDQUFNO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNWTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNSQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOa0M7QUFDVjtBQUNxQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUFpQjtBQUNqQix1REFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQ0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvUHViU3ViLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2RvY2stbWFuYWdlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9ncmlkLXNldHVwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3RpbGVVSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBQdWJTdWIgPSAoKCkgPT4ge1xyXG4gIGNvbnN0IEVWRU5UUyA9IHt9O1xyXG5cclxuICBmdW5jdGlvbiBvbihldmVudE5hbWUsIGZuKSB7XHJcbiAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdIHx8IFtdO1xyXG4gICAgRVZFTlRTW2V2ZW50TmFtZV0ucHVzaChmbik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvZmYoZXZlbnROYW1lLCBmbikge1xyXG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XHJcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0uZmlsdGVyKFxyXG4gICAgICAgIChjdXJyZW50Rm4pID0+IGN1cnJlbnRGbiAhPSBmblxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKGV2ZW50TmFtZSArIFwiIEVWRU5UIFdBUyBDQUxMRURcIik7XHJcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcclxuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0uZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICBmbihkYXRhKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBvbiwgb2ZmLCBlbWl0IH07XHJcbn0pKCk7XHJcbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlU2hpcEltZyhsZW5ndGgpIHtcclxuICBjb25zdCBzaGlwSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICBzaGlwSW1nLnNyYyA9IGAuL2ltYWdlcy8ke2xlbmd0aH1zaGlwLnBuZ2A7XHJcbiAgc2hpcEltZy5jbGFzc0xpc3QuYWRkKFwiZG9jay1zaGlwXCIpO1xyXG4gIHNoaXBJbWcuY2xhc3NMaXN0LmFkZChcImxlbmd0aC1cIiArIGxlbmd0aCk7XHJcblxyXG4gIHJldHVybiBzaGlwSW1nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwdXNoU2hpcEltZ1RvRG9jayhzaGlwSW1nKSB7XHJcbiAgZG9jay5hcHBlbmRDaGlsZChzaGlwSW1nKTtcclxufVxyXG5cclxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcclxuXHJcblB1YlN1Yi5vbihcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIsICgpID0+IHtcclxuICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuXHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZyg0KSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygzKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygzKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygyKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygyKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygyKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygxKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygxKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygxKSk7XHJcbiAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZygxKSk7XHJcbn0pO1xyXG5cclxuUHViU3ViLm9uKFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiLCAoKSA9PiB7XHJcbiAgaWYgKGRvY2suY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xyXG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xyXG4gIH1cclxufSk7XHJcbiIsImltcG9ydCB7IFRpbGVVSSB9IGZyb20gXCIuL3RpbGVVSVwiO1xyXG5jb25zdCBCT0FSRF9TSVpFID0gMTA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaWxsR3JpZFdpdGhDZWxscyhncmlkKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBCT0FSRF9TSVpFOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgQk9BUkRfU0laRTsgaisrKSB7XHJcbiAgICAgIGNvbnN0IHRpbGUgPSBuZXcgVGlsZVVJKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xyXG4gICAgICBncmlkLmFwcGVuZENoaWxkKHRpbGUudGlsZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgVGlsZVVJIHtcclxuICBmaWxsZWQgPSBmYWxzZTtcclxuICBjb25zdHJ1Y3Rvcih0aWxlRWxlbWVudCwgeCwgeSkge1xyXG4gICAgdGhpcy50aWxlRWxlbWVudCA9IHRpbGVFbGVtZW50O1xyXG4gICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGlsZVwiKTtcclxuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC54ID0geDtcclxuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC55ID0geTtcclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcclxuaW1wb3J0IFwiLi9kb2NrLW1hbmFnZXJcIjtcclxuaW1wb3J0IGZpbGxHcmlkV2l0aENlbGxzIGZyb20gXCIuL2dyaWQtc2V0dXBcIjtcclxuXHJcbmNvbnN0IE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMgPSB7XHJcbiAgbmV4dFBsYWNlbWVudFN0YWdlOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcclxuICBuZXh0R2FtZVN0YWdlOiBcIlN0YXJ0IGdhbWVcIixcclxufTtcclxuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xyXG5tYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID1cclxuICBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRQbGFjZW1lbnRTdGFnZTtcclxuXHJcbmNvbnN0IFtncmlkTGVmdCwgZ3JpZFJpZ2h0XSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmlkXCIpO1xyXG5maWxsR3JpZFdpdGhDZWxscyhncmlkTGVmdCk7XHJcbmZpbGxHcmlkV2l0aENlbGxzKGdyaWRSaWdodCk7XHJcblxyXG5tYWluQWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgc3dpdGNoIChtYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50KSB7XHJcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dEdhbWVTdGFnZToge1xyXG4gICAgICBQdWJTdWIuZW1pdChcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY2FzZSBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRQbGFjZW1lbnRTdGFnZToge1xyXG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIpO1xyXG4gICAgICBtYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID1cclxuICAgICAgICBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRHYW1lU3RhZ2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5QdWJTdWIub24oXCJnYW1lU3RhcnRzXCIsICgpID0+IHtcclxuICBtYWluQWN0aW9uQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIk5vbmVcIjtcclxuICBncmlkTGVmdC5jaGlsZE5vZGVzLmZvckVhY2goKHRpbGUpID0+IHtcclxuICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcImdyZXllZC1vdXRcIik7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=