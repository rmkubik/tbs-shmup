import { Fragment, h, render } from "preact";
import { useState, useEffect } from "preact/hooks";

import alarmSound from "../assets/audio/alarm.ogg";
import clickSound from "../assets/audio/click.ogg";
import explodeMedSound from "../assets/audio/explode_med.ogg";
import moveSound from "../assets/audio/move.ogg";
import uiBack from "../assets/audio/ui_back.ogg";
import uiSelect from "../assets/audio/ui_select.ogg";
import warp from "../assets/audio/warp.ogg";

import warningIcon from "../assets/warning.png";

import explosiveAsteroidIcon from "../assets/asteroid5.png";
import cubeIcon from "../assets/cube.png";
import explosionIcon from "../assets/explosion.png";
import bulletIcon from "../assets/bullet.png";

import sectorsData from "./data/sectors";
import zonesData, { zonesMatrix } from "./data/zones";
import {
  doesSectorHavePatternedAsteroids,
  getCurrentSpawnPattern,
} from "./data/asteroidPatterns";
import { initialDeck } from "./data/cards";
import conditions, { findFirstConditionWithSpawns } from "./data/conditions";

import WeightedMap from "./utils/WeightedMap";
import shuffle from "./utils/shuffle";
import last from "./utils/last";
import randInt from "./utils/randInt";
import remove from "./utils/remove";
import set from "./utils/set";
import findAllMatchingIndices from "./utils/findAllMatchingIndices";
import createArray from "./utils/createArray";

import useSaveState from "./hooks/useSaveState";
import useAudio from "./hooks/useAudio";
import useScaleRef from "./hooks/useScaleRef";
import useTheme, { ThemeContextProvider } from "./hooks/useTheme";

import Bar from "./components/Bar";
import Grid from "./components/Grid";
import LoadingModal from "./components/LoadingModal";
import StoryModal from "./components/StoryModal";
import MainMenuModal from "./components/MainMenuModal";
import SectorDetailsModal from "./components/SectorDetailsModal";
import CreditsModal from "./components/CreditsModal";
import OptionsModal from "./components/OptionsModal";
import GameOverModal from "./components/GameOverModal";
import VictoryModal from "./components/VictoryModal";
import EscapedModal from "./components/EscapedModal";
import GalaxyMapModal from "./components/GalaxyMapModal";
import SectorHeader from "./components/SectorHeader";
import useBodyStyle from "./hooks/useBodyStyle";
import Sprite from "./components/Sprite";

const areIndicesAdjacent = (a, b, colCount) => {
  return a - 1 === b || a + 1 === b || a - colCount === b || a + colCount === b;
};

const getDirection = (origin, target, colCount) => {
  if (origin === target) {
    return "self";
  }

  const originRow = Math.floor(origin / colCount);
  const originCol = origin % colCount;

  const targetRow = Math.floor(target / colCount);
  const targetCol = target % colCount;

  const isLeft = targetCol < originCol;
  const isRight = targetCol > originCol;
  const isUp = targetRow < originRow;
  const isDown = targetRow > originRow;

  if (isLeft && isUp) {
    return "upLeft";
  }

  if (isRight && isUp) {
    return "upRight";
  }

  if (isLeft && isDown) {
    return "downLeft";
  }

  if (isRight && isDown) {
    return "downRight";
  }

  if (isLeft) {
    return "left";
  }

  if (isRight) {
    return "right";
  }

  if (isDown) {
    return "down";
  }

  if (isUp) {
    return "up";
  }
};

const getIndicesInRange = (entity, colCount) => {
  if (entity.targetIndex) {
    // Only return subsection of indices between current and target while animating

    const rowsBetweenCurrentAndDestination = Math.floor(
      (entity.targetIndex - entity.index) / colCount
    );

    return (
      createArray(Math.abs(rowsBetweenCurrentAndDestination))
        // Start at the row _after_ the entity's current position
        .map(
          (_, row) =>
            entity.index + Math.sign(entity.speed) * ((row + 1) * colCount)
        )
    );
  }

  return (
    createArray(Math.abs(entity.speed))
      // Start at the row _after_ the entity's current position
      .map(
        (_, row) =>
          entity.index + Math.sign(entity.speed) * ((row + 1) * colCount)
      )
  );
};

const setTargetIndex = (colCount) => (entity) => {
  if (!entity.targetIndex) {
    // if no targetIndex set, set one
    return {
      ...entity,
      targetIndex: entity.index + entity.speed * colCount,
    };
  }

  return entity;
};

const clearAllTargetEntities = (entities) =>
  entities.map(({ targetIndex, ...entity }) => entity);

const isEntityDoneMoving = (entity) => entity.index === entity.targetIndex;

