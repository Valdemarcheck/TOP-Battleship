import { PubSub } from "./PubSub";

const LENGTHS_AND_COUNTS_OF_SHIPS = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
};

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

  for (let [length, amount] of Object.entries(LENGTHS_AND_COUNTS_OF_SHIPS)) {
    for (let i = 0; i < amount; i++) {
      pushShipImgToDock(createShipImg(length));
    }
  }
});

PubSub.on("checkIfAllShipsWerePlaced", () => {
  if (dock.children.length > 0) {
    alert("Dock is not empty!");
  } else {
    dock.style.display = "None";
    PubSub.emit("gameStarts");
  }
});
