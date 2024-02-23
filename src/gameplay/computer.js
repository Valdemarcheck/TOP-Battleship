import { BOARD_SIZE } from "../constants";

export function ComputerPlayer(computerBoard, enemyBoard) {
  const unusedCoordinatesObj = (() => {
    const unusedCoordinatesObj = {};
    const yCoordinatesInOneColumn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = 1; i <= BOARD_SIZE; i++) {
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
