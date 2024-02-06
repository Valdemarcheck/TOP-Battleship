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
/* harmony export */   BOARD_SIZE: () => (/* binding */ BOARD_SIZE)
/* harmony export */ });
const BOARD_SIZE = 10;


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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");


function fillGridWithCells(grid) {
  for (let i = 0; i < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE; i++) {
    for (let j = 0; j < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE; j++) {
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
/* harmony import */ var _grid_setup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid-setup */ "./src/grid-setup.js");


const MAIN_ACTION_BUTTON_PRESET_NAMES = {
  nextPlacementStage: "Start placing ships",
  nextGameStage: "Start game",
};
const mainActionButton = document.querySelector(".main-action-button");
mainActionButton.textContent =
  MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage;
const dock = document.querySelector(".dock");

const [gridLeft, gridRight] = document.getElementsByClassName("grid");
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_1__["default"])(gridLeft);
(0,_grid_setup__WEBPACK_IMPORTED_MODULE_1__["default"])(gridRight);

mainActionButton.addEventListener("click", () => {
  switch (mainActionButton.textContent) {
    case MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage: {
      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("checkIfAllShipsWerePlaced");
      break;
    }
    case MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage: {
      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("placementOfShipsHasStarted");
      break;
    }
  }
});

_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on("placementOfShipsHasStarted", () => {
  mainActionButton.textContent = MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage;
  dock.style.display = "flex";
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDMUJNOzs7Ozs7Ozs7Ozs7Ozs7O0FDQWtDO0FBQ3pDO0FBQ2U7QUFDZixrQkFBa0IsSUFBSSxrREFBVSxFQUFFO0FBQ2xDLG9CQUFvQixJQUFJLGtEQUFVLEVBQUU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDVkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOa0M7QUFDVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUFpQjtBQUNqQix1REFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDJDQUFNO0FBQ047QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dyaWQtc2V0dXAuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgUHViU3ViID0gKCgpID0+IHtcclxuICBjb25zdCBFVkVOVFMgPSB7fTtcclxuXHJcbiAgZnVuY3Rpb24gb24oZXZlbnROYW1lLCBmbikge1xyXG4gICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXSB8fCBbXTtcclxuICAgIEVWRU5UU1tldmVudE5hbWVdLnB1c2goZm4pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb2ZmKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xyXG4gICAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdLmZpbHRlcihcclxuICAgICAgICAoY3VycmVudEZuKSA9PiBjdXJyZW50Rm4gIT0gZm5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUgKyBcIiBFVkVOVCBXQVMgQ0FMTEVEXCIpO1xyXG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XHJcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgZm4oZGF0YSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgb24sIG9mZiwgZW1pdCB9O1xyXG59KSgpO1xyXG4iLCJleHBvcnQgY29uc3QgQk9BUkRfU0laRSA9IDEwO1xyXG4iLCJpbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaWxsR3JpZFdpdGhDZWxscyhncmlkKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBCT0FSRF9TSVpFOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgQk9BUkRfU0laRTsgaisrKSB7XHJcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJncmlkLWNlbGxcIik7XHJcbiAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4vUHViU3ViXCI7XHJcbmltcG9ydCBmaWxsR3JpZFdpdGhDZWxscyBmcm9tIFwiLi9ncmlkLXNldHVwXCI7XHJcbmNvbnN0IE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMgPSB7XHJcbiAgbmV4dFBsYWNlbWVudFN0YWdlOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcclxuICBuZXh0R2FtZVN0YWdlOiBcIlN0YXJ0IGdhbWVcIixcclxufTtcclxuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xyXG5tYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID1cclxuICBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRQbGFjZW1lbnRTdGFnZTtcclxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcclxuXHJcbmNvbnN0IFtncmlkTGVmdCwgZ3JpZFJpZ2h0XSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmlkXCIpO1xyXG5maWxsR3JpZFdpdGhDZWxscyhncmlkTGVmdCk7XHJcbmZpbGxHcmlkV2l0aENlbGxzKGdyaWRSaWdodCk7XHJcblxyXG5tYWluQWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgc3dpdGNoIChtYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50KSB7XHJcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dEdhbWVTdGFnZToge1xyXG4gICAgICBQdWJTdWIuZW1pdChcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY2FzZSBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRQbGFjZW1lbnRTdGFnZToge1xyXG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgKCkgPT4ge1xyXG4gIG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPSBNQUlOX0FDVElPTl9CVVRUT05fUFJFU0VUX05BTUVTLm5leHRHYW1lU3RhZ2U7XHJcbiAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=