const getIndicesInDirection = (
  origin,
  magnitude,
  direction,
  colCount,
  rowCount
) => {
  const filterIndicesInRowOnly = (index) => {
    const min = Math.floor(origin / colCount) * colCount;
    const max = min + colCount;

    return index >= min && index < max;
  };

  const filterIndicesInBoundsOnly = (index) => {
    return index >= 0 && index < rowCount * colCount;
  };

  if (direction === "self") {
    return [origin];
  }

  if (direction === "left") {
    return createArray(magnitude)
      .map((_, index) => origin - (index + 1))
      .filter(filterIndicesInRowOnly);
  }

  if (direction === "right") {
    return createArray(magnitude)
      .map((_, index) => origin + (index + 1))
      .filter(filterIndicesInRowOnly);
  }

  if (direction === "up") {
    return createArray(magnitude)
      .map((_, index) => origin - (index + 1) * colCount)
      .filter(filterIndicesInBoundsOnly);
  }

  if (direction === "down") {
    return createArray(magnitude)
      .map((_, index) => origin + (index + 1) * colCount)
      .filter(filterIndicesInBoundsOnly);
  }

  if (direction === "upLeft") {
    return createArray(magnitude)
      .map((_, index) => origin - (index + 1) * colCount - 1)
      .filter(filterIndicesInBoundsOnly);
  }

  if (direction === "upRight") {
    return createArray(magnitude)
      .map((_, index) => origin - (index + 1) * colCount + 1)
      .filter(filterIndicesInBoundsOnly);
  }

  if (direction === "downLeft") {
    return createArray(magnitude)
      .map((_, index) => origin + (index + 1) * colCount - 1)
      .filter(filterIndicesInBoundsOnly);
  }

  if (direction === "downRight") {
    return createArray(magnitude)
      .map((_, index) => origin + (index + 1) * colCount + 1)
      .filter(filterIndicesInBoundsOnly);
  }
};

const getIndicesInActionRange = (action, colCount, origin, rowCount) => {
  if (!action) {
    return [];
  }

  // Range zero means only self select to confirm action
  if (action.range === 0) {
    return [origin];
  }

  const indices = [];

  action.directions.forEach((direction) => {
    indices.push(
      ...getIndicesInDirection(
        origin,
        action.range,
        direction,
        colCount,
        rowCount
      )
    );
  });

  return indices;
};

const getIndicesInDirectionUpToTarget = ({
  playerIndex,
  hand,
  direction,
  colCount,
  rowCount,
  selectedCard,
  newIndex,
}) => {
  const allMoveIndices = getIndicesInDirection(
    playerIndex,
    hand[selectedCard].range,
    direction,
    colCount,
    rowCount
  );

  if (hand[selectedCard].selectionStyle !== "precise") {
    return allMoveIndices;
  }

  const newMoveIndexInAllMoveIndices = allMoveIndices.findIndex(
    (index) => index === newIndex
  );

  return allMoveIndices.slice(0, newMoveIndexInAllMoveIndices + 1);
};

const explodeEntity = (entity) => {
  entity.name = "💥";
  entity.img = explosionIcon;
  entity.speed = 0;
  entity.color = "hazardColor";
  entity.targetIndex = entity.index;
};

const chooseNextSpawns = (colCount, sector, turnCount, spawnPattern) => {
  const spawningCondition = findFirstConditionWithSpawns(sector);

  const initialIndices = conditions[spawningCondition].chooseNextSpawns(
    colCount,
    sector,
    turnCount,
    spawnPattern
  );

  const nextSpawns = createArray(colCount);

  initialIndices.forEach((index) => {
    nextSpawns[index] = warningIcon;
  });

  return nextSpawns;
};

/**
 * I think it is time to make th player also just an entity.
 * I think it should just have a special isPlayer: true property.
 *
 * All instances of playerIndex should be replaced with a
 * getPlayer().index function call.
 *
 * Any movement calls will no longer use setPlayerIndex
 * they will instead getPlayer(), adjust player.index, and then
 * setEntities().
 */
const resolveCollisions = (entities) => {};

const getOnShuffleFunction = (sector) => {
  const conditionsWithOnShuffleFunctions = sector.conditions.filter(
    (condition) => conditions[condition]?.onShuffle
  );

  if (conditionsWithOnShuffleFunctions.length === 0) {
    // Default pass through onShuffle function
    return conditions.default.onShuffle;
  }

  const [firstCondition] = conditionsWithOnShuffleFunctions;

  if (conditionsWithOnShuffleFunctions.length > 1) {
    // This sector has multiple onShuffle functions
    // We're going to only use the first one for now.
    console.warn(
      `This sector has more than one onShuffle function. Using only ${
        conditionsWithOnShuffleFunctions[0]
      }. Ignoring: ${conditionsWithOnShuffleFunctions.slice(1).join(", ")}.`
    );
    return conditions[firstCondition].onShuffle;
  }

  // We only have one shuffle condition at this point
  return conditions[firstCondition].onShuffle;
};

const shuffleCards = (cards, sector) => {
  const shuffledCards = shuffle(cards);

  const onShuffle = getOnShuffleFunction(sector);

  return onShuffle(shuffledCards);
};

const colCount = 10;
const rowCount = 15;
const frameRate = 150;
const initialTiles = new Array(colCount * rowCount).fill({ name: "." });

