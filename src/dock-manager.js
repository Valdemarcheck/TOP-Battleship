import { PubSub } from "./PubSub";

function createShipImg(length) {
  const shipImg = document.createElement("img");
  shipImg.src = `./images/${length}ship.png`;
  shipImg.classList.add("dock-ship");
  shipImg.classList.add("length-" + length);
  return shipImg;
}

function pushShipImgToDock(shipImg) {
  dock.appendChild(shipImg);
}

const dock = document.querySelector(".dock");

PubSub.on("placementOfShipsHasStarted", () => {
  dock.style.display = "flex";

  pushShipImgToDock(createShipImg(4));
  pushShipImgToDock(createShipImg(3));
  pushShipImgToDock(createShipImg(3));
  pushShipImgToDock(createShipImg(2));
  pushShipImgToDock(createShipImg(2));
  pushShipImgToDock(createShipImg(2));
  pushShipImgToDock(createShipImg(1));
  pushShipImgToDock(createShipImg(1));
  pushShipImgToDock(createShipImg(1));
  pushShipImgToDock(createShipImg(1));
});
