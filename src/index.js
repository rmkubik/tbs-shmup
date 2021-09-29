import { Fragment, h, render } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import warningIcon from "../assets/warning.png";
import shipIcon from "../assets/ship.png";
import asteroidIcon from "../assets/asteroid.png";
import explosionIcon from "../assets/explosion.png";
import bulletIcon from "../assets/bullet.png";

import WeightedMap from "./WeightedMap";

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Comment about: Durstenfeld shuffle
const shuffle = (array) => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
};

const last = (array) => array[array.length - 1];

const remove = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

const set = (array, index, value) => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1),
];

const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

const randInt = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

const areIndicesAdjacent = (a, b, colCount) => {
  return a - 1 === b || a + 1 === b || a - colCount === b || a + colCount === b;
};

const findAllMatchingIndices = (array, matcher) => {
  const matchingIndices = [];

  for (let index = 0; index < array.length; index += 1) {
    if (matcher(array[index])) {
      matchingIndices.push(index);
    }
  }

  return matchingIndices;
};

const createArray = (length) => new Array(length).fill();

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
      createArray(rowsBetweenCurrentAndDestination)
        // Start at the row _after_ the entity's current position
        .map((_, row) => entity.index + (row + 1) * colCount)
    );
  }

  return (
    createArray(entity.speed)
      // Start at the row _after_ the entity's current position
      .map((_, row) => entity.index + (row + 1) * colCount)
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

const moveEntity =
  (colCount, playerIndex, setPlayerIndex) => (entity, index, entities) => {
    const newIndex = isEntityDoneMoving(entity)
      ? entity.index
      : entity.index + colCount;

    /**
     * If an entity that is moving will hit us, we should turn into an
     * explosion.
     */
    if (
      remove(entities, index).some(
        (otherEntity) =>
          !isEntityDoneMoving(otherEntity) &&
          otherEntity.index + colCount === newIndex
      )
    ) {
      return {
        ...entity,
        name: "💥",
        index: newIndex,
        img: explosionIcon,
        speed: 0,
        targetIndex: newIndex,
      };
    }

    if (isEntityDoneMoving(entity)) {
      // We're at target index, just return unedited
      return entity;
    }

    if (newIndex === playerIndex) {
      // if we hit player turn into explosion
      setPlayerIndex(-100);

      return {
        ...entity,
        name: "💥",
        index: newIndex,
        img: explosionIcon,
        speed: 0,
        targetIndex: newIndex,
      };
    }

    /**
     * If another stationary entity is at the location we're moving to
     * then this is a collision.
     */
    if (
      entities.some(
        (otherEntity) =>
          otherEntity.index === newIndex && isEntityDoneMoving(otherEntity)
      )
    ) {
      return {
        ...entity,
        name: "💥",
        index: newIndex,
        img: explosionIcon,
        speed: 0,
        targetIndex: newIndex,
      };
    }

    return {
      ...entity,
      index: entity.index + colCount,
    };
  };

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

const explodeEntity = (entity) => {
  entity.name = "💥";
  entity.img = explosionIcon;
  entity.speed = 0;
  entity.targetIndex = entity.index;
};

const pickRandomSpawnIndices = (colCount) => {
  const indices = [];

  // "light" asteroids weighted map
  const spawnCountMap = new WeightedMap({
    3: 40,
    4: 30,
    5: 25,
    6: 5,
  });

  // const spawnCount = randInt(6, 10); // "heavy"
  // const spawnCount = randInt(3, 6); // "light"
  const spawnCount = parseInt(spawnCountMap.pickRandom());

  createArray(spawnCount).forEach(() => {
    const spawnIndex = randInt(0, colCount - 1);

    if (indices.some((index) => index === spawnIndex)) {
      // Skip indices we've already chosen
      return;
    }

    indices.push(spawnIndex);
  });

  return indices;
};

const chooseNextSpawns = (colCount) => {
  const initialIndices = pickRandomSpawnIndices(colCount);

  const nextSpawns = createArray(colCount);

  initialIndices.forEach((index) => {
    nextSpawns[index] = warningIcon;
  });

  return nextSpawns;
};

const scaleToFitWindow = (node) => {
  if (!node) {
    // If no node is provided, do nothing
    return;
  }

  const { clientWidth, clientHeight } = node;
  const { innerWidth, innerHeight } = window;

  const scales = [
    // X scale
    Math.max(clientWidth, innerWidth) / Math.min(clientWidth, innerWidth),
    // Y scale
    Math.max(clientHeight, innerHeight) / Math.min(clientHeight, innerHeight),
  ];

  node.style.transform = `scale(${Math.min(...scales)})`;
};

const useScaleRef = () => {
  const scaleRef = useRef();

  useEffect(() => {
    const scaleToFitWindowWithRef = () => scaleToFitWindow(scaleRef.current);

    scaleToFitWindowWithRef();

    window.addEventListener("resize", scaleToFitWindowWithRef);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        scaleToFitWindow(entry.target);
      }
    });

    resizeObserver.observe(scaleRef.current);

    return () => {
      window.removeEventListener("resize", scaleToFitWindowWithRef);
      resizeObserver.disconnect();
    };
  }, []);

  return scaleRef;
};

