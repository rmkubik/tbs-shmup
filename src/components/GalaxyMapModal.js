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
import { useState } from "preact/hooks";

const getLetterComponentFromLocation = (location) =>
  String.fromCharCode(location.col + 97).toUpperCase();

const isNeighborUnlocked = ({ zonesMatrix, unlocked, location }) => {
  const neighbors = getNeighbors(getCrossDirections, zonesMatrix, location);

  return neighbors.some((neighbor) => {
    const letterCoordinates = convertLocationToLetterCoordinates(neighbor);

    return Boolean(unlocked[letterCoordinates]?.unlocked);
  });
};

const getZoneName = ({ zonesMatrix, unlocked, location }) => {
  if (!location) {
    // No location is selected
    return;
  }

  const letterCoordinates = convertLocationToLetterCoordinates(location);

  if (unlocked[letterCoordinates]) {
    // Show name of Zone if it's unlocked
    return getLocation(zonesMatrix, location).name;
  }

  if (isNeighborUnlocked({ zonesMatrix, unlocked, location })) {
    return `Unlock ${getLocation(zonesMatrix, location).unlock?.cost}`;
  }

  return "???";
};

const GalaxyMapModal = ({
  unlocked,
  zonesMatrix,
  onResume,
  onSectorSelect,
}) => {
  const [hoveredZone, setHoveredZone] = useState(undefined);
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
                    onMouseEnter={() => setHoveredZone(location)}
                    onMouseLeave={() => setHoveredZone(undefined)}
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
                  <div
                    style={{ width: "fit-content", position: "relative" }}
                    onMouseEnter={() => setHoveredZone(location)}
                    onMouseLeave={() => setHoveredZone(undefined)}
                  >
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
                        {getLocation(zonesMatrix, location).unlock?.cost}
                      </span>
                    }
                    <Sprite src={lockIcon} color="white" />
                  </div>
                );
              }

              return (
                <div
                  style={{
                    height: "16px",
                    width: "16px",
                    position: "relative",
                  }}
                  onMouseEnter={() => setHoveredZone(location)}
                  onMouseLeave={() => setHoveredZone(undefined)}
                >
                  .
                </div>
              );
            }}
          />
        </div>
      </div>
      <p>
        Sector: {getZoneName({ zonesMatrix, unlocked, location: hoveredZone })}
      </p>
      <div className="button-container">
        <Button onClick={onResume}>Resume</Button>
      </div>
    </Modal>
  );
};

export default GalaxyMapModal;
