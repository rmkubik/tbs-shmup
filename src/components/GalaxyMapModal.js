import { h } from "preact";
import {
  compareLocations,
  getNeighbors,
  getCrossDirections,
} from "functional-game-utils";
import Modal from "./Modal";
import convertLetterCoordinatesToLocation from "../utils/convertLetterCoordinatesToLocation";
import convertLocationToLetterCoordinates from "../utils/convertLocationToLetterCoordinates";
import Button from "./Button";
import Grid2D from "./Grid2D";

const GalaxyMapModal = ({ unlocked, zones, onResume }) => {
  const unlockedEntries = Object.entries(unlocked);

  return (
    <Modal>
      <div className="header">
        <p className="gameover">GALAXY MAP</p>
      </div>
      <Grid2D
        tiles={zones}
        renderTile={(tile, location) => {
          if (
            unlockedEntries.some(([letterCoordinates]) => {
              const otherLocation =
                convertLetterCoordinatesToLocation(letterCoordinates);

              return compareLocations(location, otherLocation);
            })
          ) {
            // If we're unlocked, show our icon
            return <div>▶️</div>;
          }

          const neighbors = getNeighbors(getCrossDirections, zones, location);

          if (
            neighbors.some((neighbor) => {
              const letterCoordinates =
                convertLocationToLetterCoordinates(neighbor);

              return Boolean(unlocked[letterCoordinates]?.unlocked);
            })
          ) {
            // If we neighbor an unlocked zone, show a lock with our unlock cost
            return <div>🔒</div>;
          }

          return <div>❓</div>;
        }}
      />
      <div className="button-container">
        <Button onClick={onResume}>Resume</Button>
      </div>
    </Modal>
  );
};

export default GalaxyMapModal;
