import { PubSub } from "../PubSub";
import { ShipUI } from "../shipUI";
import { SHIP_UI_ELEMENTS } from "../constants";

function createShipUI(length) {
  const ship = new ShipUI(document.createElement("div"), length);
  SHIP_UI_ELEMENTS.push(ship);
  return ship.shipElement;
}

function pushShipToDock(shipElement) {
  dock.appendChild(shipElement);
}

const dock = document.querySelector(".dock");

PubSub.on("placementOfShipsHasStarted", () => {
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
});

PubSub.on("checkIfAllShipsWerePlaced", () => {
  if (dock.children.length > 0) {
    alert("Dock is not empty!");
  } else {
    dock.style.display = "None";
    PubSub.emit("gameStarts");
  }
});
