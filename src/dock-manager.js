import { PubSub } from "./PubSub";

function createShipDiv(length) {
  const shipDiv = document.createElement("div");
  shipDiv.classList.add("dock-ship");
  shipDiv.classList.add("length-" + length);
  return shipDiv;
}

function pushShipDivToDock(shipDiv) {
  dock.appendChild(shipDiv);
}

const dock = document.querySelector(".dock");

PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipDivToDock(createShipDiv(4));
  pushShipDivToDock(createShipDiv(3));
  pushShipDivToDock(createShipDiv(3));
  pushShipDivToDock(createShipDiv(2));
  pushShipDivToDock(createShipDiv(2));
  pushShipDivToDock(createShipDiv(2));
  pushShipDivToDock(createShipDiv(1));
  pushShipDivToDock(createShipDiv(1));
  pushShipDivToDock(createShipDiv(1));
  pushShipDivToDock(createShipDiv(1));
});
