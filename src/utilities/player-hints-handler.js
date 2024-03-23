import { PubSub } from "../PubSub";

const middleMouseHint = document.querySelector(".middle-mouse-hint");

PubSub.on("placementOfShipsHasStarted", () => {
  middleMouseHint.classList.remove("hidden");
});
