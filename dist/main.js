/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./src/PubSub.js":
      /*!***********************!*\
  !*** ./src/PubSub.js ***!
  \***********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ PubSub: () => /* binding */ PubSub,
          /* harmony export */
        });
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

        /***/
      },

    /***/ "./src/constants.js":
      /*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ BOARD_SIZE: () => /* binding */ BOARD_SIZE,
          /* harmony export */ SHIP_HEIGHT_COEFFICIENT: () =>
            /* binding */ SHIP_HEIGHT_COEFFICIENT,
          /* harmony export */ SHIP_WIDTH_COEFFICIENT: () =>
            /* binding */ SHIP_WIDTH_COEFFICIENT,
          /* harmony export */ TILE_SIZE_PX: () => /* binding */ TILE_SIZE_PX,
          /* harmony export */
        });
        const TILE_SIZE_PX = 50;
        const BOARD_SIZE = 10;

        // ship settings
        const SHIP_HEIGHT_COEFFICIENT = -10;
        const SHIP_WIDTH_COEFFICIENT = -10;

        /***/
      },

    /***/ "./src/dock.js":
      /*!*********************!*\
  !*** ./src/dock.js ***!
  \*********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
        /* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./shipUI */ "./src/shipUI.js");

        const SHIPS = [];

        function createShipUI(length) {
          const ship = new _shipUI__WEBPACK_IMPORTED_MODULE_1__.ShipUI(
            document.createElement("div"),
            length
          );
          SHIPS.push(ship);
          return ship.shipElement;
        }

        function pushShipToDock(shipElement) {
          dock.appendChild(shipElement);
        }

        const dock = document.querySelector(".dock");

        _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on(
          "placementOfShipsHasStarted",
          () => {
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
          }
        );

        _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.on(
          "checkIfAllShipsWerePlaced",
          () => {
            if (dock.children.length > 0) {
              alert("Dock is not empty!");
            } else {
              dock.style.display = "None";
              _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit("gameStarts");
            }
          }
        );

        /***/
      },

    /***/ "./src/grid-setup.js":
      /*!***************************!*\
  !*** ./src/grid-setup.js ***!
  \***************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./constants */ "./src/constants.js");
        /* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");

        function fillGridWithCells(grid) {
          for (
            let y = 0;
            y < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE;
            y++
          ) {
            for (
              let x = 0;
              x < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE;
              x++
            ) {
              const tile = new _tileUI__WEBPACK_IMPORTED_MODULE_1__.TileUI(
                document.createElement("div"),
                x + 1,
                y + 1
              );
              grid.appendChild(tile.tileElement);
            }
          }
        }

        function setGridTileSize(grid) {
          grid.style.gridTemplateColumns = `repeat(${
            _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE
          }, ${_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px"})`;
          grid.style.gridTemplateRows = `repeat(${
            _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE
          }, ${_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px"})`;
        }

        _PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on(
          "fillGrid",
          fillGridWithCells
        );
        _PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on(
          "setGridTileSize",
          setGridTileSize
        );

        /***/
      },

    /***/ "./src/shipUI.js":
      /*!***********************!*\
  !*** ./src/shipUI.js ***!
  \***********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ShipUI: () => /* binding */ ShipUI,
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./constants */ "./src/constants.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");

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
              length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX +
              _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_WIDTH_COEFFICIENT +
              "px";
            this.shipElement.style.height =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX +
              _constants__WEBPACK_IMPORTED_MODULE_0__.SHIP_HEIGHT_COEFFICIENT +
              "px";

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
            _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit(
              "shipIsMoving",
              ShipUI.movableShip
            );
          }
        });

        document.addEventListener("mouseup", () => {
          if (ShipUI.movableShip) {
            _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit(
              "noShipMovement",
              ShipUI.movableShip
            );
            reset(ShipUI.movableShip);
            ShipUI.movableShip = null;
          }
        });

        /***/
      },

    /***/ "./src/tileUI.js":
      /*!***********************!*\
  !*** ./src/tileUI.js ***!
  \***********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ TileUI: () => /* binding */ TileUI,
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./constants */ "./src/constants.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");

        function shipIsOverTile(inner, outer, length, isRotated, baseLength) {
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
            this.tileElement.width =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";

            _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on(
              "shipIsMoving",
              (ship) => {
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
              }
            );
            _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on(
              "noShipMovement",
              () => {
                this.tileElement.classList.remove("hoveredWithShip");
              }
            );
          }
        }

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
    /* harmony import */ var _grid_setup__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(/*! ./grid-setup */ "./src/grid-setup.js");
    /* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_2__ =
      __webpack_require__(/*! ./shipUI */ "./src/shipUI.js");
    /* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_3__ =
      __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
    /* harmony import */ var _dock__WEBPACK_IMPORTED_MODULE_4__ =
      __webpack_require__(/*! ./dock */ "./src/dock.js");

    const MAIN_ACTION_BUTTON_PRESET_NAMES = {
      nextPlacementStage: "Start placing ships",
      nextGameStage: "Start game",
    };
    const mainActionButton = document.querySelector(".main-action-button");
    mainActionButton.textContent =
      MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage;

    const [gridLeft, gridRight] = document.getElementsByClassName("grid");
    _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
      "setGridTileSize",
      gridLeft
    );
    _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
      "setGridTileSize",
      gridRight
    );
    _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
      "fillGridWithCells",
      gridLeft
    );
    _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
      "fillGridWithCells",
      gridRight
    );

    mainActionButton.addEventListener("click", () => {
      switch (mainActionButton.textContent) {
        case MAIN_ACTION_BUTTON_PRESET_NAMES.nextGameStage: {
          _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
            "checkIfAllShipsWerePlaced"
          );
          break;
        }
        case MAIN_ACTION_BUTTON_PRESET_NAMES.nextPlacementStage: {
          _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
            "placementOfShipsHasStarted"
          );
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

  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBTTtBQUNOLDJDQUFNO0FBQ04sMkNBQU07QUFDTiwyQ0FBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQSxNQUFNLDJDQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsTUFBTSwyQ0FBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELDJDQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2RvY2suanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ3JpZC1zZXR1cC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9zaGlwVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdGlsZVVJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFB1YlN1YiA9ICgoKSA9PiB7XG4gIGNvbnN0IEVWRU5UUyA9IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdIHx8IFtdO1xuICAgIEVWRU5UU1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9XG5cbiAgZnVuY3Rpb24gb2ZmKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0uZmlsdGVyKFxuICAgICAgICAoY3VycmVudEZuKSA9PiBjdXJyZW50Rm4gIT0gZm5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUgKyBcIiBFVkVOVCBXQVMgQ0FMTEVEXCIpO1xuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0uZm9yRWFjaCgoZm4pID0+IHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBvbiwgb2ZmLCBlbWl0IH07XG59KSgpO1xuIiwiZXhwb3J0IGNvbnN0IFRJTEVfU0laRV9QWCA9IDUwO1xuZXhwb3J0IGNvbnN0IEJPQVJEX1NJWkUgPSAxMDtcblxuLy8gc2hpcCBzZXR0aW5nc1xuZXhwb3J0IGNvbnN0IFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UID0gLTEwO1xuZXhwb3J0IGNvbnN0IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgPSAtMTA7XG4iLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7IFNoaXBVSSB9IGZyb20gXCIuL3NoaXBVSVwiO1xuY29uc3QgU0hJUFMgPSBbXTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcChsZW5ndGgpIHtcbiAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwVUkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSwgbGVuZ3RoKTtcbiAgU0hJUFMucHVzaChzaGlwKTtcbiAgcmV0dXJuIHNoaXAuc2hpcEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHB1c2hTaGlwVG9Eb2NrKHNoaXBFbGVtZW50KSB7XG4gIGRvY2suYXBwZW5kQ2hpbGQoc2hpcEVsZW1lbnQpO1xufVxuXG5jb25zdCBkb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb2NrXCIpO1xuXG5QdWJTdWIub24oXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiLCAoKSA9PiB7XG4gIGRvY2suc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuXG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXAoNCkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDMpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgzKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXAoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDIpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgyKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXAoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwKDEpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcCgxKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXAoMSkpO1xufSk7XG5cblB1YlN1Yi5vbihcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIiwgKCkgPT4ge1xuICBpZiAoZG9jay5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XG4gIH0gZWxzZSB7XG4gICAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xuICB9XG59KTtcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGlsZVVJIH0gZnJvbSBcIi4vdGlsZVVJXCI7XG5pbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcblxuZnVuY3Rpb24gZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZCkge1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1NJWkU7IHkrKykge1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQk9BUkRfU0laRTsgeCsrKSB7XG4gICAgICBjb25zdCB0aWxlID0gbmV3IFRpbGVVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCB4ICsgMSwgeSArIDEpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZCh0aWxlLnRpbGVFbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0R3JpZFRpbGVTaXplKGdyaWQpIHtcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1xuICAgIFRJTEVfU0laRV9QWCArIFwicHhcIlxuICB9KWA7XG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtUSUxFX1NJWkVfUFggKyBcInB4XCJ9KWA7XG59XG5cblB1YlN1Yi5vbihcImZpbGxHcmlkXCIsIGZpbGxHcmlkV2l0aENlbGxzKTtcblB1YlN1Yi5vbihcInNldEdyaWRUaWxlU2l6ZVwiLCBzZXRHcmlkVGlsZVNpemUpO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQsIFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5leHBvcnQgY2xhc3MgU2hpcFVJIHtcbiAgc3RhdGljIG1vdmFibGVTaGlwID0gbnVsbDtcbiAgb2Zmc2V0WCA9IDA7XG4gIG9mZnNldFkgPSAwO1xuICB0aWxlc1BsYWNlZCA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNoaXBFbGVtZW50LCBsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLnNoaXBFbGVtZW50ID0gc2hpcEVsZW1lbnQ7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZG9jay1zaGlwXCIpO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbGVuZ3RoLSR7bGVuZ3RofWApO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUud2lkdGggPVxuICAgICAgbGVuZ3RoICogVElMRV9TSVpFX1BYICsgU0hJUF9XSURUSF9DT0VGRklDSUVOVCArIFwicHhcIjtcbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLmhlaWdodCA9XG4gICAgICBUSUxFX1NJWkVfUFggKyBTSElQX0hFSUdIVF9DT0VGRklDSUVOVCArIFwicHhcIjtcblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNoaXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMuc3RhcnRZID0gcmVjdC50b3A7XG4gICAgdGhpcy5zdGFydFggPSByZWN0LmxlZnQ7XG5cbiAgICBzaGlwRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICBTaGlwVUkubW92YWJsZVNoaXAgPSB0aGlzO1xuXG4gICAgICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMub2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgdGhpcy5vZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgY29uc29sZS5sb2coZS5jbGllbnRZLCByZWN0LnRvcCwgdGhpcy5vZmZzZXRZKTtcbiAgICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW92ZShlLCBzaGlwKSB7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUudG9wID0gZS5wYWdlWSAtIHNoaXAub2Zmc2V0WSArIFwicHhcIjtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gZS5wYWdlWCAtIHNoaXAub2Zmc2V0WCArIFwicHhcIjtcbn1cblxuZnVuY3Rpb24gcmVzZXQoc2hpcCkge1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnRvcCA9IFNoaXBVSS5tb3ZhYmxlU2hpcC5zdGFydFkgKyBcInB4XCI7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUubGVmdCA9IFNoaXBVSS5tb3ZhYmxlU2hpcC5zdGFydFggKyBcInB4XCI7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcInN0YXRpY1wiO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PiB7XG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcbiAgICBtb3ZlKGUsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgUHViU3ViLmVtaXQoXCJzaGlwSXNNb3ZpbmdcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgaWYgKFNoaXBVSS5tb3ZhYmxlU2hpcCkge1xuICAgIFB1YlN1Yi5lbWl0KFwibm9TaGlwTW92ZW1lbnRcIiwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgICByZXNldChTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IG51bGw7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcblxuZnVuY3Rpb24gZWxlbWVudElzSW5zaWRlKGlubmVyLCBvdXRlciwgbGVuZ3RoLCBpc1JvdGF0ZWQsIGJhc2VMZW5ndGgpIHtcbiAgY29uc3QgaW5uZXJSZWN0ID0gaW5uZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IG91dGVyUmVjdCA9IG91dGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkaWZmZXJlbmNlVG9wID0gTWF0aC5hYnMoaW5uZXJSZWN0LnRvcCAtIG91dGVyUmVjdC50b3ApO1xuICAgIGNvbnN0IGRpZmZlcmVuY2VMZWZ0ID0gTWF0aC5hYnMoaW5uZXJSZWN0LmxlZnQgLSBvdXRlclJlY3QubGVmdCk7XG4gICAgY29uc3QgZGlmZmVyZW5jZUJvdHRvbSA9IGlzUm90YXRlZFxuICAgICAgPyBNYXRoLmFicyhpbm5lclJlY3QuYm90dG9tIC0gKG91dGVyUmVjdC5ib3R0b20gLSBiYXNlTGVuZ3RoICogaSkpXG4gICAgICA6IE1hdGguYWJzKGlubmVyUmVjdC5ib3R0b20gLSBvdXRlclJlY3QuYm90dG9tKTtcbiAgICBjb25zdCBkaWZmZXJlbmNlUmlnaHQgPSBpc1JvdGF0ZWRcbiAgICAgID8gTWF0aC5hYnMoaW5uZXJSZWN0LnJpZ2h0IC0gb3V0ZXJSZWN0LnJpZ2h0KVxuICAgICAgOiBNYXRoLmFicyhpbm5lclJlY3QucmlnaHQgLSAob3V0ZXJSZWN0LnJpZ2h0IC0gYmFzZUxlbmd0aCAqIGkpKTtcblxuICAgIGlmIChcbiAgICAgIChkaWZmZXJlbmNlVG9wIDwgaW5uZXJSZWN0LmhlaWdodCAvIDIgfHxcbiAgICAgICAgZGlmZmVyZW5jZUxlZnQgPCBpbm5lclJlY3Qud2lkdGggLyAyKSAmJlxuICAgICAgZGlmZmVyZW5jZUJvdHRvbSA8IGlubmVyUmVjdC5oZWlnaHQgLyAyICYmXG4gICAgICBkaWZmZXJlbmNlUmlnaHQgPCBpbm5lclJlY3Qud2lkdGggLyAyICYmXG4gICAgICBkaWZmZXJlbmNlVG9wIDwgaW5uZXJSZWN0LmhlaWdodCAvIDJcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNsYXNzIFRpbGVVSSB7XG4gIGZpbGxlZCA9IGZhbHNlO1xuICBjb25zdHJ1Y3Rvcih0aWxlRWxlbWVudCwgeCwgeSkge1xuICAgIHRoaXMudGlsZUVsZW1lbnQgPSB0aWxlRWxlbWVudDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0aWxlXCIpO1xuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC54ID0geDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueSA9IHk7XG4gICAgdGhpcy50aWxlRWxlbWVudC53aWR0aCA9IFRJTEVfU0laRV9QWCArIFwicHhcIjtcblxuICAgIFB1YlN1Yi5vbihcInNoaXBJc01vdmluZ1wiLCAoc2hpcCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBlbGVtZW50SXNJbnNpZGUoXG4gICAgICAgICAgdGhpcy50aWxlRWxlbWVudCxcbiAgICAgICAgICBzaGlwLnNoaXBFbGVtZW50LFxuICAgICAgICAgIHNoaXAubGVuZ3RoLFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIFRJTEVfU0laRV9QWFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFB1YlN1Yi5vbihcIm5vU2hpcE1vdmVtZW50XCIsICgpID0+IHtcbiAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCBcIi4vZ3JpZC1zZXR1cFwiO1xuaW1wb3J0IFwiLi9zaGlwVUlcIjtcbmltcG9ydCBcIi4vdGlsZVVJXCI7XG5pbXBvcnQgXCIuL2RvY2tcIjtcblxuY29uc3QgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUyA9IHtcbiAgbmV4dFBsYWNlbWVudFN0YWdlOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcbiAgbmV4dEdhbWVTdGFnZTogXCJTdGFydCBnYW1lXCIsXG59O1xuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xubWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XG4gIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dFBsYWNlbWVudFN0YWdlO1xuXG5jb25zdCBbZ3JpZExlZnQsIGdyaWRSaWdodF0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ3JpZFwiKTtcblB1YlN1Yi5lbWl0KFwic2V0R3JpZFRpbGVTaXplXCIsIGdyaWRMZWZ0KTtcblB1YlN1Yi5lbWl0KFwic2V0R3JpZFRpbGVTaXplXCIsIGdyaWRSaWdodCk7XG5QdWJTdWIuZW1pdChcImZpbGxHcmlkV2l0aENlbGxzXCIsIGdyaWRMZWZ0KTtcblB1YlN1Yi5lbWl0KFwiZmlsbEdyaWRXaXRoQ2VsbHNcIiwgZ3JpZFJpZ2h0KTtcblxubWFpbkFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBzd2l0Y2ggKG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQpIHtcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9QUkVTRVRfTkFNRVMubmV4dEdhbWVTdGFnZToge1xuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0UGxhY2VtZW50U3RhZ2U6IHtcbiAgICAgIFB1YlN1Yi5lbWl0KFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIik7XG4gICAgICBtYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID1cbiAgICAgICAgTUFJTl9BQ1RJT05fQlVUVE9OX1BSRVNFVF9OQU1FUy5uZXh0R2FtZVN0YWdlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59KTtcblxuUHViU3ViLm9uKFwiZ2FtZVN0YXJ0c1wiLCAoKSA9PiB7XG4gIG1haW5BY3Rpb25CdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xuICBncmlkTGVmdC5jaGlsZE5vZGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJncmV5ZWQtb3V0XCIpO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
