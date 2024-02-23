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
          /* harmony export */ SHIP_UI_ELEMENTS: () =>
            /* binding */ SHIP_UI_ELEMENTS,
          /* harmony export */ SHIP_WIDTH_COEFFICIENT: () =>
            /* binding */ SHIP_WIDTH_COEFFICIENT,
          /* harmony export */ TILE_SIZE_PX: () => /* binding */ TILE_SIZE_PX,
          /* harmony export */
        });
        const SHIP_UI_ELEMENTS = [];

        const TILE_SIZE_PX = 50;
        const BOARD_SIZE = 10;

        // ship settings
        const SHIP_HEIGHT_COEFFICIENT = -10;
        const SHIP_WIDTH_COEFFICIENT = -10;

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

        function shipIsOverTile(tile, ship, length, isRotated, baseLength) {
          const tileRect = tile.getBoundingClientRect();
          const shipRect = ship.getBoundingClientRect();
          console.log(tile, ship);
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

    /***/ "./src/utilities/dock-handler.js":
      /*!***************************************!*\
  !*** ./src/utilities/dock-handler.js ***!
  \***************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");
        /* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../shipUI */ "./src/shipUI.js");
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ../constants */ "./src/constants.js");

        function createShipUI(length) {
          const ship = new _shipUI__WEBPACK_IMPORTED_MODULE_1__.ShipUI(
            document.createElement("div"),
            length
          );
          _constants__WEBPACK_IMPORTED_MODULE_2__.SHIP_UI_ELEMENTS.push(ship);
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

    /***/ "./src/utilities/game-button-handler.js":
      /*!**********************************************!*\
  !*** ./src/utilities/game-button-handler.js ***!
  \**********************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");

        const MAIN_ACTION_BUTTON_NAMES = {
          shipPlacementAfterClick: "Start placing ships",
          gameplayAfterClick: "Start game",
        };
        const mainActionButton = document.querySelector(".main-action-button");
        mainActionButton.textContent =
          MAIN_ACTION_BUTTON_NAMES.shipPlacementAfterClick;

        mainActionButton.addEventListener("click", () => {
          switch (mainActionButton.textContent) {
            case MAIN_ACTION_BUTTON_NAMES.gameplayAfterClick: {
              _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
                "checkIfAllShipsWerePlaced"
              );
              break;
            }
            case MAIN_ACTION_BUTTON_NAMES.shipPlacementAfterClick: {
              _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSub.emit(
                "placementOfShipsHasStarted"
              );
              mainActionButton.textContent =
                MAIN_ACTION_BUTTON_NAMES.gameplayAfterClick;
              break;
            }
          }
        });

        /***/
      },

    /***/ "./src/utilities/grid-handler.js":
      /*!***************************************!*\
  !*** ./src/utilities/grid-handler.js ***!
  \***************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../constants */ "./src/constants.js");
        /* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../tileUI */ "./src/tileUI.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");

        const [gridLeft, gridRight] = document.getElementsByClassName("grid");
        fillGridWithCells(gridLeft);
        fillGridWithCells(gridRight);
        setGridTileSize(gridLeft);
        setGridTileSize(gridRight);

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
          "fillGridWithCells",
          fillGridWithCells
        );
        _PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on(
          "setGridTileSize",
          setGridTileSize
        );

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
    /* harmony import */ var _utilities_grid_handler__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(
        /*! ./utilities/grid-handler */ "./src/utilities/grid-handler.js"
      );
    /* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_1__ =
      __webpack_require__(/*! ./shipUI */ "./src/shipUI.js");
    /* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_2__ =
      __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
    /* harmony import */ var _utilities_dock_handler__WEBPACK_IMPORTED_MODULE_3__ =
      __webpack_require__(
        /*! ./utilities/dock-handler */ "./src/utilities/dock-handler.js"
      );
    /* harmony import */ var _utilities_game_button_handler__WEBPACK_IMPORTED_MODULE_4__ =
      __webpack_require__(
        /*! ./utilities/game-button-handler */ "./src/utilities/game-button-handler.js"
      );
  })();

  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05rQztBQUNoQjtBQUNBO0FBQ2dCO0FBQ08iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3NoaXBVSS5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy90aWxlVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2RvY2staGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy91dGlsaXRpZXMvZ2FtZS1idXR0b24taGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy91dGlsaXRpZXMvZ3JpZC1oYW5kbGVyLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFB1YlN1YiA9ICgoKSA9PiB7XG4gIGNvbnN0IEVWRU5UUyA9IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdIHx8IFtdO1xuICAgIEVWRU5UU1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9XG5cbiAgZnVuY3Rpb24gb2ZmKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdID0gRVZFTlRTW2V2ZW50TmFtZV0uZmlsdGVyKFxuICAgICAgICAoY3VycmVudEZuKSA9PiBjdXJyZW50Rm4gIT0gZm5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChldmVudE5hbWUsIGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudE5hbWUgKyBcIiBFVkVOVCBXQVMgQ0FMTEVEXCIpO1xuICAgIGlmIChFVkVOVFNbZXZlbnROYW1lXSkge1xuICAgICAgRVZFTlRTW2V2ZW50TmFtZV0uZm9yRWFjaCgoZm4pID0+IHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBvbiwgb2ZmLCBlbWl0IH07XG59KSgpO1xuIiwiZXhwb3J0IGNvbnN0IFNISVBfVUlfRUxFTUVOVFMgPSBbXTtcblxuZXhwb3J0IGNvbnN0IFRJTEVfU0laRV9QWCA9IDUwO1xuZXhwb3J0IGNvbnN0IEJPQVJEX1NJWkUgPSAxMDtcblxuLy8gc2hpcCBzZXR0aW5nc1xuZXhwb3J0IGNvbnN0IFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UID0gLTEwO1xuZXhwb3J0IGNvbnN0IFNISVBfV0lEVEhfQ09FRkZJQ0lFTlQgPSAtMTA7XG4iLCJpbXBvcnQgeyBUSUxFX1NJWkVfUFggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xuaW1wb3J0IHsgU0hJUF9XSURUSF9DT0VGRklDSUVOVCwgU0hJUF9IRUlHSFRfQ09FRkZJQ0lFTlQgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmV4cG9ydCBjbGFzcyBTaGlwVUkge1xuICBzdGF0aWMgbW92YWJsZVNoaXAgPSBudWxsO1xuICBvZmZzZXRYID0gMDtcbiAgb2Zmc2V0WSA9IDA7XG4gIHRpbGVzUGxhY2VkID0gW107XG5cbiAgY29uc3RydWN0b3Ioc2hpcEVsZW1lbnQsIGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQgPSBzaGlwRWxlbWVudDtcbiAgICB0aGlzLnNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkb2NrLXNoaXBcIik7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBsZW5ndGgtJHtsZW5ndGh9YCk7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS53aWR0aCA9XG4gICAgICBsZW5ndGggKiBUSUxFX1NJWkVfUFggKyBTSElQX1dJRFRIX0NPRUZGSUNJRU5UICsgXCJweFwiO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID1cbiAgICAgIFRJTEVfU0laRV9QWCArIFNISVBfSEVJR0hUX0NPRUZGSUNJRU5UICsgXCJweFwiO1xuXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuc2hpcEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5zdGFydFkgPSByZWN0LnRvcDtcbiAgICB0aGlzLnN0YXJ0WCA9IHJlY3QubGVmdDtcblxuICAgIHNoaXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IHRoaXM7XG5cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNoaXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5vZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICB0aGlzLm9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICBjb25zb2xlLmxvZyhlLmNsaWVudFksIHJlY3QudG9wLCB0aGlzLm9mZnNldFkpO1xuICAgICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlKGUsIHNoaXApIHtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS50b3AgPSBlLnBhZ2VZIC0gc2hpcC5vZmZzZXRZICsgXCJweFwiO1xuICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYIC0gc2hpcC5vZmZzZXRYICsgXCJweFwiO1xufVxuXG5mdW5jdGlvbiByZXNldChzaGlwKSB7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUudG9wID0gU2hpcFVJLm1vdmFibGVTaGlwLnN0YXJ0WSArIFwicHhcIjtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gU2hpcFVJLm1vdmFibGVTaGlwLnN0YXJ0WCArIFwicHhcIjtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwic3RhdGljXCI7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IHtcbiAgaWYgKFNoaXBVSS5tb3ZhYmxlU2hpcCkge1xuICAgIG1vdmUoZSwgU2hpcFVJLm1vdmFibGVTaGlwKTtcbiAgICBQdWJTdWIuZW1pdChcInNoaXBJc01vdmluZ1wiLCBTaGlwVUkubW92YWJsZVNoaXApO1xuICB9XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKCkgPT4ge1xuICBpZiAoU2hpcFVJLm1vdmFibGVTaGlwKSB7XG4gICAgUHViU3ViLmVtaXQoXCJub1NoaXBNb3ZlbWVudFwiLCBTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIHJlc2V0KFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgU2hpcFVJLm1vdmFibGVTaGlwID0gbnVsbDtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBUSUxFX1NJWkVfUFggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuL1B1YlN1YlwiO1xuXG5mdW5jdGlvbiBzaGlwSXNPdmVyVGlsZSh0aWxlLCBzaGlwLCBsZW5ndGgsIGlzUm90YXRlZCwgYmFzZUxlbmd0aCkge1xuICBjb25zdCB0aWxlUmVjdCA9IHRpbGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHNoaXBSZWN0ID0gc2hpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc29sZS5sb2codGlsZSwgc2hpcCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkaWZmZXJlbmNlVG9wID0gTWF0aC5hYnModGlsZVJlY3QudG9wIC0gc2hpcFJlY3QudG9wKTtcbiAgICBjb25zdCBkaWZmZXJlbmNlTGVmdCA9IE1hdGguYWJzKHRpbGVSZWN0LmxlZnQgLSBzaGlwUmVjdC5sZWZ0KTtcbiAgICBjb25zdCBkaWZmZXJlbmNlQm90dG9tID0gaXNSb3RhdGVkXG4gICAgICA/IE1hdGguYWJzKHRpbGVSZWN0LmJvdHRvbSAtIChzaGlwUmVjdC5ib3R0b20gLSBiYXNlTGVuZ3RoICogaSkpXG4gICAgICA6IE1hdGguYWJzKHRpbGVSZWN0LmJvdHRvbSAtIHNoaXBSZWN0LmJvdHRvbSk7XG4gICAgY29uc3QgZGlmZmVyZW5jZVJpZ2h0ID0gaXNSb3RhdGVkXG4gICAgICA/IE1hdGguYWJzKHRpbGVSZWN0LnJpZ2h0IC0gc2hpcFJlY3QucmlnaHQpXG4gICAgICA6IE1hdGguYWJzKHRpbGVSZWN0LnJpZ2h0IC0gKHNoaXBSZWN0LnJpZ2h0IC0gYmFzZUxlbmd0aCAqIGkpKTtcblxuICAgIGlmIChcbiAgICAgIChkaWZmZXJlbmNlVG9wIDwgdGlsZVJlY3QuaGVpZ2h0IC8gMiB8fFxuICAgICAgICBkaWZmZXJlbmNlTGVmdCA8IHRpbGVSZWN0LndpZHRoIC8gMikgJiZcbiAgICAgIGRpZmZlcmVuY2VCb3R0b20gPCB0aWxlUmVjdC5oZWlnaHQgLyAyICYmXG4gICAgICBkaWZmZXJlbmNlUmlnaHQgPCB0aWxlUmVjdC53aWR0aCAvIDIgJiZcbiAgICAgIGRpZmZlcmVuY2VUb3AgPCB0aWxlUmVjdC5oZWlnaHQgLyAyXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjbGFzcyBUaWxlVUkge1xuICBmaWxsZWQgPSBmYWxzZTtcbiAgY29uc3RydWN0b3IodGlsZUVsZW1lbnQsIHgsIHkpIHtcbiAgICB0aGlzLnRpbGVFbGVtZW50ID0gdGlsZUVsZW1lbnQ7XG4gICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGlsZVwiKTtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueCA9IHg7XG4gICAgdGhpcy50aWxlRWxlbWVudC5kYXRhc2V0LnkgPSB5O1xuICAgIHRoaXMudGlsZUVsZW1lbnQud2lkdGggPSBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG5cbiAgICBQdWJTdWIub24oXCJzaGlwSXNNb3ZpbmdcIiwgKHNoaXApID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgc2hpcElzT3ZlclRpbGUoXG4gICAgICAgICAgdGhpcy50aWxlRWxlbWVudCxcbiAgICAgICAgICBzaGlwLnNoaXBFbGVtZW50LFxuICAgICAgICAgIHNoaXAubGVuZ3RoLFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIFRJTEVfU0laRV9QWFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aWxlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJlZFdpdGhTaGlwXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFB1YlN1Yi5vbihcIm5vU2hpcE1vdmVtZW50XCIsICgpID0+IHtcbiAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuaW1wb3J0IHsgU2hpcFVJIH0gZnJvbSBcIi4uL3NoaXBVSVwiO1xuaW1wb3J0IHsgU0hJUF9VSV9FTEVNRU5UUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcFVJKGxlbmd0aCkge1xuICBjb25zdCBzaGlwID0gbmV3IFNoaXBVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCBsZW5ndGgpO1xuICBTSElQX1VJX0VMRU1FTlRTLnB1c2goc2hpcCk7XG4gIHJldHVybiBzaGlwLnNoaXBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwdXNoU2hpcFRvRG9jayhzaGlwRWxlbWVudCkge1xuICBkb2NrLmFwcGVuZENoaWxkKHNoaXBFbGVtZW50KTtcbn1cblxuY29uc3QgZG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9ja1wiKTtcblxuUHViU3ViLm9uKFwicGxhY2VtZW50T2ZTaGlwc0hhc1N0YXJ0ZWRcIiwgKCkgPT4ge1xuICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcblxuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoNCkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMykpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMykpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMikpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSkpO1xufSk7XG5cblB1YlN1Yi5vbihcImNoZWNrSWZBbGxTaGlwc1dlcmVQbGFjZWRcIiwgKCkgPT4ge1xuICBpZiAoZG9jay5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgYWxlcnQoXCJEb2NrIGlzIG5vdCBlbXB0eSFcIik7XG4gIH0gZWxzZSB7XG4gICAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XG4gICAgUHViU3ViLmVtaXQoXCJnYW1lU3RhcnRzXCIpO1xuICB9XG59KTtcbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcblxuY29uc3QgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTID0ge1xuICBzaGlwUGxhY2VtZW50QWZ0ZXJDbGljazogXCJTdGFydCBwbGFjaW5nIHNoaXBzXCIsXG4gIGdhbWVwbGF5QWZ0ZXJDbGljazogXCJTdGFydCBnYW1lXCIsXG59O1xuY29uc3QgbWFpbkFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1hY3Rpb24tYnV0dG9uXCIpO1xubWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9IE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5zaGlwUGxhY2VtZW50QWZ0ZXJDbGljaztcblxubWFpbkFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBzd2l0Y2ggKG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQpIHtcbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5nYW1lcGxheUFmdGVyQ2xpY2s6IHtcbiAgICAgIFB1YlN1Yi5lbWl0KFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5zaGlwUGxhY2VtZW50QWZ0ZXJDbGljazoge1xuICAgICAgUHViU3ViLmVtaXQoXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiKTtcbiAgICAgIG1haW5BY3Rpb25CdXR0b24udGV4dENvbnRlbnQgPVxuICAgICAgICBNQUlOX0FDVElPTl9CVVRUT05fTkFNRVMuZ2FtZXBsYXlBZnRlckNsaWNrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCB7IFRJTEVfU0laRV9QWCB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFRpbGVVSSB9IGZyb20gXCIuLi90aWxlVUlcIjtcbmltcG9ydCB7IEJPQVJEX1NJWkUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi4vUHViU3ViXCI7XG5cbmNvbnN0IFtncmlkTGVmdCwgZ3JpZFJpZ2h0XSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJncmlkXCIpO1xuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZExlZnQpO1xuZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZFJpZ2h0KTtcbnNldEdyaWRUaWxlU2l6ZShncmlkTGVmdCk7XG5zZXRHcmlkVGlsZVNpemUoZ3JpZFJpZ2h0KTtcblxuZnVuY3Rpb24gZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZCkge1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1NJWkU7IHkrKykge1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQk9BUkRfU0laRTsgeCsrKSB7XG4gICAgICBjb25zdCB0aWxlID0gbmV3IFRpbGVVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCB4ICsgMSwgeSArIDEpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZCh0aWxlLnRpbGVFbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0R3JpZFRpbGVTaXplKGdyaWQpIHtcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1xuICAgIFRJTEVfU0laRV9QWCArIFwicHhcIlxuICB9KWA7XG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtUSUxFX1NJWkVfUFggKyBcInB4XCJ9KWA7XG59XG5cblB1YlN1Yi5vbihcImZpbGxHcmlkV2l0aENlbGxzXCIsIGZpbGxHcmlkV2l0aENlbGxzKTtcblB1YlN1Yi5vbihcInNldEdyaWRUaWxlU2l6ZVwiLCBzZXRHcmlkVGlsZVNpemUpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3V0aWxpdGllcy9ncmlkLWhhbmRsZXJcIjtcbmltcG9ydCBcIi4vc2hpcFVJXCI7XG5pbXBvcnQgXCIuL3RpbGVVSVwiO1xuaW1wb3J0IFwiLi91dGlsaXRpZXMvZG9jay1oYW5kbGVyXCI7XG5pbXBvcnQgXCIuL3V0aWxpdGllcy9nYW1lLWJ1dHRvbi1oYW5kbGVyXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
