import { PubSub } from "../PubSub";
import { CANNOT_ROTATE_SHIP_HINT_DURATIONS_MS } from "../constants";

let generalTextHintTimeout = null;
const middleMouseHint = document.querySelector(".middle-mouse-hint");
const generalTextHint = document.querySelector(".general-text-hint");

PubSub.on("placementOfShipsHasStarted", () => {
  middleMouseHint.classList.remove("hidden");
});

PubSub.on("tellPlayerShipWillCoverAnotherOneIfRotated", ({ shipUI, e }) => {
  clearTimeout(generalTextHintTimeout);
  generalTextHint.classList.remove("hidden");
  generalTextHint.textContent =
    "You can't rotate ship here, it will cover another ship";

  const hintRect = generalTextHint.getBoundingClientRect();
  const shipRect = shipUI.shipElement.getBoundingClientRect();
  generalTextHint.style.top = e.clientY - 2 * shipRect.height + "px";
  generalTextHint.style.left = e.clientX - hintRect.width / 2 + "px";
  generalTextHintTimeout = setTimeout(() => {
    generalTextHint.classList.add("hidden");
  }, CANNOT_ROTATE_SHIP_HINT_DURATIONS_MS * 2.5);
});
