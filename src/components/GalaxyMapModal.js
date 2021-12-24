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

const isSomeNeighbor = ({ zonesMatrix, location }, comparisonFn) => {
  const neighbors = getNeighbors(getCrossDirections, zonesMatrix, location);

  return neighbors.some((neighborLocation) => {
    const neighbor = getLocation(zonesMatrix, neighborLocation);

    return comparisonFn(neighbor, neighborLocation);
  });
};

const isZoneUnlocked = ({ zonesMatrix, location, unlocked }) => {
  const zone = getLocation(zonesMatrix, location);

  return (
    zone.unlock?.cost === 0 ||
    isSomeNeighbor({ zonesMatrix, location }, (neighbor, neighborLocation) => {
      const neighborCoordinates =
        convertLocationToLetterCoordinates(neighborLocation);

      if (!unlocked[neighborCoordinates]) {
        return false;
      }

      return (
        unlocked[neighborCoordinates].highScore >= zone.unlock?.cost ?? Infinity
      );
    })
  );
};

const isZoneHidden = ({ zonesMatrix, location }) => {
  const zone = getLocation(zonesMatrix, location);

  return zone.hidden;
};

const isZoneLaunchable = ({ zonesMatrix, location, unlocked }) => {
  return (
    isZoneUnlocked({ zonesMatrix, location, unlocked }) &&
    !isZoneHidden({ zonesMatrix, location })
  );
};

const isNeighborUnlocked = ({ zonesMatrix, unlocked, location }) => {
  const neighbors = getNeighbors(getCrossDirections, zonesMatrix, location);

  return neighbors.some((neighbor) => {
    return isZoneUnlocked({ zonesMatrix, location: neighbor, unlocked });
  });
};

const getZoneName = ({ zonesMatrix, unlocked, location }) => {
  if (!location) {
    // No location is selected
    return;
  }

  if (isZoneHidden({ zonesMatrix, location })) {
    return;
  }

  if (isZoneUnlocked({ zonesMatrix, unlocked, location })) {
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

  if (isZoneHidden({ zonesMatrix, location })) {
    return;
  }

  if (isZoneUnlocked({ zonesMatrix, unlocked, location })) {
    // Get description of the Zone's mission if unlocked
    return getLocation(zonesMatrix, location).mission?.description;
  }

  if (isNeighborUnlocked({ zonesMatrix, unlocked, location })) {
    return "???";
  }

  return;
};

const getZoneContents = ({ zonesMatrix, location, unlocked, theme }) => {
  if (isZoneHidden({ zonesMatrix, location })) {
    return null;
  }

  if (isZoneUnlocked({ zonesMatrix, location, unlocked })) {
    // If we're unlocked, show our icon.
    const zone = getLocation(zonesMatrix, location);

    return (
      <Sprite
        src={zone.icon?.src ?? zone.mission.ship.icon}
        color={zone.icon?.color ?? zone.mission.ship.color}
      />
    );
  }

  const neighbors = getNeighbors(getCrossDirections, zonesMatrix, location);

  if (
    neighbors.some((neighbor) => {
      // const getTile
      return isZoneUnlocked({ zonesMatrix, location: neighbor, unlocked });
    })
  ) {
    // If we neighbor an unlocked zone, show a lock with our unlock cost
    return (
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

        <Sprite src={lockIcon} color={theme["primaryColor"]} />
      </Fragment>
    );
  }

  return ".";
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
  // On hover over a zone, we could display a tool tip with it's
  // name if we wanted. Maybe a different "shortname/tooltip" prop?
  //
  // On hover we should add a little selector indicator (dashed border)
  // around the zone we'll select upon clicking.
  //
  // locks should shake on click

  const isSelectedZoneLaunchable =
    selected &&
    isZoneLaunchable({
      zonesMatrix,
      location: selected,
      unlocked,
    });

  return (
    <Modal containerStyles={{ width: "7vw" }}>
      <div className="header">
        <p className="gameover">GALAXY MAP</p>
      </div>
      <div className="center">
        <div className="galaxy-map">
          <Grid2D
            tileSize={18}
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
            tileSize={18}
            className="left"
            tiles={constructMatrix((location) => location.row + 1, {
              width: 1,
              height,
            })}
            renderTile={(tile) => <div>{tile}</div>}
          />
          <Grid2D
            tileSize={18}
            className="grid"
            tiles={zonesMatrix}
            renderTile={(tile, location) => {
              let zoneContents = getZoneContents({
                zonesMatrix,
                location,
                unlocked,
                theme,
              });

              const getBorder = () => {
                const isLocationSelected = selected
                  ? compareLocations(location, selected)
                  : false;
                const isLocationHovered = hovered
                  ? compareLocations(location, hovered)
                  : false;

                if (isLocationSelected) {
                  return `1px solid ${theme.primaryColor}`;
                }

                if (isLocationHovered) {
                  return `1px dashed ${theme.primaryColor}`;
                }

                return "1px solid transparent";
              };

              return (
                <div
                  style={{
                    height: "18px",
                    width: "18px",
                    // padding: "2px",
                    position: "relative",
                    border: getBorder(),
                    boxSizing: "border-box",
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
            if (!isSelectedZoneLaunchable) {
              return;
            }

            const letterCoordinates =
              convertLocationToLetterCoordinates(selected);

            onSectorSelect(letterCoordinates, "mission");
          }}
          disabled={!isSelectedZoneLaunchable}
        >
          Launch
        </Button>
        {/* <Button
          disabled={true}
          onClick={() => {
            const letterCoordinates =
              convertLocationToLetterCoordinates(selected);

            onSectorSelect(letterCoordinates, "dare");
          }}
        >
          Dare
        </Button> */}
        <Button onClick={onResume}>Back</Button>
      </div>
    </Modal>
  );
};

export default GalaxyMapModal;
