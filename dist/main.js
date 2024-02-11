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


const LENGTHS_AND_COUNTS_OF_SHIPS = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
};

function createShipImg(length) {
  const shipImg = document.createElement("img");
  shipImg.src = `./images/${length}ship.png`;
  shipImg.classList.add("dock-ship");
  shipImg.classList.add("length-" + length);

  shipImg.addEventListener("click", (e) => {
    shipImg.style.position = "absolute";
    shipImg.style.left = e.clientX;
    shipImg.style.top = e.clientY;
  });

  return shipImg;
}

function pushShipImgToDock(shipImg) {
  dock.appendChild(shipImg);
}

const dock = document.querySelector(".dock");

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  for (let [length, amount] of Object.entries(LENGTHS_AND_COUNTS_OF_SHIPS)) {
    for (let i = 0; i < amount; i++) {
      pushShipImgToDock(createShipImg(length));
    }
  }
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
const BOARD_SIZE = 10;

function fillGridWithCells(grid) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      grid.appendChild(cell);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzFCaUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsT0FBTztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsMkNBQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSSwyQ0FBTTtBQUNWO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDL0NEO0FBQ0E7QUFDZTtBQUNmLGtCQUFrQixnQkFBZ0I7QUFDbEMsb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNWQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOa0M7QUFDVjtBQUNxQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBaUI7QUFDakIsdURBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBLE1BQU0sMkNBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsMkNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9kb2NrLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ3JpZC1zZXR1cC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBQdWJTdWIgPSAoKCkgPT4ge1xyXG4gIGNvbnN0IEVWRU5UUyA9IHt9O1xyXG5cclxuICBmdW5jdGlvbiBvbihldmVudE5hbWUsIGZuKSB7XHJcbiAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdIHx8IFtdO1xyXG4gICAgRVZFTlRTW2V2ZW50TmFtZV0ucHVzaChmbik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvZmYoZXZlbnROYW1lLCBmbikge1xyXG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XHJcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0uZmlsdGVyKFxyXG4gICAgICAgIChjdXJyZW50Rm4pID0+IGN1cnJlbnRGbiAhPSBmblxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKGV2ZW50TmFtZSArIFwiIEVWRU5UIFdBUyBDQUxMRURcIik7XHJcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcclxuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0uZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICBmbihkYXRhKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBvbiwgb2ZmLCBlbWl0IH07XHJcbn0pKCk7XHJcbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5cclxuY29uc3QgTEVOR1RIU19BTkRfQ09VTlRTX09GX1NISVBTID0ge1xyXG4gIDE6IDQsXHJcbiAgMjogMyxcclxuICAzOiAyLFxyXG4gIDQ6IDEsXHJcbn07XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTaGlwSW1nKGxlbmd0aCkge1xyXG4gIGNvbnN0IHNoaXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gIHNoaXBJbWcuc3JjID0gYC4vaW1hZ2VzLyR7bGVuZ3RofXNoaXAucG5nYDtcclxuICBzaGlwSW1nLmNsYXNzTGlzdC5hZGQoXCJkb2NrLXNoaXBcIik7XHJcbiAgc2hpcEltZy5jbGFzc0xpc3QuYWRkKFwibGVuZ3RoLVwiICsgbGVuZ3RoKTtcclxuXHJcbiAgc2hpcEltZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgIHNoaXBJbWcuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICBzaGlwSW1nLnN0eWxlLmxlZnQgPSBlLmNsaWVudFg7XHJcbiAgICBzaGlwSW1nLnN0eWxlLnRvcCA9IGUuY2xpZW50WTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHNoaXBJbWc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHB1c2hTaGlwSW1nVG9Eb2NrKHNoaXBJbWcpIHtcclxuICBkb2NrLmFwcGVuZENoaWxkKHNoaXBJbWcpO1xyXG59XHJcblxyXG5jb25zdCBkb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NrXCIpO1xyXG5cclxuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgKCkgPT4ge1xyXG4gIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG5cclxuICBmb3IgKGxldCBbbGVuZ3RoLCBhbW91bnRdIG9mIE9iamVjdC5lbnRyaWVzKExFTkdUSFNfQU5EX0NPVU5UU19PRl9TSElQUykpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcclxuICAgICAgcHVzaFNoaXBJbWdUb0RvY2soY3JlYXRlU2hpcEltZyhsZW5ndGgpKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuUHViU3ViLm9uKFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiLCAoKSA9PiB7XHJcbiAgaWYgKGRvY2suY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xyXG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xyXG4gIH1cclxufSk7XHJcbiIsImNvbnN0IEJPQVJEX1NJWkUgPSAxMDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbGxHcmlkV2l0aENlbGxzKGdyaWQpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IEJPQVJEX1NJWkU7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBCT0FSRF9TSVpFOyBqKyspIHtcclxuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcclxuICAgICAgZ3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcclxuaW1wb3J0IFwiLi9kb2NrLW1hbmFnZXJcIjtcclxuaW1wb3J0IGZpbGxHcmlkV2l0aENlbGxzIGZyb20gXCIuL2dyaWQtc2V0dXBcIjtcclxuY29uc3QgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUyA9IHtcclxuICBuZXh0UGxhY2VtZW50U3RhZ2U6IFwiU3RhcnQgcGxhY2luZyBzaGlwc1wiLFxyXG4gIG5leHRHYW1lU3RhZ2U6IFwiU3RhcnQgZ2FtZVwiLFxyXG59O1xyXG5jb25zdCBtYWluQWN0aW9uQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWFjdGlvbi1idXR0b25cIik7XHJcbm1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPVxyXG4gIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dFBsYWNlbWVudFN0YWdlO1xyXG5cclxuY29uc3QgW2dyaWRMZWZ0LCBncmlkUmlnaHRdID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyaWRcIik7XHJcbmZpbGxHcmlkV2l0aENlbGxzKGdyaWRMZWZ0KTtcclxuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZFJpZ2h0KTtcclxuXHJcbm1haW5BY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBzd2l0Y2ggKG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQpIHtcclxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0R2FtZVN0YWdlOiB7XHJcbiAgICAgIFB1YlN1Yi5lbWl0KFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dFBsYWNlbWVudFN0YWdlOiB7XHJcbiAgICAgIFB1YlN1Yi5lbWl0KFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIik7XHJcbiAgICAgIG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPVxyXG4gICAgICAgIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dEdhbWVTdGFnZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcblB1YlN1Yi5vbihcImdhbWVTdGFydHNcIiwgKCkgPT4ge1xyXG4gIG1haW5BY3Rpb25CdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xyXG4gIGdyaWRMZWZ0LmNoaWxkTm9kZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xyXG4gICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ3JleWVkLW91dFwiKTtcclxuICB9KTtcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==