const Grid = ({ tiles, colCount, renderTile, setHoveredIndex = () => {} }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "16px ".repeat(colCount),
        lineHeight: "16px",
        textAlign: "center",
      }}
      onMouseLeave={() => setHoveredIndex(-1)}
    >
      {tiles.map((tile, index) => renderTile(tile, index))}
    </div>
  );
};

const Bar = ({
  power,
  maxPower,
  hand,
  selectedCard,
  setSelectedCard,
  hasUsedShipPower,
  onEndClick,
  onRecycleClick,
}) => {
  return (
    <div className="bar">
      <div>
        <p>
          PWR: {power}/{maxPower}
        </p>
        <button disabled={hasUsedShipPower} onClick={onRecycleClick}>
          {hasUsedShipPower ? "Recharging..." : "Recycle"}
        </button>
        {/* <button onClick={onEndClick}>End</button> */}
      </div>
      <ul>
        {hand.map((card, index) => (
          <li
            className={selectedCard === index ? "selected" : ""}
            onClick={() => setSelectedCard(index)}
          >
            {card.name} <br /> {card.range}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Modal = ({ children }) => {
  return (
    <div className="modal">
      <div>{children}</div>
    </div>
  );
};

const colCount = 10;
const rowCount = 15;
const frameRate = 150;
const initialTiles = new Array(colCount * rowCount).fill({ name: "." });

const initialDeck = [
  { name: "Left", cost: 1, range: 3, directions: ["left"] },
  { name: "Up", cost: 1, range: 2, directions: ["up"] },
  { name: "Right", cost: 1, range: 1, directions: ["right"] },
  { name: "UpRight", cost: 1, range: 2, directions: ["upRight"] },
  { name: "Down", cost: 1, range: 2, directions: ["down"] },
  { name: "Up", cost: 1, range: 4, directions: ["up"] },
  { name: "Shoot", cost: 1, range: 1, directions: ["up"], effect: "shoot" },
];

const App = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [playerIndex, setPlayerIndex] = useState(145);
  const [nextSpawns, setNextSpawns] = useState(chooseNextSpawns(colCount));
  const [entities, setEntities] = useState([]);
  // drawing, waiting, targeting, animating, spawning, cleanup, gameover, victory
  const [gameState, setGameState] = useState("spawning"); // useState("spawning");
  const [turnCount, setTurnCount] = useState(0);
  const [lastSpawned, setLastSpawned] = useState();
  const [selectedCard, setSelectedCard] = useState(0);
  const [graveyard, setGraveyard] = useState([]);
  const [deck, setDeck] = useState(shuffle(initialDeck));
  const [hand, setHand] = useState([]);
  const [power, setPower] = useState(2);
  const [maxPower, setMaxPower] = useState(2);
  const [drawSize, setDrawSize] = useState(3);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [hasUsedShipPower, setHasUsedShipPower] = useState(false);
  const [winStreak, setWinStreak] = useState(0);

  const scaleRef = useScaleRef();

  const startNewRound = () => {
    setPlayerIndex(145);
    setEntities([]);
    setGameState("spawning");
    setTurnCount(0);
    setLastSpawned(undefined);
    setSelectedCard(0);
    setGraveyard([]);
    setDeck(shuffle(initialDeck));
    setHand([]);
    setPower(2);
    setMaxPower(2);
    setHasUsedShipPower(false);
  };

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

      if (entity.index === playerIndex) {
        setPlayerIndex(-100);
        explodeEntity(entity);
      }

      const otherEntities = remove(entities, index);
      const collidingEntities = otherEntities.filter(
        (otherEntity) => otherEntity.index === entity.index
      );

      if (collidingEntities.length > 0) {
        // Mark each collided entity as exploded
        collidingEntities.forEach((otherEntity) => {
          explodeEntity(otherEntity);
        });

        // Blow ourselves up
        explodeEntity(entity);
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
        const newEntities = [];

        nextSpawns.forEach((spawn, spawnIndex) => {
          if (!spawn) {
            // This index isn't a spawn location
            return;
          }

          const spawnSpeed = randInt(2, 5);

          // If we would spawn on top of a bullet, blow it up and
          // then don't spawn a new asteroid.
          const collidingBulletIndices = findAllMatchingIndices(
            entities,
            (entity) => entity.index === spawnIndex && entity.name === "*"
          );
          if (collidingBulletIndices.length > 0) {
            collidingBulletIndices.forEach((collidingIndex) => {
              entities[collidingIndex].name = "💥";
              entities[collidingIndex].img = explosionIcon;
              entities[collidingIndex].speed = 0;
            });
            return;
          }

          if (
            entities.some((entity) => entity.index === spawnIndex) ||
            newEntities.some((entity) => entity.index === spawnIndex)
          ) {
            // Don't spawn entities on top of other entities
            return;
          }

          newEntities.push({
            name: "🪨",
            speed: spawnSpeed,
            index: spawnIndex,
            img: asteroidIcon,
          });
        });

        setLastSpawned(turnCount);
        setEntities([...entities, ...newEntities]);
        setNextSpawns(chooseNextSpawns(colCount));
      }

      setGameState("cleanup");
      // setGameState("drawing");
    }
  }, [gameState, lastSpawned, entities, turnCount]);

  useEffect(() => {
    if (gameState === "cleanup") {
      if (playerIndex < 0) {
        // Player is dead
        setGameState("gameover");
        return;
      }

      if (playerIndex < colCount) {
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
  }, [playerIndex, gameState, entities, tiles]);

  useEffect(() => {
    if (gameState === "drawing") {
      drawHand();
      setGameState("waiting");
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
        playerIndex,
        rowCount
      ).includes(newIndex)
    ) {
      // If no action effect, default to moving
      if (!hand[selectedCard].effect) {
        const direction = getDirection(playerIndex, newIndex, colCount);

        const indices = getIndicesInDirection(
          playerIndex,
          hand[selectedCard].range,
          direction,
          colCount,
          rowCount
        );

        const collidedEntityIndex = entities.findIndex((entity) =>
          indices.includes(entity.index)
        );

        if (collidedEntityIndex >= 0) {
          // Kill player if they move into an entity
          const newEntity = {
            ...entities[collidedEntityIndex],
            name: "💥",
            img: explosionIcon,
            speed: 0,
          };

          setEntities(set(entities, collidedEntityIndex, newEntity));
          setPlayerIndex(-100);
          setGameState("gameover");
          return;
        }

        const movedIndex = last(indices);
        setPlayerIndex(movedIndex);

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
        // is some other entity at this location?
        const collidingEntities = entities.filter(
          (entity) => entity.index === newIndex
        );
        if (collidingEntities.length > 0) {
          // don't create a bullet, blow up entities instead
          collidingEntities.forEach((entity) => explodeEntity(entity));
        } else {
          const newEntity = {
            index: newIndex,
            name: "*",
            img: bulletIcon,
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
        setTurnCount(turnCount + 1);
        setGameState("targeting");
        return;
      }
    }
  };

  const indicesInActionRange = getIndicesInActionRange(
    hand[selectedCard],
    colCount,
    playerIndex,
    rowCount
  );
  let hoveredIndices = [];

  // If an index is being hovered, and it is a targetable index
  if (hoveredIndex >= 0 && indicesInActionRange.includes(hoveredIndex)) {
    const direction = getDirection(playerIndex, hoveredIndex, colCount);
    const indicesInDirection = getIndicesInDirection(
      playerIndex,
      hand[selectedCard].range,
      direction,
      colCount,
      rowCount
    );

    hoveredIndices = indicesInDirection;
  }

  const renderTile = (tile, index) => {
    let object = { ...tile };
    delete object.bg; // remove old bg from tile

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
    if (index === playerIndex) {
      object = { ...object, name: "🔺", img: shipIcon };
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
                  color: "#00303b",
                  fontWeight: "bolder",
                }}
              >
                {object.speed}
              </span>
            )}
            <img src={object.img} />
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
      newDeck = shuffle(newGraveyard);
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

  console.log({
    gameState,
    entities,
    playerIndex,
    turnCount,
    lastSpawned,
    graveyard,
    deck,
    hand,
    hoveredIndex,
  });

  const sortedDeck = [...deck].sort((cardA, cardB) =>
    cardA.name.localeCompare(cardB.name)
  );

  return (
    <Fragment>
      <div className="scanLinesH overlay" />

      <div id="game" ref={scaleRef}>
        {gameState === "gameover" || gameState === "victory" ? (
          <div className="modal-background overlay" />
        ) : null}
        {gameState === "gameover" ? (
          <Modal>
            <div className="header">
              <p className="gameover">
                <span className="negative">GAME OVER</span>
              </p>
              <p className="streak">Win Streak: {winStreak}</p>
            </div>
            <p>Next Sector Conditions</p>
            <ul>
              <li>Light Asteroids</li>
              <li>Nebula</li>
            </ul>
            <p>Ship Systems</p>
            <ul>
              <li>
                SCANNERS: <span className="positive">ONLINE</span>
              </li>
              <li>
                NAVIGATION: <span className="positive">ONLINE</span>
              </li>
              <li>
                ENGINES: <span className="positive">ONLINE</span>
              </li>
            </ul>
            <div className="button-container">
              <button
                onClick={() => {
                  setWinStreak(0);
                  startNewRound();
                }}
              >
                Restart
              </button>
            </div>
          </Modal>
        ) : gameState === "victory" ? (
          <Modal>
            <div className="header">
              <p className="gameover">
                <span className="positive">VICTORY</span>
              </p>
              <p className="streak">Win Streak: {winStreak}</p>
            </div>
            <p>Next Sector Conditions</p>
            <ul>
              <li>Light Asteroids</li>
              <li>Nebula</li>
            </ul>
            <p>Ship Systems</p>
            <ul>
              <li>
                SCANNERS: <span className="positive">ONLINE</span>
              </li>
              <li>
                NAVIGATION: <span className="positive">ONLINE</span>
              </li>
              <li>
                ENGINES: <span className="positive">ONLINE</span>
              </li>
            </ul>
            <div className="button-container">
              <button
                onClick={() => {
                  startNewRound();
                }}
              >
                Continue
              </button>
            </div>
          </Modal>
        ) : winStreak > 0 ? (
          <div className="header">
            <p className="streak">Win Streak: {winStreak}</p>
          </div>
        ) : null}
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
                power <= 1 &&
                tile &&
                gameState !== "spawning" &&
                gameState !== "cleanup" ? (
                  <img src={tile} />
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
                  <li>
                    {card.name} <br /> {card.range}
                  </li>
                ))
              )}
            </ul>
            {/* <p>Grave</p>
          <ul>
            {graveyard.map((card) => (
              <li>{card.name}</li>
            ))}
          </ul> */}
          </div>
        </div>
        <Bar
          power={power}
          maxPower={maxPower}
          hand={hand}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          hasUsedShipPower={hasUsedShipPower}
          onEndClick={() => {
            setTurnCount(turnCount + 1);
            setPower(maxPower);
            setGameState("targeting");
          }}
          onRecycleClick={() => {
            if (hasUsedShipPower) {
              return;
            }

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

render(<App />, document.getElementById("app"));
