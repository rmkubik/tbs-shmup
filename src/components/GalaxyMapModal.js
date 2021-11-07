import { Fragment, h } from "preact";
import {
  compareLocations,
  getNeighbors,
  getCrossDirections,
  constructMatrix,
  getDimensions,
  getLocation,
} from "functional-game-utils";
import Modal from "./Modal";
import convertLetterCoordinatesToLocation from "../utils/convertLetterCoordinatesToLocation";
import convertLocationToLetterCoordinates from "../utils/convertLocationToLetterCoordinates";
import Button from "./Button";
import Grid2D from "./Grid2D";
import Sprite from "./Sprite";
import lockIcon from "../../assets/lock.png";
import useTheme from "../hooks/useTheme";

const getLetterComponentFromLocation = (location) =>
  String.fromCharCode(location.col + 97).toUpperCase();

const GalaxyMapModal = ({
  unlocked,
  zonesMatrix,
  onResume,
  onSectorSelect,
}) => {
  const { width, height } = getDimensions(zonesMatrix);
  const unlockedEntries = Object.entries(unlocked);
  const { theme } = useTheme();

  return (
    <Modal>
      <div className="header">
        <p className="gameover">GALAXY MAP</p>
      </div>
      <div className="center">
        <div className="galaxy-map">
          <Grid2D
            className="top"
            tiles={constructMatrix(
              (location) => getLetterComponentFromLocation(location),
              {
                width,
                height: 1,
              }
            )}
            renderTile={(tile) => <div>{tile}</div>}
          />
          <Grid2D
            className="left"
            tiles={constructMatrix((location) => location.row + 1, {
              width: 1,
              height,
            })}
            renderTile={(tile) => <div>{tile}</div>}
          />
          <Grid2D
            className="grid"
            tiles={zonesMatrix}
            renderTile={(tile, location) => {
              if (
                unlockedEntries.some(([letterCoordinates]) => {
                  const otherLocation =
                    convertLetterCoordinatesToLocation(letterCoordinates);

                  return compareLocations(location, otherLocation);
                })
              ) {
                // If we're unlocked, show our icon
                return (
                  <div
                    onClick={() => {
                      const letterCoordinates =
                        convertLocationToLetterCoordinates(location);

                      onSectorSelect(letterCoordinates);
                    }}
                  >
                    <Sprite
                      src={getLocation(zonesMatrix, location).ship.icon}
                      color="white"
                    />
                  </div>
                );
              }

              const neighbors = getNeighbors(
                getCrossDirections,
                zonesMatrix,
                location
              );

              if (
                neighbors.some((neighbor) => {
                  const letterCoordinates =
                    convertLocationToLetterCoordinates(neighbor);

                  return Boolean(unlocked[letterCoordinates]?.unlocked);
                })
              ) {
                // If we neighbor an unlocked zone, show a lock with our unlock cost
                return (
                  <div style={{ width: "fit-content", position: "relative" }}>
                    {
                      <span
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          fontSize: "8px",
                          width: "100%",
                          color: theme.backgroundColor,
                          fontWeight: "bolder",
                        }}
                      >
                        {3}
                      </span>
                    }
                    <Sprite src={lockIcon} color="white" />
                  </div>
                );
              }

              return <div>❓</div>;
            }}
          />
        </div>
      </div>
      <div className="button-container">
        <Button onClick={onResume}>Resume</Button>
      </div>
    </Modal>
  );
};

export default GalaxyMapModal;