const App = () => {
  const [unlocked, setUnlocked] = useState({
    C3: { unlocked: true, mission: {}, dare: {} },
  });
  const [currentZone, setCurrentZone] = useState("C3");
  const [currentRunType, setCurrentRunType] = useState("mission");
  const [zones, setZones] = useState(zonesMatrix);
  const [sectors, setSectors] = useState(sectorsData);
  const [tiles, setTiles] = useState(initialTiles);
  const [playerIndex, setPlayerIndex] = useState(145);
  const [winStreak, setWinStreak] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  // const [spawnPattern, setSpawnPattern] = useState(defaultSpawnPattern);
  const spawnPattern = getCurrentSpawnPattern(sectors[winStreak]);
  const [nextSpawns, setNextSpawns] = useState(() =>
    chooseNextSpawns(colCount, sectors[winStreak], turnCount, spawnPattern)
  );
  const [entities, setEntities] = useState([]);
  // loading, drawing, waiting, targeting, animating, spawning, cleanup, gameover, victory
  const [gameState, setGameState] = useState("loading");
  const [lastSpawned, setLastSpawned] = useState();
  const [selectedCard, setSelectedCard] = useState(0);
  const [graveyard, setGraveyard] = useState([]);
  const [deck, setDeck] = useState(() =>
    shuffleCards(initialDeck, sectors[winStreak])
  );
  const [hand, setHand] = useState([]);
  const [power, setPower] = useState(2);
  const [maxPower, setMaxPower] = useState(2);
  const [drawSize, setDrawSize] = useState(3);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [hasUsedShipPower, setHasUsedShipPower] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [enableVfx, setEnableVfx] = useState(true);
  const [skipMenuStory, setSkipMenuStory] = useState(false);
  const [lastCheckpoint, setLastCheckpoint] = useState(0);
  const [areCheckpointsEnabled, setAreCheckpointsEnabled] = useState(true);
  const [shouldShowSectorDetails, setShouldShowSectorDetails] = useState(false);
  const [shouldShowGalaxyMap, setShouldShowGalaxyMap] = useState(false);
  const { isAudioLoaded, playSound, stopSound, volume, setVolume } = useAudio([
    alarmSound,
    clickSound,
    explodeMedSound,
    moveSound,
    uiBack,
    uiSelect,
    warp,
  ]);
  const isSaveLoaded = useSaveState({
    storageKey: "com.ryankubik.rocket-jockey",
    savedFields: [
      ["winStreak", winStreak, setWinStreak],
      ["skipMenuStory", skipMenuStory, setSkipMenuStory],
      ["enableVfx", enableVfx, setEnableVfx],
      ["lastCheckpoint", lastCheckpoint, setLastCheckpoint],
      [
        "areCheckpointsEnabled",
        areCheckpointsEnabled,
        setAreCheckpointsEnabled,
      ],
      ["volume", volume, setVolume],
      ["unlocked", unlocked, setUnlocked],
    ],
  });
  const { theme, currentTheme, setTheme } = useTheme();

  useBodyStyle({
    backgroundColor: theme.backgroundColor,
  });

  const scaleRef = useScaleRef();

  const createPlayer = (newIndex) => {
    setPlayerIndex(newIndex);
  };
  const getPlayer = () => {
    return { index: playerIndex };
  };
  const movePlayer = (newIndex) => {
    setPlayerIndex(newIndex);
  };
  const killPlayer = () => {
    setPlayerIndex(-100);
  };
  const isPlayerDead = () => {
    return getPlayer().index < 0;
  };

  const shuffleGraveyardIntoDeck = () => {
    shuffleCardsIntoDeck(graveyard);
    setGraveyard([]);
  };

  const shuffleCardsIntoDeck = (cards) => {
    const currentSector = sectors[winStreak];
    const newDeck = shuffleCards(cards, currentSector);

    setDeck([...deck, ...newDeck]);
  };

  const startNewRound = (newZoneCoordinates, newRunType) => {
    const zoneCoordinates = newZoneCoordinates ?? currentZone;
    const runType = newRunType ?? currentRunType;

    if (!zonesData[zoneCoordinates]) {
      throw new Error(
        `Tried to start a new round with zone ${zoneCoordinates}, but that zone does not exist.`
      );
    }

    if (!zonesData[zoneCoordinates][runType]) {
      throw new Error(
        `Tried to start a new round with zone "${zoneCoordinates}" and run type "${runType}", but that run type does not exist for that zone.`
      );
    }

    const newZone = zonesData[zoneCoordinates][runType];

    createPlayer(newZone.playerIndex);
    setEntities([]);
    setTurnCount(0);
    setLastSpawned(undefined);
    setSelectedCard(0);
    setGraveyard([]);

    let newDeck = newZone.deck ?? initialDeck;

    const newSector = newZone.sectors[winStreak];

    if (newSector.conditions.includes("left-offline")) {
      // Remove any card with a left direction
      newDeck = newDeck.filter((card) => !card.directions.includes("left"));
    }

    // If this new sector is a checkpoint, set it as our last checkpoint
    if (newSector.conditions.includes("checkpoint")) {
      setLastCheckpoint(winStreak);
    }

    setDeck(shuffleCards(newDeck, newSector));
    setNextSpawns(chooseNextSpawns(colCount, newSector, 0, spawnPattern));
    setHand([]);
    setPower(newZone.power);
    setMaxPower(newZone.maxPower);
    setHasUsedShipPower(false);
    setGameState("spawning");
  };

  /**
   * Attach setters to window for debugging
   */
  window.setWinStreak = setWinStreak;
  window.startNewRound = startNewRound;
  window.setGameState = setGameState;
  // window.setSpawnPattern = setSpawnPattern;
  window.setLastCheckpoint = setLastCheckpoint;
  window.setTheme = setTheme;
  /**
   * End debug stuff
   */

  // This is a hack so that startNewRound
  // happens _after_ we've set up state
  // correctly from localStorage.
  useEffect(() => {
    if (isSaveLoaded) {
      if (!skipMenuStory) {
        setShowMainMenu(true);
      }

      startNewRound();
    }
  }, [isSaveLoaded]);

  useEffect(() => {
    const onClick = () => {
      playSound("click");
    };

    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, [playSound]);

  const moveEntities = () => {
    let newEntities = [...entities];

    for (let index = 0; index < newEntities.length; index += 1) {
      const entity = newEntities[index];

      if (entity.name === "💥") {
        // This entity is already destroyed, skip it
        continue;
      }

      let newIndex = entity.index;

      if (!isEntityDoneMoving(entity)) {
        const isEntityMovingUp = entity.speed < 0;

        newIndex = isEntityMovingUp
          ? entity.index - colCount
          : entity.index + colCount;
      }

      // Move ourselves to the new index
      entity.index = newIndex;

      if (entity.index === getPlayer().index) {
        playSound("explode_med");

        if (!entity.isCollisionImmune) {
          explodeEntity(entity);
        }

        killPlayer();
      }

      const otherEntities = remove(entities, index);
      const collidingEntities = otherEntities.filter(
        (otherEntity) => otherEntity.index === entity.index
      );

      if (collidingEntities.length > 0) {
        // Mark each collided entity as exploded
        collidingEntities.forEach((otherEntity) => {
          // If both are collision immune, they both blow up
          // If the other one isn't collision immune, it blows
          // up.
          if (
            (otherEntity.isCollisionImmune && entity.isCollisionImmune) ||
            !otherEntity.isCollisionImmune
          ) {
            playSound("explode_med");

            explodeEntity(otherEntity);
          }
        });

        const isAnyOtherEntityCollisionImmune = collidingEntities.some(
          (otherEntity) => otherEntity.isCollisionImmune
        );

        if (isAnyOtherEntityCollisionImmune || !entity.isCollisionImmune) {
          playSound("explode_med");

          // Blow ourselves up
          explodeEntity(entity);
        }
      }
    }

    const isNegativeIndexBullet = (entity) =>
      entity.name === "*" && entity.index < 0;

    // Get all bullets that are at a negative index
    const negativeBullets = newEntities.filter(isNegativeIndexBullet);

    // Calculate which column a negative index bullet
    // is in.
    //
    // Negative indices are reversed and off by one.
    // -1 is in the far right corner.
    const shotColumns = negativeBullets.map(
      (bullet) => colCount + (bullet.index % colCount)
    );

    // If nextSpawn col is shot, make it empty
    const newNextSpawns = nextSpawns.map((nextSpawn, index) =>
      shotColumns.some((col) => col === index) ? "" : nextSpawn
    );

    setNextSpawns(newNextSpawns);

    // Remove negative bullets from entity list
    newEntities = newEntities.filter(
      (entity) => !isNegativeIndexBullet(entity)
    );

    if (newEntities.every(isEntityDoneMoving)) {
      const resetEntities = clearAllTargetEntities(newEntities);

      setEntities(resetEntities);
      setGameState("spawning");
    } else {
      setEntities(newEntities);
    }
  };

  useEffect(() => {
    let timeout;

    if (gameState === "targeting") {
      const newEntities = entities.map(setTargetIndex(colCount));

      setGameState("animating");
      setEntities(newEntities);
    }

    if (gameState === "animating") {
      timeout = setTimeout(moveEntities, frameRate);
    }

    return () => clearTimeout(timeout);
  }, [entities, gameState]);

  useEffect(() => {
    if (gameState === "spawning") {
      // Spawn new entities every X turns if we haven't already spawned
      // at this current turn count.
      if (turnCount % 1 === 0 && lastSpawned !== turnCount) {
        const sector = sectors[winStreak];
        const spawningCondition = findFirstConditionWithSpawns(sector);

        const newEntities = conditions[spawningCondition]
          .spawnEntities(nextSpawns)
          .filter((newEntity) => {
            // If we would spawn on top of a bullet, blow it up and
            // then don't spawn a new asteroid.
            //
            // TODO: How do isExplosionImmune asteroids and bullets
            // interact when spawning new entities?
            const collidingBulletIndices = findAllMatchingIndices(
              entities,
              (entity) =>
                entity.index === newEntity.index && entity.name === "*"
            );
            if (collidingBulletIndices.length > 0) {
              collidingBulletIndices.forEach((collidingIndex) => {
                playSound("explode_med");

                explodeEntity(entities[collidingIndex]);
              });
              return false;
            }

            // Don't spawn entities on top of other entities
            if (entities.some((entity) => entity.index === newEntity.index)) {
              return false;
            }

            return true;
          });

        console.log({ newEntities });

        // nextSpawns.forEach((spawn, spawnIndex) => {
        // if (!spawn) {
        //   // This index isn't a spawn location
        //   return;
        // }

        // let spawnSpeed = randInt(2, 5);

        // if (doesSectorHavePatternedAsteroids(sectors[winStreak])) {
        //   const pattern = spawnPattern
        //     .split("\n")
        //     .map((string) => string.trim().split(""));

        //   // Turn has advanced since we set nextSpawns, check previous turn
        //   // in the pattern for spawn speeds
        //   const currentPattern = pattern[turnCount % pattern.length];

        //   // ? should be left as random speed
        //   // . shouldn't be here, as it isn't marked as a spawn
        //   if (
        //     currentPattern[spawnIndex] !== "?" &&
        //     currentPattern[spawnIndex] !== "."
        //   ) {
        //     // Otherwise, we use the default speed
        //     spawnSpeed = parseInt(currentPattern[spawnIndex]);
        //   }
        // }

        // If we would spawn on top of a bullet, blow it up and
        // then don't spawn a new asteroid.
        // const collidingBulletIndices = findAllMatchingIndices(
        //   entities,
        //   (entity) => entity.index === spawnIndex && entity.name === "*"
        // );
        // if (collidingBulletIndices.length > 0) {
        //   collidingBulletIndices.forEach((collidingIndex) => {
        //     playSound("explode_med");

        //     entities[collidingIndex].name = "💥";
        //     entities[collidingIndex].img = explosionIcon;
        //     entities[collidingIndex].color = "hazardColor";
        //     entities[collidingIndex].speed = 0;
        //   });
        //   return;
        // }

        // if (
        //   entities.some((entity) => entity.index === spawnIndex) ||
        //   newEntities.some((entity) => entity.index === spawnIndex)
        // ) {
        //   // Don't spawn entities on top of other entities
        //   return;
        // }

        // let img;

        // if (spawnSpeed <= 2) {
        //   img = asteroidIcon1;
        // } else if (spawnSpeed > 2 && spawnSpeed <= 3) {
        //   img = asteroidIcon2;
        // } else if (spawnSpeed > 3 && spawnSpeed <= 4) {
        //   img = asteroidIcon3;
        // } else if (spawnSpeed >= 5) {
        //   img = asteroidIcon4;
        // }

        // newEntities.push({
        //   name: "🪨",
        //   speed: spawnSpeed,
        //   index: spawnIndex,
        //   img,
        //   color: "hazardColor",
        // });
        // });

        setLastSpawned(turnCount);
        setEntities([...entities, ...newEntities]);
        setNextSpawns(
          chooseNextSpawns(
            colCount,
            sectors[winStreak],
            turnCount + 1,
            spawnPattern
          )
        );
      }

      setGameState("cleanup");
      // setGameState("drawing");
    }
  }, [gameState, lastSpawned, entities, turnCount]);

  useEffect(() => {
    if (showStory) {
      playSound("alarm", { loop: true });
    }
  }, [showStory]);

  useEffect(() => {
    if (gameState === "cleanup") {
      if (isPlayerDead()) {
        // Player is dead
        setGameState("gameover");
        return;
      }

      if (getPlayer().index < colCount) {
        // Player made it to the end
        setWinStreak(winStreak + 1);
        setGameState("victory");
        return;
      }

      const newEntities = entities
        // Remove entities off bottom of screen
        .filter((entity) => entity.index < tiles.length)
        // Remove explosions
        .filter((entity) => entity.name !== "💥");

      setPower(maxPower);
      setHasUsedShipPower(false);
      setEntities(newEntities);
      setGameState("drawing");
    }
  }, [gameState, entities, tiles]);

  useEffect(() => {
    if (gameState === "drawing") {
      drawHand();
      setGameState("waiting");
    }

    if (gameState === "gameover") {
      window.goatcounter.count({
        path: `gameover-zone:${currentZone}-run:${currentRunType}-sector:${
          winStreak + 1
        }`,
        title: `Player lost ${currentZone} ${currentRunType} on sector ${
          winStreak + 1
        }.`,
        event: true,
      });
    }

    if (gameState === "victory") {
      playSound("warp");

      window.goatcounter.count({
        path: `victory-zone:${currentZone}-run:${currentRunType}-sector:${winStreak}`,
        title: `Player beat ${currentZone} ${currentRunType} on sector ${winStreak}.`,
        event: true,
      });

      const zone = zonesData[currentZone][currentRunType];

      if (typeof zone.winCondition === "number") {
        // This is the default win condition. Compare current
        // winStreak against this value.

        if (winStreak >= zone.winCondition) {
          const newUnlocked = { ...unlocked };

          if (!newUnlocked[currentZone]) {
            newUnlocked[currentZone] = {};
          }

          const newHighScore = Math.max(
            newUnlocked[currentZone].highScore ?? 0,
            winStreak
          );

          newUnlocked[currentZone] = {
            ...newUnlocked[currentZone],
            highScore: newHighScore,
            [currentRunType]: {
              completed: true,
            },
          };

          // When we complete a mission:
          // - return to galaxy map
          // - we can duplicate data at this point
          //    - A zone currently has an unlocked
          //      property. However, this property
          //      is really a derivative of it's
          //      unlock requirements and the state
          //      of every other zone's status.
          //      To replace this, we'd need to
          //      recursively check every sector on
          //      the map?

          setUnlocked(newUnlocked);
        }
      }

      // - There's now a "Mission Complete" screen once
      //   you satisfy a sector's win condition in the
      //   victory state.
      //    - Once the victory state is reached and the
      //      win condition is met, then we set the
      //      zone as unlocked. And we launch the mission
      //      complete modal.
      //    - We should track the highScore in every
      //      Mission and Dare in the unlocked object.
      //    - This state has a button to return you to
      //      the Galaxy Map.
      // - The Galaxy Map with modal is the default
      //   state that you're launched into.
      // - You can no longer launch the Galaxy Map via
      //   the Options modal.
      // - The Galaxy Map has a Mission button and a
      //   Dare button.
      //    - The Dare button is disabled until the
      //      mission has been unlocked.
      // - A zone can be entered in Dare mode or Mission
      //   mode
      //    - A Mission can specify any properties like deck
      //      or theme.
      //    - A Dare will use the same settings as a mission
      //      unless they're explicitly overridden.
      //       - Usually, the winCondition at least will be
      //         overridden. The usual value we will set is
      //         "highScore". This will enable the infinite
      //         mode.
      // -
    }
  }, [gameState]);

  const tryTakeAction = (newIndex) => {
    if (gameState !== "waiting") {
      // Skip player input unless we're waiting
      return;
    }

    if (power < hand[selectedCard].cost) {
      // Not enough power to pay this card's cost
      return;
    }

    // Check if index is a valid action
    if (
      getIndicesInActionRange(
        hand[selectedCard],
        colCount,
        getPlayer().index,
        rowCount
      ).includes(newIndex)
    ) {
      // If no action effect, default to moving
      if (!hand[selectedCard].effect) {
        playSound("move");

        const direction = getDirection(getPlayer().index, newIndex, colCount);

        const indices = getIndicesInDirectionUpToTarget({
          playerIndex: getPlayer().index,
          hand,
          direction,
          colCount,
          rowCount,
          selectedCard,
          newIndex,
        });

        const collidedEntityIndex = entities.findIndex((entity) =>
          indices.includes(entity.index)
        );

        if (collidedEntityIndex >= 0) {
          // This section should ignore isCollisionImmune. We don't
          // care if the asteroid shouldn't have exploded or not
          // because the player is now dead.
          playSound("explode_med");

          // Kill player if they move into an entity
          const newEntity = {
            ...entities[collidedEntityIndex],
            name: "💥",
            img: explosionIcon,
            color: "hazardColor",
            speed: 0,
          };

          setEntities(set(entities, collidedEntityIndex, newEntity));
          killPlayer();
          setGameState("gameover");
          return;
        }

        const movedIndex = last(indices);
        movePlayer(movedIndex);

        if (movedIndex < colCount) {
          // Player made it to the end
          setWinStreak(winStreak + 1);
          setGameState("victory");
          return;
        }
      }

      if (hand[selectedCard].effect === "charge") {
        setMaxPower(maxPower + 1);
      }

      if (hand[selectedCard].effect === "shoot") {
        // TODO: Perhaps we should add a "collision resolution"
        // phase that happens before we move on to the movement
        // phase.
        // I think this one-off exists here because entities
        // will spawn on top of each other and then move
        // out of each other's way before movement collision
        // code can tell they should've exploded.
        //
        // is some other entity at this location?
        const collidingEntities = entities.filter(
          (entity) => entity.index === newIndex
        );
        if (collidingEntities.length > 0) {
          // TODO: This does not support bullets being
          // collision immune right now.
          playSound("explode_med");

          // don't create a bullet, blow up entities instead
          collidingEntities.forEach((entity) => {
            if (!entity.isCollisionImmune) {
              explodeEntity(entity);
            }
          });
        } else {
          const newEntity = {
            index: newIndex,
            name: "*",
            img: bulletIcon,
            color: "hazardColor",
            speed: -3,
          };

          setEntities([...entities, newEntity]);
        }
      }

      const newPower = power - hand[selectedCard].cost;
      setPower(newPower);

      // discard used card
      setGraveyard([hand[selectedCard], ...graveyard]);
      setHand(remove(hand, selectedCard));

      if (newPower === 0) {
        // // TODO: Temp - cycle themes on each move
        // // Remove themes import too
        // setTheme(
        //   pickRandomlyFromArray(
        //     Object.keys(themes).filter((theme) => theme !== currentTheme)
        //   )
        // );

        setTurnCount(turnCount + 1);
        setGameState("targeting");
        return;
      }
    }
  };

  const indicesInActionRange = getIndicesInActionRange(
    hand[selectedCard],
    colCount,
    getPlayer().index,
    rowCount
  );
  let hoveredIndices = [];

  // If an index is being hovered, and it is a targetable index
  if (hoveredIndex >= 0 && indicesInActionRange.includes(hoveredIndex)) {
    const direction = getDirection(getPlayer().index, hoveredIndex, colCount);

    hoveredIndices = getIndicesInDirectionUpToTarget({
      playerIndex: getPlayer().index,
      hand,
      direction,
      colCount,
      rowCount,
      selectedCard,
      newIndex: hoveredIndex,
    });
  }

  const renderTile = (tile, index) => {
    let object = { ...tile };
    delete object.bg; // remove old bg from tile

    const hoveredEntity = entities.find(
      (entity) => hoveredIndex === entity.index
    );
    if (
      hoveredEntity &&
      getIndicesInRange(hoveredEntity, colCount).includes(index)
    ) {
      object = { name: "⚠️", img: warningIcon, color: "cautionColor" };
    }

    // Display warning icons for entity movement
    // if (
    //   entities.some((entity) =>
    //     getIndicesInRange(entity, colCount).includes(index)
    //   )
    // ) {
    //   object = { name: "⚠️", img: warningIcon };
    // }

    // highlight potential move option
    if (indicesInActionRange.includes(index)) {
      if (object.name === ".") {
        object.name = "";
      }
      object.bg = "◌";

      if (hoveredIndices.includes(index)) {
        object.bg = "◯";
      }
    }

    // Display entity
    const entity = entities.find((entity) => entity.index === index);
    if (entity) {
      object = { ...object, ...entity };
    }

    // Display player at current index
    const shipIcon = zonesData[currentZone][currentRunType].ship.icon;
    if (index === getPlayer().index) {
      object = { ...object, name: "🔺", img: shipIcon, color: "primaryColor" };
    }

    return (
      <div
        style={{
          cursor: "pointer",
          height: "16px",
          width: "16px",
          position: "relative",
        }}
        onClick={() => tryTakeAction(index)}
        onMouseEnter={() => setHoveredIndex(index)}
      >
        {object.img ? (
          <Fragment>
            {object.speed !== 0 && (
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
                {object.speed}
              </span>
            )}
            <Sprite src={object.img} color={object.color} />
          </Fragment>
        ) : (
          <span
            style={{ position: "absolute", width: "100%", left: 0, top: 0 }}
          >
            {object.name}
          </span>
        )}
        {object.bg ? (
          <span
            style={{ position: "absolute", width: "100%", left: 0, top: 0 }}
          >
            {object.bg}
          </span>
        ) : (
          ""
        )}
      </div>
    );
  };

  const drawHand = () => {
    // Draw cards to refill your hand
    const cardsLeftInHand = hand.length;
    const missingCardsFromHand = drawSize - cardsLeftInHand;

    const { newDeck, newHand, newGraveyard } = drawCards(missingCardsFromHand);

    setGraveyard(newGraveyard);
    setHand(newHand);
    setDeck(newDeck);
  };

  const drawCards = (count) => {
    const drawnCards = deck.slice(0, count);

    let newHand = [...hand, ...drawnCards];
    let newGraveyard = graveyard;
    let newDeck = deck.slice(count);

    const missingCardsFromDraw = count - drawnCards.length;

    if (missingCardsFromDraw > 0) {
      // Shuffle graveyard up and use as deck
      newDeck = shuffleCards(newGraveyard, sectors[winStreak]);
      // Draw remaining cards to fill out the rest of the hand
      newHand = [...newHand, ...newDeck.slice(0, missingCardsFromDraw)];
      // Remove drawn cards from deck
      newDeck = newDeck.slice(missingCardsFromDraw);
      // Set graveyard as empty
      newGraveyard = [];
    }

    return {
      newDeck,
      newHand,
      newGraveyard,
    };
  };

  const sortedDeck = [...deck].sort((cardA, cardB) =>
    cardA.name.localeCompare(cardB.name)
  );

  // TODO: hack to make sure the above settings
  // take effect before we actually start the new
  // round.
  useEffect(() => {
    if (!shouldShowGalaxyMap) {
      startNewRound();
    }
  }, [shouldShowGalaxyMap]);

  return (
    <Fragment>
      {enableVfx && <div className="scanLinesH overlay" />}
      <div
        id="game"
        ref={scaleRef}
        style={{
          color: theme.primaryColor,
          backgroundColor: theme.backgroundColor,
        }}
      >
        {showOptions || gameState === "gameover" || gameState === "victory" ? (
          <div className="modal-background overlay" />
        ) : null}
        {!isSaveLoaded && !isAudioLoaded ? (
          <LoadingModal />
        ) : showStory ? (
          <StoryModal
            onPlay={() => {
              setShowStory(false);
              stopSound("alarm");
              playSound("ui_select");
            }}
          />
        ) : showMainMenu ? (
          <MainMenuModal
            onStart={() => {
              setShowStory(true);
              setShowMainMenu(false);
            }}
          />
        ) : shouldShowSectorDetails ? (
          <SectorDetailsModal
            sectors={sectors}
            areCheckpointsEnabled={areCheckpointsEnabled}
            lastCheckpoint={lastCheckpoint}
            winStreak={winStreak}
            onBack={() => {
              setShouldShowSectorDetails(false);
            }}
          />
        ) : showCredits ? (
          <CreditsModal
            onBack={() => {
              setShowCredits(false);
            }}
          />
        ) : shouldShowGalaxyMap ? (
          <GalaxyMapModal
            onResume={() => {
              setShouldShowGalaxyMap(false);
            }}
            onSectorSelect={(letterCoordinates, runType) => {
              const newZone = zonesData[letterCoordinates][runType];

              setCurrentZone(letterCoordinates);
              setCurrentRunType(runType);

              setTheme(newZone.theme);
              setSectors(newZone.sectors);
              // setTiles(TODO: use new dimensions to calculate tiles again);
              createPlayer(newZone.playerIndex);
              setDeck(newZone.deck);
              setPower(2);
              setMaxPower(2);
              setDrawSize(3);

              setShowOptions(false);
              setShouldShowGalaxyMap(false);
            }}
            zonesMatrix={zones}
            sectors={sectors}
            unlocked={unlocked}
            winStreak={winStreak}
          />
        ) : showOptions ? (
          <OptionsModal
            enableVfx={enableVfx}
            setEnableVfx={setEnableVfx}
            skipMenuStory={skipMenuStory}
            setSkipMenuStory={setSkipMenuStory}
            areCheckpointsEnabled={areCheckpointsEnabled}
            setAreCheckpointsEnabled={setAreCheckpointsEnabled}
            volume={volume}
            setVolume={setVolume}
            playSound={playSound}
            setShouldShowSectorDetails={setShouldShowSectorDetails}
            setShowStory={setShowStory}
            setShowOptions={setShowOptions}
            startNewRound={startNewRound}
            setWinStreak={setWinStreak}
            setShowCredits={setShowCredits}
            setShouldShowGalaxyMap={setShouldShowGalaxyMap}
          />
        ) : gameState === "gameover" ? (
          <GameOverModal
            winStreak={winStreak}
            areCheckpointsEnabled={areCheckpointsEnabled}
            lastCheckpoint={lastCheckpoint}
            sectors={sectors}
            onRestart={() => {
              if (areCheckpointsEnabled) {
                setWinStreak(lastCheckpoint);
              }
              startNewRound();
            }}
          />
        ) : winStreak >= sectors.length ? (
          <EscapedModal
            winStreak={winStreak}
            onMenuClick={() => {
              startNewRound();
              setShowMainMenu(true);
            }}
          />
        ) : gameState === "victory" ? (
          <VictoryModal
            winStreak={winStreak}
            areCheckpointsEnabled={areCheckpointsEnabled}
            lastCheckpoint={lastCheckpoint}
            sectors={sectors}
            onContinue={() => {
              startNewRound();
            }}
          />
        ) : null}
        {/*winStreak > 0 ? (
          <div className="header">
            <p className="streak">Sector: {winStreak}</p>
          </div>
        ) : null*/}
        <SectorHeader
          winStreak={winStreak}
          sector={sectors[winStreak]}
          zone={zonesData[currentZone]}
        />
        {/* TODO: Return to this css className grid-sidebar-container and color the scroll bar using the theme */}
        <div className="grid-sidebar-container">
          <div>
            <Grid
              tiles={nextSpawns}
              colCount={colCount}
              renderTile={(tile) =>
                // Only show warning icons after a single action has
                // been chosen already.
                //
                // Don't show the new warning icons that are assigned once spawning
                // and cleanup states are written.
                //
                // Don't show warning icons if we're in a nebula.
                power <= 1 &&
                tile &&
                !sectors[winStreak].conditions.includes("nebula") &&
                gameState !== "spawning" &&
                gameState !== "cleanup" ? (
                  <Sprite src={tile} color={"cautionColor"} />
                ) : (
                  <div
                    style={{
                      height: "16px",
                      width: "16px",
                      position: "relative",
                    }}
                  ></div>
                )
              }
            />
            <Grid
              tiles={tiles}
              colCount={colCount}
              renderTile={renderTile}
              setHoveredIndex={setHoveredIndex}
            />
          </div>
          <div className="sidebar">
            <p>Deck</p>
            <ul>
              {sortedDeck.length === 0 ? (
                <span>Empty...</span>
              ) : (
                sortedDeck.map((card) => (
                  <li style={{ borderColor: theme.primaryColor }}>
                    {card.data?.oldCard && (
                      <span className="old-card-name">
                        {card.data?.oldCard.name} <br />
                      </span>
                    )}
                    {card.name} <br /> {card.range}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <Bar
          power={power}
          maxPower={maxPower}
          hand={hand}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          hasUsedShipPower={hasUsedShipPower}
          setShowOptions={setShowOptions}
          onEndClick={() => {
            setTurnCount(turnCount + 1);
            setPower(maxPower);
            setGameState("targeting");
          }}
          onRecycleClick={() => {
            if (hasUsedShipPower) {
              return;
            }

            playSound("ui_select");

            // Draw a new card
            let { newDeck, newHand, newGraveyard } = drawCards(1);

            // Discard my currently selected card
            newHand = [
              ...newHand.slice(0, selectedCard),
              ...newHand.slice(selectedCard + 1),
            ];
            newGraveyard = [hand[selectedCard], ...newGraveyard];

            setGraveyard(newGraveyard);
            setHand(newHand);
            setDeck(newDeck);
            setHasUsedShipPower(true);
          }}
        />
      </div>
    </Fragment>
  );
};

const AppWithProviders = () => {
  return (
    <ThemeContextProvider initialTheme="default">
      <App />
    </ThemeContextProvider>
  );
};

render(<AppWithProviders />, document.getElementById("app"));
