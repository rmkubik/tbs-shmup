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

const getZoneDescription = ({ zonesMatrix, unlocked, location }) => {
  if (!location) {
    // No location is selected
    return;
  }

  const letterCoordinates = convertLocationToLetterCoordinates(location);

  if (unlocked[letterCoordinates]) {
    // Get description of the Zone's mission if unlocked
    return getLocation(zonesMatrix, location).mission?.description;
  }

  if (isNeighborUnlocked({ zonesMatrix, unlocked, location })) {
    return "???";
  }

  return;
};

const ZoneDescription = ({ zonesMatrix, unlocked, location }) => {
  /** Use a br to keep the space filled if there's no Zone selected. */
  return (
    <Fragment>
      <p>{getZoneName({ zonesMatrix, unlocked, location }) ?? <br />}</p>
      <p>{getZoneDescription({ zonesMatrix, unlocked, location }) ?? <br />}</p>
    </Fragment>
  );
};

const GalaxyMapModal = ({
  unlocked,
  zonesMatrix,
  onResume,
  onSectorSelect,
}) => {
  const [hovered, setHovered] = useState(undefined);
  const [selected, setSelected] = useState(undefined);
  const { width, height } = getDimensions(zonesMatrix);
  const unlockedEntries = Object.entries(unlocked);
  const { theme } = useTheme();

  // TODO:
  // We should add a selected zone instead of a hovered zone
  // Instead of displaying hovered zone data, display
  // selected zone data.
  // On hover over a zone, we could display a tool tip with it's
  // name if we wanted. Maybe a different "shortname/tooltip" prop?
  // On hover we should add a little selector indicator (dashed border)
  // around the zone we'll select upon clicking.
  // locks should shake on click

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
              const isLocationSelected = selected
                ? compareLocations(location, selected)
                : false;
              let zoneContents = ".";

              if (
                unlockedEntries.some(([letterCoordinates]) => {
                  const otherLocation =
                    convertLetterCoordinatesToLocation(letterCoordinates);

                  return compareLocations(location, otherLocation);
                })
              ) {
                // If we're unlocked, show our icon
                zoneContents = (
                  <Sprite
                    src={getLocation(zonesMatrix, location).ship.icon}
                    color="white"
                  />
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
                zoneContents = (
                  <Fragment>
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

                    <Sprite src={lockIcon} color="white" />
                  </Fragment>
                );
              }

              return (
                <div
                  style={{
                    height: "16px",
                    width: "16px",
                    position: "relative",
                    border: isLocationSelected
                      ? `1px dashed ${theme.primaryColor}`
                      : "",
                  }}
                  onClick={() => {
                    setSelected(location);
                  }}
                  onMouseEnter={() => setHovered(location)}
                  onMouseLeave={() => setHovered(undefined)}
                >
                  {zoneContents}
                </div>
              );
            }}
          />
        </div>
      </div>
      <ZoneDescription
        location={selected}
        zonesMatrix={zonesMatrix}
        unlocked={unlocked}
      />
      <div className="button-container">
        <Button
          onClick={() => {
            const letterCoordinates =
              convertLocationToLetterCoordinates(selected);
            onSectorSelect(letterCoordinates);
          }}
        >
          Start
        </Button>
        <Button onClick={onResume}>Back</Button>
      </div>
    </Modal>
  );
};

export default GalaxyMapModal;
