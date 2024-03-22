import { PubSub } from "../PubSub";
import { ShipUI } from "../shipUI";

function createShipUI(length, rotated) {
  const ship = new ShipUI(document.createElement("div"), length, rotated);
  return ship.shipElement;
}

function pushShipToDock(shipElement) {
  dock.appendChild(shipElement);
}

const dock = document.querySelector(".dock");

PubSub.on("placementOfShipsHasStarted", () => {
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
});

PubSub.on("checkIfAllShipsWerePlaced", () => {
  if (dock.children.length > 0) {
    alert("Dock is not empty!");
  } else {
    dock.style.display = "None";
    PubSub.emit("gameStarts");
  }
});
