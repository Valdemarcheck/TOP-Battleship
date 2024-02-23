export function Player(board, enemyBoard) {
  const takeTurn = function (x, y) {
    try {
      enemyBoard.receiveAttack(x, y);
    } catch (e) {
      console.log("Your move is illegal! Try hitting another cell.");
    }
  };
  return { takeTurn };
}
