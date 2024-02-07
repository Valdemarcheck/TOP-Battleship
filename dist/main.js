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
  return shipImg;
}

function pushShipImgToDock(shipImg) {
  dock.appendChild(shipImg);
}

const dock = document.querySelector(".dock");

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  for (let [length,amount] of Object.entries(LENGTHS_AND_COUNTS_OF_SHIPS)) {
    for (let i = 0; i < amount; i++) {
      createShipImg
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzFCaUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsT0FBTztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQ0FBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJLDJDQUFNO0FBQ1Y7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN4Q0Q7QUFDQTtBQUNlO0FBQ2Ysa0JBQWtCLGdCQUFnQjtBQUNsQyxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ1ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNWO0FBQ3FCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUFpQjtBQUNqQix1REFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQ0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvUHViU3ViLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2RvY2stbWFuYWdlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9ncmlkLXNldHVwLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFB1YlN1YiA9ICgoKSA9PiB7XHJcbiAgY29uc3QgRVZFTlRTID0ge307XHJcblxyXG4gIGZ1bmN0aW9uIG9uKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0gfHwgW107XHJcbiAgICBFVkVOVFNbZXZlbnROYW1lXS5wdXNoKGZuKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9mZihldmVudE5hbWUsIGZuKSB7XHJcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcclxuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXS5maWx0ZXIoXHJcbiAgICAgICAgKGN1cnJlbnRGbikgPT4gY3VycmVudEZuICE9IGZuXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbWl0KGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgY29uc29sZS5sb2coZXZlbnROYW1lICsgXCIgRVZFTlQgV0FTIENBTExFRFwiKTtcclxuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xyXG4gICAgICBFVkVOVFNbZXZlbnROYW1lXS5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgIGZuKGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IG9uLCBvZmYsIGVtaXQgfTtcclxufSkoKTtcclxuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4vUHViU3ViXCI7XHJcblxyXG5jb25zdCBMRU5HVEhTX0FORF9DT1VOVFNfT0ZfU0hJUFMgPSB7XHJcbiAgMTogNCxcclxuICAyOiAzLFxyXG4gIDM6IDIsXHJcbiAgNDogMSxcclxufTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNoaXBJbWcobGVuZ3RoKSB7XHJcbiAgY29uc3Qgc2hpcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgc2hpcEltZy5zcmMgPSBgLi9pbWFnZXMvJHtsZW5ndGh9c2hpcC5wbmdgO1xyXG4gIHNoaXBJbWcuY2xhc3NMaXN0LmFkZChcImRvY2stc2hpcFwiKTtcclxuICBzaGlwSW1nLmNsYXNzTGlzdC5hZGQoXCJsZW5ndGgtXCIgKyBsZW5ndGgpO1xyXG4gIHJldHVybiBzaGlwSW1nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwdXNoU2hpcEltZ1RvRG9jayhzaGlwSW1nKSB7XHJcbiAgZG9jay5hcHBlbmRDaGlsZChzaGlwSW1nKTtcclxufVxyXG5cclxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcclxuXHJcblB1YlN1Yi5vbihcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIsICgpID0+IHtcclxuICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuXHJcbiAgZm9yIChsZXQgW2xlbmd0aCxhbW91bnRdIG9mIE9iamVjdC5lbnRyaWVzKExFTkdUSFNfQU5EX0NPVU5UU19PRl9TSElQUykpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcclxuICAgICAgY3JlYXRlU2hpcEltZ1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5QdWJTdWIub24oXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIsICgpID0+IHtcclxuICBpZiAoZG9jay5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICBhbGVydChcIkRvY2sgaXMgbm90IGVtcHR5IVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XHJcbiAgICBQdWJTdWIuZW1pdChcImdhbWVTdGFydHNcIik7XHJcbiAgfVxyXG59KTtcclxuIiwiY29uc3QgQk9BUkRfU0laRSA9IDEwO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZCkge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgQk9BUkRfU0laRTsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IEJPQVJEX1NJWkU7IGorKykge1xyXG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICBncmlkLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xyXG5pbXBvcnQgXCIuL2RvY2stbWFuYWdlclwiO1xyXG5pbXBvcnQgZmlsbEdyaWRXaXRoQ2VsbHMgZnJvbSBcIi4vZ3JpZC1zZXR1cFwiO1xyXG5jb25zdCBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTID0ge1xyXG4gIG5leHRQbGFjZW1lbnRTdGFnZTogXCJTdGFydCBwbGFjaW5nIHNoaXBzXCIsXHJcbiAgbmV4dEdhbWVTdGFnZTogXCJTdGFydCBnYW1lXCIsXHJcbn07XHJcbmNvbnN0IG1haW5BY3Rpb25CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tYWN0aW9uLWJ1dHRvblwiKTtcclxubWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XHJcbiAgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0UGxhY2VtZW50U3RhZ2U7XHJcblxyXG5jb25zdCBbZ3JpZExlZnQsIGdyaWRSaWdodF0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ3JpZFwiKTtcclxuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZExlZnQpO1xyXG5maWxsR3JpZFdpdGhDZWxscyhncmlkUmlnaHQpO1xyXG5cclxubWFpbkFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIHN3aXRjaCAobWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCkge1xyXG4gICAgY2FzZSBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRHYW1lU3RhZ2U6IHtcclxuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0UGxhY2VtZW50U3RhZ2U6IHtcclxuICAgICAgUHViU3ViLmVtaXQoXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiKTtcclxuICAgICAgbWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0R2FtZVN0YWdlO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuUHViU3ViLm9uKFwiZ2FtZVN0YXJ0c1wiLCAoKSA9PiB7XHJcbiAgbWFpbkFjdGlvbkJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XHJcbiAgZ3JpZExlZnQuY2hpbGROb2Rlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XHJcbiAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJncmV5ZWQtb3V0XCIpO1xyXG4gIH0pO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9