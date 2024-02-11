import { PubSub } from "./PubSub";
import { ShipUI } from "./shipUI";
const SHIPS = [];

function createShip(length) {
  const ship = new ShipUI(document.createElement("div"), length);
  SHIPS.push(ship);
  return ship.shipElement;
}

function pushShipToDock(shipElement) {
  dock.appendChild(shipElement);
}

const dock = document.querySelector(".dock");

PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipToDock(createShip(4));
  pushShipToDock(createShip(3));
  pushShipToDock(createShip(3));
  pushShipToDock(createShip(2));
  pushShipToDock(createShip(2));
  pushShipToDock(createShip(2));
  pushShipToDock(createShip(1));
  pushShipToDock(createShip(1));
  pushShipToDock(createShip(1));
  pushShipToDock(createShip(1));
});

PubSub.on("checkIfAllShipsWerePlaced", () => {
  if (dock.children.length > 0) {
    alert("Dock is not empty!");
  } else {
    dock.style.display = "None";
    PubSub.emit("gameStarts");
  }
});
