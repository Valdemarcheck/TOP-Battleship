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
          /* harmony export */ MAX_HORIZONTAL: () =>
            /* binding */ MAX_HORIZONTAL,
          /* harmony export */ MAX_VERTICAL: () => /* binding */ MAX_VERTICAL,
          /* harmony export */ PRESSED_MOUSE_BUTTON: () =>
            /* binding */ PRESSED_MOUSE_BUTTON,
          /* harmony export */ TILE_SIZE_PX: () => /* binding */ TILE_SIZE_PX,
          /* harmony export */
        });
        // board settings
        const TILE_SIZE_PX = 45;
        const BOARD_SIZE = 10;

        // ship over tile detection
        const MAX_HORIZONTAL = parseInt(TILE_SIZE_PX / 2);
        const MAX_VERTICAL = parseInt(TILE_SIZE_PX / 2);

        const PRESSED_MOUSE_BUTTON = { MIDDLE_CLICK: 1, LEFT_CLICK: 0 };

        /***/
      },

    /***/ "./src/gameplay/computer.js":
      /*!**********************************!*\
  !*** ./src/gameplay/computer.js ***!
  \**********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ ComputerPlayer: () =>
            /* binding */ ComputerPlayer,
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../constants */ "./src/constants.js");

        function ComputerPlayer(computerBoard, enemyBoard) {
          const unusedCoordinatesObj = (() => {
            const unusedCoordinatesObj = {};
            const yCoordinatesInOneColumn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            for (
              let i = 1;
              i <= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE;
              i++
            ) {
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
              possibleXValues[
                Math.floor(Math.random() * possibleXValues.length)
              ];
            const possibleYValues = unusedCoordinatesObj[x];
            const y =
              possibleYValues[
                Math.floor(Math.random() * possibleYValues.length)
              ];

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

        /***/
      },

    /***/ "./src/gameplay/gameboard.js":
      /*!***********************************!*\
  !*** ./src/gameplay/gameboard.js ***!
  \***********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Gameboard: () => /* binding */ Gameboard,
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../constants */ "./src/constants.js");

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
          hitCellsBoardArray = getArrayOfSameValues(
            _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE,
            false
          );
          shipsOnBoardArray = getArrayOfSameValues(
            _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE,
            null
          );
          listOfShips = [];

          constructor() {}

          isPlacementLegal({ shipUI, isVertical, startX, startY }) {
            return (
              !this.#areStartCoordinatesOutOfBounds(startX, startY) &&
              !this.#areEndCoordinatesOutOfBounds({
                shipLength: shipUI.length,
                isVertical,
                startX,
                startY,
              }) &&
              !this.#isFilledPath({
                pathLength: shipUI.length,
                isVertical,
                startX,
                startY,
              })
            );
          }

          remove({ id, isVertical, length, startX, startY }) {
            const [actualStartX, actualStartY] =
              this.#convertBoardCoordsToArrayCoords(startX, startY);
            if (isVertical) {
              for (let currentY = 0; currentY < length; currentY++) {
                this.shipsOnBoardArray[actualStartY - currentY][actualStartX] =
                  null;
              }
            } else {
              for (let currentX = 0; currentX < length; currentX++) {
                this.shipsOnBoardArray[actualStartY][actualStartX + currentX] =
                  null;
              }
            }
            this.#removeShipFromListOfPlacedShips(id);
          }

          place({ shipUI, isVertical, startX, startY }) {
            if (
              !this.isPlacementLegal({ shipUI, isVertical, startX, startY })
            ) {
              throw new Error(
                "Given coordinates are out of bounds of the gameboard"
              );
            }

            [startX, startY] = this.#convertBoardCoordsToArrayCoords(
              startX,
              startY
            );

            if (isVertical) {
              for (let currentY = 0; currentY < shipUI.length; currentY++) {
                this.shipsOnBoardArray[startY - currentY][startX] = shipUI;
              }
            } else {
              for (let currentX = 0; currentX < shipUI.length; currentX++) {
                this.shipsOnBoardArray[startY][startX + currentX] = shipUI;
              }
            }

            this.#addShipToListOfShips(shipUI);
          }

          isShipPlacedOnCoordinates(x, y) {
            const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(
              x,
              y
            );
            return !!this.shipsOnBoardArray[actualY][actualX];
          }

          receiveAttack(x, y) {
            if (
              this.#areStartCoordinatesOutOfBounds(x, y) ||
              this.#isHit(x, y)
            ) {
              throw new Error(
                "Given coordinates are out of bounds of the gameboard"
              );
            }
            const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(
              x,
              y
            );
            this.hitCellsBoardArray[actualY][actualX] = true;

            const hitShip = this.shipsOnBoardArray[actualY][actualX];
            if (hitShip) {
              hitShip.hit();
            }
          }

          get areAllShipsSunk() {
            return this.listOfShips.every((shipUI) => {
              return shipUI.isSunk;
            });
          }

          #removeShipFromListOfPlacedShips(id) {
            this.listOfShips = this.listOfShips.filter((ship) => ship.id != id);
          }

          #isHit(x, y) {
            const [actualX, actualY] = this.#convertBoardCoordsToArrayCoords(
              x,
              y
            );
            return this.hitCellsBoardArray[actualY][actualX];
          }

          #isFilledPath({ pathLength, isVertical, startX, startY }) {
            const [actualStartX, actualStartY] =
              this.#convertBoardCoordsToArrayCoords(startX, startY);

            if (isVertical) {
              for (let currentY = 0; currentY < pathLength; currentY++) {
                if (
                  !!this.shipsOnBoardArray[actualStartY - currentY][
                    actualStartX
                  ]
                ) {
                  return true;
                }
              }
            } else {
              for (let currentX = 0; currentX < pathLength; currentX++) {
                if (
                  !!this.shipsOnBoardArray[actualStartY][
                    actualStartX + currentX
                  ]
                ) {
                  return true;
                }
              }
            }

            return false;
          }

          #addShipToListOfShips(shipUI) {
            this.listOfShips.push(shipUI);
          }

          #convertBoardCoordsToArrayCoords(x, y) {
            return [x - 1, y - 1];
          }

          #areStartCoordinatesOutOfBounds(x, y) {
            return (
              x < 0 ||
              y < 0 ||
              x > _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE ||
              y > _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE
            );
          }

          #areEndCoordinatesOutOfBounds({
            shipLength,
            isVertical,
            startX,
            startY,
          }) {
            if (isVertical) {
              const endY = startY - shipLength;
              return endY < 0;
            } else {
              const endX = startX + shipLength - 1;
              return endX > _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_SIZE;
            }
          }
        }

        /***/
      },

    /***/ "./src/gameplay/gameplay-objects-handler.js":
      /*!**************************************************!*\
  !*** ./src/gameplay/gameplay-objects-handler.js ***!
  \**************************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ doesShipCrossAnyShips: () =>
            /* binding */ doesShipCrossAnyShips,
          /* harmony export */
        });
        /* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./gameboard */ "./src/gameplay/gameboard.js");
        /* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./player */ "./src/gameplay/player.js");
        /* harmony import */ var _computer__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./computer */ "./src/gameplay/computer.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");
        /* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_4__ =
          __webpack_require__(/*! ./ship */ "./src/gameplay/ship.js");

        const playerBoard =
          new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();
        const computerBoard =
          new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();

        const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player(
          playerBoard,
          computerBoard
        );
        const computer = (0,
        _computer__WEBPACK_IMPORTED_MODULE_2__.ComputerPlayer)(
          computerBoard,
          playerBoard
        );

        function removeShipUIFromBoard(shipUI) {
          console.log("Removal");
          playerBoard.remove({
            id: shipUI.id,
            sVertical: shipUI.isVertical,
            length: shipUI.length,
            startX: shipUI.startX,
            startY: shipUI.startY,
          });
        }

        function doesShipCrossAnyShips(tilesUnderShip) {
          return tilesUnderShip.some((tileUi) =>
            playerBoard.isShipPlacedOnCoordinates(tileUi.x, tileUi.y)
          );
        }

        function placeShipUIOnBoard(shipUI) {
          const gameplayShip = new _ship__WEBPACK_IMPORTED_MODULE_4__.Ship(
            shipUI.length,
            shipUI.id
          );
          playerBoard.place({
            shipUI: gameplayShip,
            isVertical: false,
            startX: shipUI.startX,
            startY: shipUI.startY,
          });
          console.log(playerBoard);
        }

        _PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.on(
          "placeShipUIOnBoard",
          placeShipUIOnBoard
        );
        _PubSub__WEBPACK_IMPORTED_MODULE_3__.PubSub.on(
          "removeShipFromBoard",
          removeShipUIFromBoard
        );

        /***/
      },

    /***/ "./src/gameplay/player.js":
      /*!********************************!*\
  !*** ./src/gameplay/player.js ***!
  \********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Player: () => /* binding */ Player,
          /* harmony export */
        });
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

        /***/
      },

    /***/ "./src/gameplay/ship.js":
      /*!******************************!*\
  !*** ./src/gameplay/ship.js ***!
  \******************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ Ship: () => /* binding */ Ship,
          /* harmony export */
        });
        class Ship {
          timesHit = 0;

          constructor(length, id) {
            this.length = length;
            this.id = id;
          }

          hit() {
            this.timesHit++;
          }

          get isSunk() {
            return this.timesHit >= this.length;
          }
        }

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
        /* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ./tileUI */ "./src/tileUI.js");
        /* harmony import */ var _gameplay_gameplay_objects_handler__WEBPACK_IMPORTED_MODULE_3__ =
          __webpack_require__(
            /*! ./gameplay/gameplay-objects-handler */ "./src/gameplay/gameplay-objects-handler.js"
          );

        function rotateShip() {
          if (!this.isVertical) {
            this.shipElement.style.height =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX *
                this.length +
              "px";
            this.shipElement.style.width =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";
          } else {
            this.shipElement.style.height =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";
            this.shipElement.style.width =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX *
                this.length +
              "px";
          }
          this.shipElement.classList.toggle("vertical");
          this.isVertical = !this.isVertical;
          console.log(this.isVertical);
        }

        function prepareShipForDragAndDrop(e) {
          const rect = this.shipElement.getBoundingClientRect();
          this.offsetY = e.clientY - rect.top;
          this.offsetX = e.clientX - rect.left;
          this.shipElement.style.position = "absolute";
        }

        function setupShipElement(shipElement, ID, length, isVertical) {
          shipElement.id = ID;
          shipElement.classList.add("dock-ship");
          if (isVertical) {
            shipElement.classList.add("vertical");
            shipElement.style.width =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";
            shipElement.style.height =
              length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX +
              "px";
          } else {
            shipElement.style.width =
              length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX +
              "px";
            shipElement.style.height =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";
          }
          return shipElement;
        }

        function setupShipImage(shipElement, length) {
          const shipImage = new Image();
          shipImage.style.width =
            length * _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX +
            "px";
          shipImage.style.height =
            _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";
          shipImage.classList.add("ship-image");
          shipImage.draggable = false;
          shipImage.src = `images/${length}ship.png`;
          shipElement.append(shipImage);
        }

        class ShipUI {
          static movableShip = null;
          static allShips = [];
          static usedIDs = [];
          static ID_MAX_SIZE = 2;
          onBoard = false;
          offsetX = 0;
          offsetY = 0;
          startX = null;
          startY = null;

          constructor(shipElement, length, isVertical) {
            ShipUI.allShips.push(this);
            const ID = ShipUI.#generateShipID();
            this.id = ID;
            this.length = length;
            this.isVertical = isVertical;

            this.shipElement = setupShipElement(
              shipElement,
              ID,
              length,
              isVertical
            );
            setupShipImage(this.shipElement, length);

            shipElement.addEventListener("mousedown", (e) => {
              switch (e.button) {
                case _constants__WEBPACK_IMPORTED_MODULE_0__
                  .PRESSED_MOUSE_BUTTON.LEFT_CLICK:
                  ShipUI.movableShip = this;
                  prepareShipForDragAndDrop.call(this, e);
                  break;

                case _constants__WEBPACK_IMPORTED_MODULE_0__
                  .PRESSED_MOUSE_BUTTON.MIDDLE_CLICK:
                  if (this.length > 1) rotateShip.call(this);
                  break;
              }
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

        function isShipPositionLegal(ShipUI, tilesUnderShip) {
          const isShipOverAnyTiles = tilesUnderShip.length > 0;
          const isShipOutOfBounds =
            tilesUnderShip.length !== ShipUI.movableShip.length;
          return (
            isShipOverAnyTiles &&
            !(0,
            _gameplay_gameplay_objects_handler__WEBPACK_IMPORTED_MODULE_3__.doesShipCrossAnyShips)(
              tilesUnderShip
            ) &&
            !isShipOutOfBounds
          );
        }

        function setShipStartCoordinates(shipUI, tilesUnderShip) {
          shipUI.startX = tilesUnderShip[0].x;
          shipUI.startY = tilesUnderShip[0].y;
        }

        function setShipOriginToTile(shipUI, tileUI) {
          const tileRect = tileUI.tileElement.getBoundingClientRect();
          shipUI.originX = tileRect.left + window.scrollX;
          shipUI.originY = tileRect.top + window.scrollY;
        }

        function move(e, ship) {
          ship.shipElement.style.top = e.pageY - ship.offsetY + "px";
          ship.shipElement.style.left = e.pageX - ship.offsetX + "px";
        }

        function reset(ship, isShipPositionLegal) {
          if (!isShipPositionLegal) {
            ship.shipElement.style.position = "relative";
          } else {
            ship.shipElement.style.top = ShipUI.movableShip.originY + "px";
            ship.shipElement.style.left = ShipUI.movableShip.originX + "px";
          }
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
            const tilesUnderShip = (0,
            _tileUI__WEBPACK_IMPORTED_MODULE_2__.getTilesUnderShip)(
              ShipUI.movableShip
            );
            const mayBePlacedOnBoard = isShipPositionLegal(
              ShipUI,
              tilesUnderShip
            );

            if (ShipUI.movableShip.onBoard) {
              _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit(
                "removeShipFromBoard",
                ShipUI.movableShip
              );
              ShipUI.movableShip.onBoard = false;
            }
            if (mayBePlacedOnBoard) {
              setShipStartCoordinates(ShipUI.movableShip, tilesUnderShip);
              setShipOriginToTile(ShipUI.movableShip, tilesUnderShip[0]);
              ShipUI.movableShip.onBoard = true;

              _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.emit(
                "placeShipUIOnBoard",
                ShipUI.movableShip
              );
            } else {
              console.warn("Such ship placement is illegal");
            }

            reset(ShipUI.movableShip, mayBePlacedOnBoard);
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
          /* harmony export */ getTilesUnderShip: () =>
            /* binding */ getTilesUnderShip,
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./constants */ "./src/constants.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./PubSub */ "./src/PubSub.js");
        /* harmony import */ var _utilities_grid_handler__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            /*! ./utilities/grid-handler */ "./src/utilities/grid-handler.js"
          );

        function tileBelongsToEnemyGrid(tile, enemyGrid) {
          return tile.parentElement == enemyGrid;
        }

        function getElementCoords(element) {
          return [
            element.left + window.scrollX,
            element.top + window.scrollY,
            element.right + window.scrollX,
            element.bottom + window.scrollY,
          ];
        }

        function getDifferencesInCoordsBetweenTileAndShip(tileRect, shipRect) {
          const [tileLeft, tileTop, tileRight, tileBottom] =
            getElementCoords(tileRect);
          const [shipLeft, shipTop, shipRight, shipBottom] =
            getElementCoords(shipRect);
          return [
            shipLeft - tileLeft,
            shipTop - tileTop,
            tileRight - shipRight,
            tileBottom - shipBottom,
          ];
        }

        function isShipInsideByHorizontal(differenceLeft, differenceRight) {
          return (
            (differenceLeft <
              _constants__WEBPACK_IMPORTED_MODULE_0__.MAX_HORIZONTAL &&
              differenceRight <= 0) ||
            (differenceRight <
              _constants__WEBPACK_IMPORTED_MODULE_0__.MAX_HORIZONTAL &&
              differenceLeft <= 0)
          );
        }

        function isShipInsideByVertical(differenceTop, differenceBottom) {
          return (
            (differenceTop <
              _constants__WEBPACK_IMPORTED_MODULE_0__.MAX_VERTICAL &&
              differenceBottom <= 0) ||
            (differenceBottom <
              _constants__WEBPACK_IMPORTED_MODULE_0__.MAX_VERTICAL &&
              differenceTop <= 0)
          );
        }

        function isShipOverTile(tile, ship) {
          if (
            tileBelongsToEnemyGrid(
              tile,
              _utilities_grid_handler__WEBPACK_IMPORTED_MODULE_2__.enemyGrid
            )
          )
            return false;
          const shipRect = ship.getBoundingClientRect();
          const tileRect = tile.getBoundingClientRect();

          const [
            differenceLeft,
            differenceTop,
            differenceRight,
            differenceBottom,
          ] = getDifferencesInCoordsBetweenTileAndShip(tileRect, shipRect);

          return (
            isShipInsideByHorizontal(differenceLeft, differenceRight) &&
            isShipInsideByVertical(differenceTop, differenceBottom)
          );
        }
        function getTilesUnderShip(shipUI) {
          return TileUI.allTiles.filter((tileUI) =>
            isShipOverTile(tileUI.tileElement, shipUI.shipElement)
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
            this.tileElement.width =
              _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_SIZE_PX + "px";

            _PubSub__WEBPACK_IMPORTED_MODULE_1__.PubSub.on(
              "shipIsMoving",
              (ship) => {
                if (isShipOverTile(this.tileElement, ship.shipElement)) {
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

        function createShipUI(length, vertical) {
          const ship = new _shipUI__WEBPACK_IMPORTED_MODULE_1__.ShipUI(
            document.createElement("div"),
            length,
            vertical
          );
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

            pushShipToDock(createShipUI(4, false));
            pushShipToDock(createShipUI(3, false));
            pushShipToDock(createShipUI(3, false));
            pushShipToDock(createShipUI(2, false));
            pushShipToDock(createShipUI(2, false));
            pushShipToDock(createShipUI(2, false));
            pushShipToDock(createShipUI(1, false));
            pushShipToDock(createShipUI(1, false));
            pushShipToDock(createShipUI(1, false));
            pushShipToDock(createShipUI(1, false));
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
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ enemyGrid: () => /* binding */ enemyGrid,
          /* harmony export */ playerGrid: () => /* binding */ playerGrid,
          /* harmony export */
        });
        /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ../constants */ "./src/constants.js");
        /* harmony import */ var _tileUI__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../tileUI */ "./src/tileUI.js");
        /* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(/*! ../PubSub */ "./src/PubSub.js");

        const [enemyGrid, playerGrid] = document.getElementsByClassName("grid");
        fillGridWithCells(enemyGrid);
        fillGridWithCells(playerGrid);
        setGridTileSize(enemyGrid);
        setGridTileSize(playerGrid);

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

        function greyOutEnemyGrid() {
          enemyGrid.classList.add("greyed-out");
        }

        _PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on(
          "fillGridWithCells",
          fillGridWithCells
        );
        _PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on(
          "setGridTileSize",
          setGridTileSize
        );
        _PubSub__WEBPACK_IMPORTED_MODULE_2__.PubSub.on(
          "placementOfShipsHasStarted",
          greyOutEnemyGrid
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
    /* harmony import */ var _gameplay_gameplay_objects_handler__WEBPACK_IMPORTED_MODULE_5__ =
      __webpack_require__(
        /*! ./gameplay/gameplay-objects-handler */ "./src/gameplay/gameplay-objects-handler.js"
      );
  })();

  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q087QUFDSSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2dhbWVwbGF5L2dhbWVwbGF5LW9iamVjdHMtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9nYW1lcGxheS9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZXBsYXkvc2hpcC5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC8uL3NyYy9zaGlwVUkuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdGlsZVVJLmpzIiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL3V0aWxpdGllcy9kb2NrLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2dhbWUtYnV0dG9uLWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvLi9zcmMvdXRpbGl0aWVzL2dyaWQtaGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9wLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b3AtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvcC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBQdWJTdWIgPSAoKCkgPT4ge1xuICBjb25zdCBFVkVOVFMgPSB7fTtcblxuICBmdW5jdGlvbiBvbihldmVudE5hbWUsIGZuKSB7XG4gICAgRVZFTlRTW2V2ZW50TmFtZV0gPSBFVkVOVFNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBFVkVOVFNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9mZihldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKEVWRU5UU1tldmVudE5hbWVdKSB7XG4gICAgICBFVkVOVFNbZXZlbnROYW1lXSA9IEVWRU5UU1tldmVudE5hbWVdLmZpbHRlcihcbiAgICAgICAgKGN1cnJlbnRGbikgPT4gY3VycmVudEZuICE9IGZuXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXQoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgY29uc29sZS5sb2coZXZlbnROYW1lICsgXCIgRVZFTlQgV0FTIENBTExFRFwiKTtcbiAgICBpZiAoRVZFTlRTW2V2ZW50TmFtZV0pIHtcbiAgICAgIEVWRU5UU1tldmVudE5hbWVdLmZvckVhY2goKGZuKSA9PiB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgb24sIG9mZiwgZW1pdCB9O1xufSkoKTtcbiIsIi8vIGJvYXJkIHNldHRpbmdzXG5leHBvcnQgY29uc3QgVElMRV9TSVpFX1BYID0gNDU7XG5leHBvcnQgY29uc3QgQk9BUkRfU0laRSA9IDEwO1xuXG4vLyBzaGlwIG92ZXIgdGlsZSBkZXRlY3Rpb25cbmV4cG9ydCBjb25zdCBNQVhfSE9SSVpPTlRBTCA9IHBhcnNlSW50KFRJTEVfU0laRV9QWCAvIDIpO1xuZXhwb3J0IGNvbnN0IE1BWF9WRVJUSUNBTCA9IHBhcnNlSW50KFRJTEVfU0laRV9QWCAvIDIpO1xuXG5leHBvcnQgY29uc3QgUFJFU1NFRF9NT1VTRV9CVVRUT04gPSB7IE1JRERMRV9DTElDSzogMSwgTEVGVF9DTElDSzogMCB9O1xuIiwiaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQm9hcmQsIGVuZW15Qm9hcmQpIHtcbiAgY29uc3QgdW51c2VkQ29vcmRpbmF0ZXNPYmogPSAoKCkgPT4ge1xuICAgIGNvbnN0IHVudXNlZENvb3JkaW5hdGVzT2JqID0ge307XG4gICAgY29uc3QgeUNvb3JkaW5hdGVzSW5PbmVDb2x1bW4gPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gQk9BUkRfU0laRTsgaSsrKSB7XG4gICAgICB1bnVzZWRDb29yZGluYXRlc09ialtpXSA9IFsuLi55Q29vcmRpbmF0ZXNJbk9uZUNvbHVtbl07XG4gICAgfVxuICAgIHJldHVybiB1bnVzZWRDb29yZGluYXRlc09iajtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiByZW1vdmVFbGVtZW50RnJvbUFycmF5KHZhbHVlLCBhcnJheSkge1xuICAgIGNvbnN0IGFycmF5Q29weSA9IFsuLi5hcnJheV07XG4gICAgY29uc3QgaW5kZXhPZlZhbHVlID0gYXJyYXlDb3B5LmluZGV4T2YodmFsdWUpO1xuICAgIGFycmF5Q29weS5zcGxpY2UoaW5kZXhPZlZhbHVlLCAxKTtcbiAgICByZXR1cm4gYXJyYXlDb3B5O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKSB7XG4gICAgY29uc3QgcG9zc2libGVYVmFsdWVzID0gT2JqZWN0LmtleXModW51c2VkQ29vcmRpbmF0ZXNPYmopO1xuICAgIGNvbnN0IHggPVxuICAgICAgcG9zc2libGVYVmFsdWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlWFZhbHVlcy5sZW5ndGgpXTtcbiAgICBjb25zdCBwb3NzaWJsZVlWYWx1ZXMgPSB1bnVzZWRDb29yZGluYXRlc09ialt4XTtcbiAgICBjb25zdCB5ID1cbiAgICAgIHBvc3NpYmxlWVZhbHVlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZVlWYWx1ZXMubGVuZ3RoKV07XG5cbiAgICB1bnVzZWRDb29yZGluYXRlc09ialt4XSA9IHJlbW92ZUVsZW1lbnRGcm9tQXJyYXkoXG4gICAgICB5LFxuICAgICAgdW51c2VkQ29vcmRpbmF0ZXNPYmpbeF1cbiAgICApO1xuICAgIGlmICh1bnVzZWRDb29yZGluYXRlc09ialt4XS5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlbGV0ZSB1bnVzZWRDb29yZGluYXRlc09ialt4XTtcbiAgICB9XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VUdXJuKCkge1xuICAgIGNvbnN0IFt4LCB5XSA9IGdldFJhbmRvbUNvb3JkaW5hdGVzKCk7XG4gICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICB9XG5cbiAgcmV0dXJuIHsgdW51c2VkQ29vcmRpbmF0ZXNPYmosIG1ha2VUdXJuIH07XG59XG4iLCJpbXBvcnQgeyBCT0FSRF9TSVpFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuXG5mdW5jdGlvbiBnZXRBcnJheU9mU2FtZVZhbHVlcyhzaXplLCB2YWx1ZSkge1xuICBjb25zdCBhcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGFycmF5LnB1c2goW10pO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICBhcnJheVtpXS5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgY2xhc3MgR2FtZWJvYXJkIHtcbiAgaGl0Q2VsbHNCb2FyZEFycmF5ID0gZ2V0QXJyYXlPZlNhbWVWYWx1ZXMoQk9BUkRfU0laRSwgZmFsc2UpO1xuICBzaGlwc09uQm9hcmRBcnJheSA9IGdldEFycmF5T2ZTYW1lVmFsdWVzKEJPQVJEX1NJWkUsIG51bGwpO1xuICBsaXN0T2ZTaGlwcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBpc1BsYWNlbWVudExlZ2FsKHsgc2hpcE9iaiwgaXNWZXJ0aWNhbCwgc3RhcnRYLCBzdGFydFkgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy4jYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHN0YXJ0WCwgc3RhcnRZKSAmJlxuICAgICAgIXRoaXMuI2FyZUVuZENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoe1xuICAgICAgICBzaGlwTGVuZ3RoOiBzaGlwT2JqLmxlbmd0aCxcbiAgICAgICAgaXNWZXJ0aWNhbCxcbiAgICAgICAgc3RhcnRYLFxuICAgICAgICBzdGFydFksXG4gICAgICB9KSAmJlxuICAgICAgIXRoaXMuI2lzRmlsbGVkUGF0aCh7XG4gICAgICAgIHBhdGhMZW5ndGg6IHNoaXBPYmoubGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICBzdGFydFgsXG4gICAgICAgIHN0YXJ0WSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHJlbW92ZSh7IGlkLCBpc1ZlcnRpY2FsLCBsZW5ndGgsIHN0YXJ0WCwgc3RhcnRZIH0pIHtcbiAgICBjb25zdCBbYWN0dWFsU3RhcnRYLCBhY3R1YWxTdGFydFldID0gdGhpcy4jY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3JkcyhcbiAgICAgIHN0YXJ0WCxcbiAgICAgIHN0YXJ0WVxuICAgICk7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRZID0gMDsgY3VycmVudFkgPCBsZW5ndGg7IGN1cnJlbnRZKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxTdGFydFkgLSBjdXJyZW50WV1bYWN0dWFsU3RhcnRYXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGN1cnJlbnRYID0gMDsgY3VycmVudFggPCBsZW5ndGg7IGN1cnJlbnRYKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxTdGFydFldW2FjdHVhbFN0YXJ0WCArIGN1cnJlbnRYXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuI3JlbW92ZVNoaXBGcm9tTGlzdE9mUGxhY2VkU2hpcHMoaWQpO1xuICB9XG5cbiAgcGxhY2UoeyBzaGlwT2JqLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgaWYgKCF0aGlzLmlzUGxhY2VtZW50TGVnYWwoeyBzaGlwT2JqLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2l2ZW4gY29vcmRpbmF0ZXMgYXJlIG91dCBvZiBib3VuZHMgb2YgdGhlIGdhbWVib2FyZFwiKTtcbiAgICB9XG5cbiAgICBbc3RhcnRYLCBzdGFydFldID0gdGhpcy4jY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3JkcyhzdGFydFgsIHN0YXJ0WSk7XG5cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgZm9yIChsZXQgY3VycmVudFkgPSAwOyBjdXJyZW50WSA8IHNoaXBPYmoubGVuZ3RoOyBjdXJyZW50WSsrKSB7XG4gICAgICAgIHRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbc3RhcnRZIC0gY3VycmVudFldW3N0YXJ0WF0gPSBzaGlwT2JqO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WCA9IDA7IGN1cnJlbnRYIDwgc2hpcE9iai5sZW5ndGg7IGN1cnJlbnRYKyspIHtcbiAgICAgICAgdGhpcy5zaGlwc09uQm9hcmRBcnJheVtzdGFydFldW3N0YXJ0WCArIGN1cnJlbnRYXSA9IHNoaXBPYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jYWRkU2hpcFRvTGlzdE9mU2hpcHMoc2hpcE9iaik7XG4gIH1cblxuICBpc1NoaXBQbGFjZWRPbkNvb3JkaW5hdGVzKHgsIHkpIHtcbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHJldHVybiAhIXRoaXMuc2hpcHNPbkJvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKHgsIHkpIHtcbiAgICBpZiAodGhpcy4jYXJlU3RhcnRDb29yZGluYXRlc091dE9mQm91bmRzKHgsIHkpIHx8IHRoaXMuI2lzSGl0KHgsIHkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBjb29yZGluYXRlcyBhcmUgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ2FtZWJvYXJkXCIpO1xuICAgIH1cbiAgICBjb25zdCBbYWN0dWFsWCwgYWN0dWFsWV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKHgsIHkpO1xuICAgIHRoaXMuaGl0Q2VsbHNCb2FyZEFycmF5W2FjdHVhbFldW2FjdHVhbFhdID0gdHJ1ZTtcblxuICAgIGNvbnN0IGhpdFNoaXAgPSB0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFldW2FjdHVhbFhdO1xuICAgIGlmIChoaXRTaGlwKSB7XG4gICAgICBoaXRTaGlwLmhpdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhcmVBbGxTaGlwc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdE9mU2hpcHMuZXZlcnkoKHNoaXBPYmopID0+IHtcbiAgICAgIHJldHVybiBzaGlwT2JqLmlzU3VuaztcbiAgICB9KTtcbiAgfVxuXG4gICNyZW1vdmVTaGlwRnJvbUxpc3RPZlBsYWNlZFNoaXBzKGlkKSB7XG4gICAgdGhpcy5saXN0T2ZTaGlwcyA9IHRoaXMubGlzdE9mU2hpcHMuZmlsdGVyKChzaGlwKSA9PiBzaGlwLmlkICE9IGlkKTtcbiAgfVxuXG4gICNpc0hpdCh4LCB5KSB7XG4gICAgY29uc3QgW2FjdHVhbFgsIGFjdHVhbFldID0gdGhpcy4jY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3Jkcyh4LCB5KTtcbiAgICByZXR1cm4gdGhpcy5oaXRDZWxsc0JvYXJkQXJyYXlbYWN0dWFsWV1bYWN0dWFsWF07XG4gIH1cblxuICAjaXNGaWxsZWRQYXRoKHsgcGF0aExlbmd0aCwgaXNWZXJ0aWNhbCwgc3RhcnRYLCBzdGFydFkgfSkge1xuICAgIGNvbnN0IFthY3R1YWxTdGFydFgsIGFjdHVhbFN0YXJ0WV0gPSB0aGlzLiNjb252ZXJ0Qm9hcmRDb29yZHNUb0FycmF5Q29vcmRzKFxuICAgICAgc3RhcnRYLFxuICAgICAgc3RhcnRZXG4gICAgKTtcblxuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICBmb3IgKGxldCBjdXJyZW50WSA9IDA7IGN1cnJlbnRZIDwgcGF0aExlbmd0aDsgY3VycmVudFkrKykge1xuICAgICAgICBpZiAoISF0aGlzLnNoaXBzT25Cb2FyZEFycmF5W2FjdHVhbFN0YXJ0WSAtIGN1cnJlbnRZXVthY3R1YWxTdGFydFhdKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgY3VycmVudFggPSAwOyBjdXJyZW50WCA8IHBhdGhMZW5ndGg7IGN1cnJlbnRYKyspIHtcbiAgICAgICAgaWYgKCEhdGhpcy5zaGlwc09uQm9hcmRBcnJheVthY3R1YWxTdGFydFldW2FjdHVhbFN0YXJ0WCArIGN1cnJlbnRYXSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgI2FkZFNoaXBUb0xpc3RPZlNoaXBzKHNoaXBPYmopIHtcbiAgICB0aGlzLmxpc3RPZlNoaXBzLnB1c2goc2hpcE9iaik7XG4gIH1cblxuICAjY29udmVydEJvYXJkQ29vcmRzVG9BcnJheUNvb3Jkcyh4LCB5KSB7XG4gICAgcmV0dXJuIFt4IC0gMSwgeSAtIDFdO1xuICB9XG5cbiAgI2FyZVN0YXJ0Q29vcmRpbmF0ZXNPdXRPZkJvdW5kcyh4LCB5KSB7XG4gICAgcmV0dXJuIHggPCAwIHx8IHkgPCAwIHx8IHggPiBCT0FSRF9TSVpFIHx8IHkgPiBCT0FSRF9TSVpFO1xuICB9XG5cbiAgI2FyZUVuZENvb3JkaW5hdGVzT3V0T2ZCb3VuZHMoeyBzaGlwTGVuZ3RoLCBpc1ZlcnRpY2FsLCBzdGFydFgsIHN0YXJ0WSB9KSB7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGNvbnN0IGVuZFkgPSBzdGFydFkgLSBzaGlwTGVuZ3RoO1xuICAgICAgcmV0dXJuIGVuZFkgPCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlbmRYID0gc3RhcnRYICsgc2hpcExlbmd0aCAtIDE7XG4gICAgICByZXR1cm4gZW5kWCA+IEJPQVJEX1NJWkU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBHYW1lYm9hcmQgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgQ29tcHV0ZXJQbGF5ZXIgfSBmcm9tIFwiLi9jb21wdXRlclwiO1xuaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuaW1wb3J0IHsgU2hpcCB9IGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3QgcGxheWVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG5jb25zdCBjb21wdXRlckJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuXG5jb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKHBsYXllckJvYXJkLCBjb21wdXRlckJvYXJkKTtcbmNvbnN0IGNvbXB1dGVyID0gQ29tcHV0ZXJQbGF5ZXIoY29tcHV0ZXJCb2FyZCwgcGxheWVyQm9hcmQpO1xuXG5mdW5jdGlvbiByZW1vdmVTaGlwVUlGcm9tQm9hcmQoc2hpcE9iaikge1xuICBjb25zb2xlLmxvZyhcIlJlbW92YWxcIik7XG4gIHBsYXllckJvYXJkLnJlbW92ZSh7XG4gICAgaWQ6IHNoaXBPYmouaWQsXG4gICAgc1ZlcnRpY2FsOiBzaGlwT2JqLmlzVmVydGljYWwsXG4gICAgbGVuZ3RoOiBzaGlwT2JqLmxlbmd0aCxcbiAgICBzdGFydFg6IHNoaXBPYmouc3RhcnRYLFxuICAgIHN0YXJ0WTogc2hpcE9iai5zdGFydFksXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9lc1NoaXBDcm9zc0FueVNoaXBzKHRpbGVzVW5kZXJTaGlwKSB7XG4gIHJldHVybiB0aWxlc1VuZGVyU2hpcC5zb21lKCh0aWxlVWkpID0+XG4gICAgcGxheWVyQm9hcmQuaXNTaGlwUGxhY2VkT25Db29yZGluYXRlcyh0aWxlVWkueCwgdGlsZVVpLnkpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcFVJT25Cb2FyZChzaGlwT2JqKSB7XG4gIGNvbnN0IGdhbWVwbGF5U2hpcCA9IG5ldyBTaGlwKHNoaXBPYmoubGVuZ3RoLCBzaGlwT2JqLmlkKTtcbiAgcGxheWVyQm9hcmQucGxhY2Uoe1xuICAgIHNoaXBPYmo6IGdhbWVwbGF5U2hpcCxcbiAgICBpc1ZlcnRpY2FsOiBmYWxzZSxcbiAgICBzdGFydFg6IHNoaXBPYmouc3RhcnRYLFxuICAgIHN0YXJ0WTogc2hpcE9iai5zdGFydFksXG4gIH0pO1xuICBjb25zb2xlLmxvZyhwbGF5ZXJCb2FyZCk7XG59XG5cblB1YlN1Yi5vbihcInBsYWNlU2hpcFVJT25Cb2FyZFwiLCBwbGFjZVNoaXBVSU9uQm9hcmQpO1xuUHViU3ViLm9uKFwicmVtb3ZlU2hpcEZyb21Cb2FyZFwiLCByZW1vdmVTaGlwVUlGcm9tQm9hcmQpO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIFBsYXllcihib2FyZCwgZW5lbXlCb2FyZCkge1xuICBjb25zdCB0YWtlVHVybiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgdHJ5IHtcbiAgICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIllvdXIgbW92ZSBpcyBpbGxlZ2FsISBUcnkgaGl0dGluZyBhbm90aGVyIGNlbGwuXCIpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHsgdGFrZVR1cm4gfTtcbn1cbiIsImV4cG9ydCBjbGFzcyBTaGlwIHtcbiAgdGltZXNIaXQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGxlbmd0aCwgaWQpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy50aW1lc0hpdCsrO1xuICB9XG5cbiAgZ2V0IGlzU3VuaygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lc0hpdCA+PSB0aGlzLmxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYLCBQUkVTU0VEX01PVVNFX0JVVFRPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4vUHViU3ViXCI7XG5pbXBvcnQgeyBnZXRUaWxlc1VuZGVyU2hpcCB9IGZyb20gXCIuL3RpbGVVSVwiO1xuaW1wb3J0IHsgZG9lc1NoaXBDcm9zc0FueVNoaXBzIH0gZnJvbSBcIi4vZ2FtZXBsYXkvZ2FtZXBsYXktb2JqZWN0cy1oYW5kbGVyXCI7XG5cbmZ1bmN0aW9uIHJvdGF0ZVNoaXAoKSB7XG4gIGlmICghdGhpcy5pc1JvdGF0ZWQpIHtcbiAgICB0aGlzLnNoaXBFbGVtZW50LnN0eWxlLmhlaWdodCA9IFRJTEVfU0laRV9QWCAqIHRoaXMubGVuZ3RoICsgXCJweFwiO1xuICAgIHRoaXMuc2hpcEVsZW1lbnQuc3R5bGUud2lkdGggPSBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG4gICAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS53aWR0aCA9IFRJTEVfU0laRV9QWCAqIHRoaXMubGVuZ3RoICsgXCJweFwiO1xuICB9XG4gIHRoaXMuc2hpcEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcInJvdGF0ZWRcIik7XG4gIHRoaXMuaXNSb3RhdGVkID0gIXRoaXMuaXNSb3RhdGVkO1xuICBjb25zb2xlLmxvZyh0aGlzLmlzUm90YXRlZCk7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVTaGlwRm9yRHJhZ0FuZERyb3AoZSkge1xuICBjb25zdCByZWN0ID0gdGhpcy5zaGlwRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdGhpcy5vZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gIHRoaXMub2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgdGhpcy5zaGlwRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbn1cblxuZnVuY3Rpb24gc2V0dXBTaGlwRWxlbWVudChzaGlwRWxlbWVudCwgSUQsIGxlbmd0aCwgaXNSb3RhdGVkKSB7XG4gIHNoaXBFbGVtZW50LmlkID0gSUQ7XG4gIHNoaXBFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkb2NrLXNoaXBcIik7XG4gIGlmIChpc1JvdGF0ZWQpIHtcbiAgICBzaGlwRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwicm90YXRlZFwiKTtcbiAgICBzaGlwRWxlbWVudC5zdHlsZS53aWR0aCA9IFRJTEVfU0laRV9QWCArIFwicHhcIjtcbiAgICBzaGlwRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBsZW5ndGggKiBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG4gIH0gZWxzZSB7XG4gICAgc2hpcEVsZW1lbnQuc3R5bGUud2lkdGggPSBsZW5ndGggKiBUSUxFX1NJWkVfUFggKyBcInB4XCI7XG4gICAgc2hpcEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gVElMRV9TSVpFX1BYICsgXCJweFwiO1xuICB9XG4gIHJldHVybiBzaGlwRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gc2V0dXBTaGlwSW1hZ2Uoc2hpcEVsZW1lbnQsIGxlbmd0aCkge1xuICBjb25zdCBzaGlwSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgc2hpcEltYWdlLnN0eWxlLndpZHRoID0gbGVuZ3RoICogVElMRV9TSVpFX1BYICsgXCJweFwiO1xuICBzaGlwSW1hZ2Uuc3R5bGUuaGVpZ2h0ID0gVElMRV9TSVpFX1BYICsgXCJweFwiO1xuICBzaGlwSW1hZ2UuY2xhc3NMaXN0LmFkZChcInNoaXAtaW1hZ2VcIik7XG4gIHNoaXBJbWFnZS5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgc2hpcEltYWdlLnNyYyA9IGBpbWFnZXMvJHtsZW5ndGh9c2hpcC5wbmdgO1xuICBzaGlwRWxlbWVudC5hcHBlbmQoc2hpcEltYWdlKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNoaXBVSSB7XG4gIHN0YXRpYyBtb3ZhYmxlU2hpcCA9IG51bGw7XG4gIHN0YXRpYyBhbGxTaGlwcyA9IFtdO1xuICBzdGF0aWMgdXNlZElEcyA9IFtdO1xuICBzdGF0aWMgSURfTUFYX1NJWkUgPSAyO1xuICBvbkJvYXJkID0gZmFsc2U7XG4gIG9mZnNldFggPSAwO1xuICBvZmZzZXRZID0gMDtcbiAgc3RhcnRYID0gbnVsbDtcbiAgc3RhcnRZID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihzaGlwRWxlbWVudCwgbGVuZ3RoLCBpc1JvdGF0ZWQpIHtcbiAgICBTaGlwVUkuYWxsU2hpcHMucHVzaCh0aGlzKTtcbiAgICBjb25zdCBJRCA9IFNoaXBVSS4jZ2VuZXJhdGVTaGlwSUQoKTtcbiAgICB0aGlzLmlkID0gSUQ7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5pc1JvdGF0ZWQgPSBpc1JvdGF0ZWQ7XG5cbiAgICB0aGlzLnNoaXBFbGVtZW50ID0gc2V0dXBTaGlwRWxlbWVudChzaGlwRWxlbWVudCwgSUQsIGxlbmd0aCwgaXNSb3RhdGVkKTtcbiAgICBzZXR1cFNoaXBJbWFnZSh0aGlzLnNoaXBFbGVtZW50LCBsZW5ndGgpO1xuXG4gICAgc2hpcEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgc3dpdGNoIChlLmJ1dHRvbikge1xuICAgICAgICBjYXNlIFBSRVNTRURfTU9VU0VfQlVUVE9OLkxFRlRfQ0xJQ0s6XG4gICAgICAgICAgU2hpcFVJLm1vdmFibGVTaGlwID0gdGhpcztcbiAgICAgICAgICBwcmVwYXJlU2hpcEZvckRyYWdBbmREcm9wLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBQUkVTU0VEX01PVVNFX0JVVFRPTi5NSURETEVfQ0xJQ0s6XG4gICAgICAgICAgaWYgKHRoaXMubGVuZ3RoID4gMSkgcm90YXRlU2hpcC5jYWxsKHRoaXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljICNnZW5lcmF0ZVNoaXBJRCgpIHtcbiAgICBsZXQgaWQgPSBudWxsO1xuICAgIGRvIHtcbiAgICAgIGlkID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDEwICoqIFNoaXBVSS5JRF9NQVhfU0laRSk7XG4gICAgfSB3aGlsZSAoU2hpcFVJLnVzZWRJRHMuaW5jbHVkZXMoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTaGlwUG9zaXRpb25MZWdhbChTaGlwVUksIHRpbGVzVW5kZXJTaGlwKSB7XG4gIGNvbnN0IGlzU2hpcE92ZXJBbnlUaWxlcyA9IHRpbGVzVW5kZXJTaGlwLmxlbmd0aCA+IDA7XG4gIGNvbnN0IGlzU2hpcE91dE9mQm91bmRzID0gdGlsZXNVbmRlclNoaXAubGVuZ3RoICE9PSBTaGlwVUkubW92YWJsZVNoaXAubGVuZ3RoO1xuICByZXR1cm4gKFxuICAgIGlzU2hpcE92ZXJBbnlUaWxlcyAmJlxuICAgICFkb2VzU2hpcENyb3NzQW55U2hpcHModGlsZXNVbmRlclNoaXApICYmXG4gICAgIWlzU2hpcE91dE9mQm91bmRzXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNldFNoaXBTdGFydENvb3JkaW5hdGVzKHNoaXBVSSwgdGlsZXNVbmRlclNoaXApIHtcbiAgc2hpcFVJLnN0YXJ0WCA9IHRpbGVzVW5kZXJTaGlwWzBdLng7XG4gIHNoaXBVSS5zdGFydFkgPSB0aWxlc1VuZGVyU2hpcFswXS55O1xufVxuXG5mdW5jdGlvbiBzZXRTaGlwT3JpZ2luVG9UaWxlKHNoaXBVSSwgdGlsZVVJKSB7XG4gIGNvbnN0IHRpbGVSZWN0ID0gdGlsZVVJLnRpbGVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBzaGlwVUkub3JpZ2luWCA9IHRpbGVSZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWDtcbiAgc2hpcFVJLm9yaWdpblkgPSB0aWxlUmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWTtcbn1cblxuZnVuY3Rpb24gbW92ZShlLCBzaGlwKSB7XG4gIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUudG9wID0gZS5wYWdlWSAtIHNoaXAub2Zmc2V0WSArIFwicHhcIjtcbiAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gZS5wYWdlWCAtIHNoaXAub2Zmc2V0WCArIFwicHhcIjtcbn1cblxuZnVuY3Rpb24gcmVzZXQoc2hpcCwgaXNTaGlwUG9zaXRpb25MZWdhbCkge1xuICBpZiAoIWlzU2hpcFBvc2l0aW9uTGVnYWwpIHtcbiAgICBzaGlwLnNoaXBFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuICB9IGVsc2Uge1xuICAgIHNoaXAuc2hpcEVsZW1lbnQuc3R5bGUudG9wID0gU2hpcFVJLm1vdmFibGVTaGlwLm9yaWdpblkgKyBcInB4XCI7XG4gICAgc2hpcC5zaGlwRWxlbWVudC5zdHlsZS5sZWZ0ID0gU2hpcFVJLm1vdmFibGVTaGlwLm9yaWdpblggKyBcInB4XCI7XG4gIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xuICBpZiAoU2hpcFVJLm1vdmFibGVTaGlwKSB7XG4gICAgbW92ZShlLCBTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIFB1YlN1Yi5lbWl0KFwic2hpcElzTW92aW5nXCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gIH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoKSA9PiB7XG4gIGlmIChTaGlwVUkubW92YWJsZVNoaXApIHtcbiAgICBQdWJTdWIuZW1pdChcIm5vU2hpcE1vdmVtZW50XCIsIFNoaXBVSS5tb3ZhYmxlU2hpcCk7XG4gICAgY29uc3QgdGlsZXNVbmRlclNoaXAgPSBnZXRUaWxlc1VuZGVyU2hpcChTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIGNvbnN0IG1heUJlUGxhY2VkT25Cb2FyZCA9IGlzU2hpcFBvc2l0aW9uTGVnYWwoU2hpcFVJLCB0aWxlc1VuZGVyU2hpcCk7XG5cbiAgICBpZiAoU2hpcFVJLm1vdmFibGVTaGlwLm9uQm9hcmQpIHtcbiAgICAgIFB1YlN1Yi5lbWl0KFwicmVtb3ZlU2hpcEZyb21Cb2FyZFwiLCBTaGlwVUkubW92YWJsZVNoaXApO1xuICAgICAgU2hpcFVJLm1vdmFibGVTaGlwLm9uQm9hcmQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKG1heUJlUGxhY2VkT25Cb2FyZCkge1xuICAgICAgc2V0U2hpcFN0YXJ0Q29vcmRpbmF0ZXMoU2hpcFVJLm1vdmFibGVTaGlwLCB0aWxlc1VuZGVyU2hpcCk7XG4gICAgICBzZXRTaGlwT3JpZ2luVG9UaWxlKFNoaXBVSS5tb3ZhYmxlU2hpcCwgdGlsZXNVbmRlclNoaXBbMF0pO1xuICAgICAgU2hpcFVJLm1vdmFibGVTaGlwLm9uQm9hcmQgPSB0cnVlO1xuXG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlU2hpcFVJT25Cb2FyZFwiLCBTaGlwVUkubW92YWJsZVNoaXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJTdWNoIHNoaXAgcGxhY2VtZW50IGlzIGlsbGVnYWxcIik7XG4gICAgfVxuXG4gICAgcmVzZXQoU2hpcFVJLm1vdmFibGVTaGlwLCBtYXlCZVBsYWNlZE9uQm9hcmQpO1xuICAgIFNoaXBVSS5tb3ZhYmxlU2hpcCA9IG51bGw7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgTUFYX1ZFUlRJQ0FMLCBNQVhfSE9SSVpPTlRBTCwgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tIFwiLi9QdWJTdWJcIjtcbmltcG9ydCB7IGVuZW15R3JpZCB9IGZyb20gXCIuL3V0aWxpdGllcy9ncmlkLWhhbmRsZXJcIjtcblxuZnVuY3Rpb24gdGlsZUJlbG9uZ3NUb0VuZW15R3JpZCh0aWxlLCBlbmVteUdyaWQpIHtcbiAgcmV0dXJuIHRpbGUucGFyZW50RWxlbWVudCA9PSBlbmVteUdyaWQ7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRDb29yZHMoZWxlbWVudCkge1xuICByZXR1cm4gW1xuICAgIGVsZW1lbnQubGVmdCArIHdpbmRvdy5zY3JvbGxYLFxuICAgIGVsZW1lbnQudG9wICsgd2luZG93LnNjcm9sbFksXG4gICAgZWxlbWVudC5yaWdodCArIHdpbmRvdy5zY3JvbGxYLFxuICAgIGVsZW1lbnQuYm90dG9tICsgd2luZG93LnNjcm9sbFksXG4gIF07XG59XG5cbmZ1bmN0aW9uIGdldERpZmZlcmVuY2VzSW5Db29yZHNCZXR3ZWVuVGlsZUFuZFNoaXAodGlsZVJlY3QsIHNoaXBSZWN0KSB7XG4gIGNvbnN0IFt0aWxlTGVmdCwgdGlsZVRvcCwgdGlsZVJpZ2h0LCB0aWxlQm90dG9tXSA9IGdldEVsZW1lbnRDb29yZHModGlsZVJlY3QpO1xuICBjb25zdCBbc2hpcExlZnQsIHNoaXBUb3AsIHNoaXBSaWdodCwgc2hpcEJvdHRvbV0gPSBnZXRFbGVtZW50Q29vcmRzKHNoaXBSZWN0KTtcbiAgcmV0dXJuIFtcbiAgICBzaGlwTGVmdCAtIHRpbGVMZWZ0LFxuICAgIHNoaXBUb3AgLSB0aWxlVG9wLFxuICAgIHRpbGVSaWdodCAtIHNoaXBSaWdodCxcbiAgICB0aWxlQm90dG9tIC0gc2hpcEJvdHRvbSxcbiAgXTtcbn1cblxuZnVuY3Rpb24gaXNTaGlwSW5zaWRlQnlIb3Jpem9udGFsKGRpZmZlcmVuY2VMZWZ0LCBkaWZmZXJlbmNlUmlnaHQpIHtcbiAgcmV0dXJuIChcbiAgICAoZGlmZmVyZW5jZUxlZnQgPCBNQVhfSE9SSVpPTlRBTCAmJiBkaWZmZXJlbmNlUmlnaHQgPD0gMCkgfHxcbiAgICAoZGlmZmVyZW5jZVJpZ2h0IDwgTUFYX0hPUklaT05UQUwgJiYgZGlmZmVyZW5jZUxlZnQgPD0gMClcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNTaGlwSW5zaWRlQnlWZXJ0aWNhbChkaWZmZXJlbmNlVG9wLCBkaWZmZXJlbmNlQm90dG9tKSB7XG4gIHJldHVybiAoXG4gICAgKGRpZmZlcmVuY2VUb3AgPCBNQVhfVkVSVElDQUwgJiYgZGlmZmVyZW5jZUJvdHRvbSA8PSAwKSB8fFxuICAgIChkaWZmZXJlbmNlQm90dG9tIDwgTUFYX1ZFUlRJQ0FMICYmIGRpZmZlcmVuY2VUb3AgPD0gMClcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNTaGlwT3ZlclRpbGUodGlsZSwgc2hpcCkge1xuICBpZiAodGlsZUJlbG9uZ3NUb0VuZW15R3JpZCh0aWxlLCBlbmVteUdyaWQpKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHNoaXBSZWN0ID0gc2hpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgdGlsZVJlY3QgPSB0aWxlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGNvbnN0IFtkaWZmZXJlbmNlTGVmdCwgZGlmZmVyZW5jZVRvcCwgZGlmZmVyZW5jZVJpZ2h0LCBkaWZmZXJlbmNlQm90dG9tXSA9XG4gICAgZ2V0RGlmZmVyZW5jZXNJbkNvb3Jkc0JldHdlZW5UaWxlQW5kU2hpcCh0aWxlUmVjdCwgc2hpcFJlY3QpO1xuXG4gIHJldHVybiAoXG4gICAgaXNTaGlwSW5zaWRlQnlIb3Jpem9udGFsKGRpZmZlcmVuY2VMZWZ0LCBkaWZmZXJlbmNlUmlnaHQpICYmXG4gICAgaXNTaGlwSW5zaWRlQnlWZXJ0aWNhbChkaWZmZXJlbmNlVG9wLCBkaWZmZXJlbmNlQm90dG9tKVxuICApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGVzVW5kZXJTaGlwKHNoaXBVSSkge1xuICByZXR1cm4gVGlsZVVJLmFsbFRpbGVzLmZpbHRlcigodGlsZVVJKSA9PlxuICAgIGlzU2hpcE92ZXJUaWxlKHRpbGVVSS50aWxlRWxlbWVudCwgc2hpcFVJLnNoaXBFbGVtZW50KVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgVGlsZVVJIHtcbiAgc3RhdGljIGFsbFRpbGVzID0gW107XG4gIGNvbnN0cnVjdG9yKHRpbGVFbGVtZW50LCB4LCB5KSB7XG4gICAgVGlsZVVJLmFsbFRpbGVzLnB1c2godGhpcyk7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMudGlsZUVsZW1lbnQgPSB0aWxlRWxlbWVudDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0aWxlXCIpO1xuICAgIHRoaXMudGlsZUVsZW1lbnQuZGF0YXNldC54ID0geDtcbiAgICB0aGlzLnRpbGVFbGVtZW50LmRhdGFzZXQueSA9IHk7XG4gICAgdGhpcy50aWxlRWxlbWVudC53aWR0aCA9IFRJTEVfU0laRV9QWCArIFwicHhcIjtcblxuICAgIFB1YlN1Yi5vbihcInNoaXBJc01vdmluZ1wiLCAoc2hpcCkgPT4ge1xuICAgICAgaWYgKGlzU2hpcE92ZXJUaWxlKHRoaXMudGlsZUVsZW1lbnQsIHNoaXAuc2hpcEVsZW1lbnQpKSB7XG4gICAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhvdmVyZWRXaXRoU2hpcFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGlsZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyZWRXaXRoU2hpcFwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBQdWJTdWIub24oXCJub1NoaXBNb3ZlbWVudFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnRpbGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlcmVkV2l0aFNoaXBcIik7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcbmltcG9ydCB7IFNoaXBVSSB9IGZyb20gXCIuLi9zaGlwVUlcIjtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcFVJKGxlbmd0aCwgcm90YXRlZCkge1xuICBjb25zdCBzaGlwID0gbmV3IFNoaXBVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCBsZW5ndGgsIHJvdGF0ZWQpO1xuICByZXR1cm4gc2hpcC5zaGlwRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gcHVzaFNoaXBUb0RvY2soc2hpcEVsZW1lbnQpIHtcbiAgZG9jay5hcHBlbmRDaGlsZChzaGlwRWxlbWVudCk7XG59XG5cbmNvbnN0IGRvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRvY2tcIik7XG5cblB1YlN1Yi5vbihcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIsICgpID0+IHtcbiAgZG9jay5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG5cbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDQsIGZhbHNlKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgzLCBmYWxzZSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMywgZmFsc2UpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDIsIGZhbHNlKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgyLCBmYWxzZSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMiwgZmFsc2UpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDEsIGZhbHNlKSk7XG4gIHB1c2hTaGlwVG9Eb2NrKGNyZWF0ZVNoaXBVSSgxLCBmYWxzZSkpO1xuICBwdXNoU2hpcFRvRG9jayhjcmVhdGVTaGlwVUkoMSwgZmFsc2UpKTtcbiAgcHVzaFNoaXBUb0RvY2soY3JlYXRlU2hpcFVJKDEsIGZhbHNlKSk7XG59KTtcblxuUHViU3ViLm9uKFwiY2hlY2tJZkFsbFNoaXBzV2VyZVBsYWNlZFwiLCAoKSA9PiB7XG4gIGlmIChkb2NrLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICBhbGVydChcIkRvY2sgaXMgbm90IGVtcHR5IVwiKTtcbiAgfSBlbHNlIHtcbiAgICBkb2NrLnN0eWxlLmRpc3BsYXkgPSBcIk5vbmVcIjtcbiAgICBQdWJTdWIuZW1pdChcImdhbWVTdGFydHNcIik7XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgUHViU3ViIH0gZnJvbSBcIi4uL1B1YlN1YlwiO1xuXG5jb25zdCBNQUlOX0FDVElPTl9CVVRUT05fTkFNRVMgPSB7XG4gIHNoaXBQbGFjZW1lbnRBZnRlckNsaWNrOiBcIlN0YXJ0IHBsYWNpbmcgc2hpcHNcIixcbiAgZ2FtZXBsYXlBZnRlckNsaWNrOiBcIlN0YXJ0IGdhbWVcIixcbn07XG5jb25zdCBtYWluQWN0aW9uQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWFjdGlvbi1idXR0b25cIik7XG5tYWluQWN0aW9uQnV0dG9uLnRleHRDb250ZW50ID0gTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLnNoaXBQbGFjZW1lbnRBZnRlckNsaWNrO1xuXG5tYWluQWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIHN3aXRjaCAobWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCkge1xuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLmdhbWVwbGF5QWZ0ZXJDbGljazoge1xuICAgICAgUHViU3ViLmVtaXQoXCJjaGVja0lmQWxsU2hpcHNXZXJlUGxhY2VkXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgTUFJTl9BQ1RJT05fQlVUVE9OX05BTUVTLnNoaXBQbGFjZW1lbnRBZnRlckNsaWNrOiB7XG4gICAgICBQdWJTdWIuZW1pdChcInBsYWNlbWVudE9mU2hpcHNIYXNTdGFydGVkXCIpO1xuICAgICAgbWFpbkFjdGlvbkJ1dHRvbi50ZXh0Q29udGVudCA9XG4gICAgICAgIE1BSU5fQUNUSU9OX0JVVFRPTl9OQU1FUy5nYW1lcGxheUFmdGVyQ2xpY2s7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgVElMRV9TSVpFX1BYIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGlsZVVJIH0gZnJvbSBcIi4uL3RpbGVVSVwiO1xuaW1wb3J0IHsgQk9BUkRfU0laRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCIuLi9QdWJTdWJcIjtcblxuZXhwb3J0IGNvbnN0IFtlbmVteUdyaWQsIHBsYXllckdyaWRdID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdyaWRcIik7XG5maWxsR3JpZFdpdGhDZWxscyhlbmVteUdyaWQpO1xuZmlsbEdyaWRXaXRoQ2VsbHMocGxheWVyR3JpZCk7XG5zZXRHcmlkVGlsZVNpemUoZW5lbXlHcmlkKTtcbnNldEdyaWRUaWxlU2l6ZShwbGF5ZXJHcmlkKTtcblxuZnVuY3Rpb24gZmlsbEdyaWRXaXRoQ2VsbHMoZ3JpZCkge1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1NJWkU7IHkrKykge1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQk9BUkRfU0laRTsgeCsrKSB7XG4gICAgICBjb25zdCB0aWxlID0gbmV3IFRpbGVVSShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLCB4ICsgMSwgeSArIDEpO1xuICAgICAgZ3JpZC5hcHBlbmRDaGlsZCh0aWxlLnRpbGVFbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0R3JpZFRpbGVTaXplKGdyaWQpIHtcbiAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0JPQVJEX1NJWkV9LCAke1xuICAgIFRJTEVfU0laRV9QWCArIFwicHhcIlxuICB9KWA7XG4gIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtCT0FSRF9TSVpFfSwgJHtUSUxFX1NJWkVfUFggKyBcInB4XCJ9KWA7XG59XG5cbmZ1bmN0aW9uIGdyZXlPdXRFbmVteUdyaWQoKSB7XG4gIGVuZW15R3JpZC5jbGFzc0xpc3QuYWRkKFwiZ3JleWVkLW91dFwiKTtcbn1cblxuUHViU3ViLm9uKFwiZmlsbEdyaWRXaXRoQ2VsbHNcIiwgZmlsbEdyaWRXaXRoQ2VsbHMpO1xuUHViU3ViLm9uKFwic2V0R3JpZFRpbGVTaXplXCIsIHNldEdyaWRUaWxlU2l6ZSk7XG5QdWJTdWIub24oXCJwbGFjZW1lbnRPZlNoaXBzSGFzU3RhcnRlZFwiLCBncmV5T3V0RW5lbXlHcmlkKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi91dGlsaXRpZXMvZ3JpZC1oYW5kbGVyXCI7XG5pbXBvcnQgXCIuL3NoaXBVSVwiO1xuaW1wb3J0IFwiLi90aWxlVUlcIjtcbmltcG9ydCBcIi4vdXRpbGl0aWVzL2RvY2staGFuZGxlclwiO1xuaW1wb3J0IFwiLi91dGlsaXRpZXMvZ2FtZS1idXR0b24taGFuZGxlclwiO1xuaW1wb3J0IFwiLi9nYW1lcGxheS9nYW1lcGxheS1vYmplY3RzLWhhbmRsZXJcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
