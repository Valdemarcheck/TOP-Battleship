import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { ComputerPlayer } from "./computer";

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

const player = new Player(playerBoard, computerBoard);
const computer = ComputerPlayer(computerBoard, playerBoard);
