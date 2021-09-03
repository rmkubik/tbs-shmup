import { Fragment, h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import warningIcon from "../assets/warning.png";
import shipIcon from "../assets/ship.png";
import asteroidIcon from "../assets/asteroid.png";
import explosionIcon from "../assets/explosion.png";

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
  const isEntityMovingUp = entity.speed < 0;

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
            entity.index + (isEntityMovingUp ? row - 1 : row + 1) * colCount
        )
    );
  }

  return (
    createArray(Math.abs(entity.speed))
      // Start at the row _after_ the entity's current position
      .map(
        (_, row) =>
          entity.index + (isEntityMovingUp ? row - 1 : row + 1) * colCount
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

const moveEntity =
  (colCount, playerIndex, setPlayerIndex) => (entity, index, entities) => {
    let newIndex = entity.index;

    if (!isEntityDoneMoving(entity)) {
      const isEntityMovingUp = entity.speed < 0;

      newIndex = isEntityMovingUp
        ? entity.index - colCount
        : entity.index + colCount;
    }

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
      index: newIndex,
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

const Grid = ({ tiles, colCount, renderTile, setHoveredIndex }) => {
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

const useKeyPress = (handlers, dependencies) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.repeat) {
        handlers[event.code]?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handlers, ...dependencies]);
};

const colCount = 10;
const rowCount = 15;
const frameRate = 150;
const initialTiles = new Array(colCount * rowCount).fill({ name: "." });

const App = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [playerIndex, setPlayerIndex] = useState(145);
  const [entities, setEntities] = useState([]);
  // waiting, targeting, animating, spawning, cleanup, gameover, victory
  const [gameState, setGameState] = useState("spawning");
  const [turnCount, setTurnCount] = useState(0);
  const [lastSpawned, setLastSpawned] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [power, setPower] = useState(0);
  const [powerRegenPerTurn, setPowerRegenPerTurn] = useState(2);
  const [actions] = useState({ move: { cost: 1 }, shoot: { cost: 2 } });

  const tryTakeAction = (newIndex, type) => {
    if (gameState !== "waiting") {
      // Skip player input unless we're waiting
      return;
    }

    const action = actions[type];

    if (!action) {
      console.warn(`Invalid action type: "${type}"`);
      return;
    }

    if (power < action.cost) {
      // Cannot afford action
      return;
    }

    switch (type) {
      case "move":
        setPlayerIndex(newIndex);
        break;
      case "shoot":
        const newEntity = {
          index: newIndex,
          name: "🪨",
          img: asteroidIcon,
          speed: -3,
        };

        setEntities([...entities, newEntity]);
        break;
      default:
        break;
    }

    // Check if index is a valid action
    // if (
    //   getIndicesInActionRange(
    //     hand[selectedCard],
    //     colCount,
    //     playerIndex,
    //     rowCount
    //   ).includes(newIndex)
    // ) {
    //   // If no action effect, default to moving
    //   if (!hand[selectedCard].effect) {
    //     const direction = getDirection(playerIndex, newIndex, colCount);

    //     const indices = getIndicesInDirection(
    //       playerIndex,
    //       hand[selectedCard].range,
    //       direction,
    //       colCount,
    //       rowCount
    //     );

    //     const collidedEntityIndex = entities.findIndex((entity) =>
    //       indices.includes(entity.index)
    //     );

    //     if (collidedEntityIndex >= 0) {
    //       // Kill player if they move into an entity
    //       const newEntity = {
    //         ...entities[collidedEntityIndex],
    //         name: "💥",
    //         img: explosionIcon,
    //         speed: 0,
    //       };

    //       setEntities(set(entities, collidedEntityIndex, newEntity));
    //       setPlayerIndex(-100);
    //       setGameState("gameover");
    //       return;
    //     }

    //     setPlayerIndex(last(indices));
    //   }

    const newPower = power - action.cost;

    setPower(newPower);

    // If player is out of power, move to next phase
    if (newPower === 0) {
      setTurnCount(turnCount + 1);
      setGameState("targeting");
    }
    // }
  };

  useKeyPress(
    {
      KeyW: () => tryTakeAction(playerIndex - colCount, "move"),
      KeyA: () => tryTakeAction(playerIndex - 1, "move"),
      KeyS: () => tryTakeAction(playerIndex + colCount, "move"),
      KeyD: () => tryTakeAction(playerIndex + 1, "move"),
      Space: () => tryTakeAction(playerIndex - colCount, "shoot"),
    },
    [playerIndex]
  );

  const moveEntities = () => {
    const newEntities = entities.map(
      moveEntity(colCount, playerIndex, setPlayerIndex)
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
      if (turnCount % 2 === 0 && lastSpawned !== turnCount) {
        const newEntities = [];

        const spawnCount = randInt(1, 4);

        createArray(spawnCount).forEach(() => {
          // TODO: Maybe we should try to prevent spawns from overlapping
          const spawnIndex = randInt(0, colCount - 1);
          const spawnSpeed = randInt(1, 6);

          newEntities.push({
            name: "🪨",
            speed: spawnSpeed,
            index: spawnIndex,
            img: asteroidIcon,
          });
        });

        setLastSpawned(turnCount);
        setEntities([...entities, ...newEntities]);
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
        setGameState("victory");
        return;
      }

      const newEntities = entities
        // Remove entities off bottom of screen
        .filter((entity) => entity.index < tiles.length)
        // Remove explosions
        .filter((entity) => entity.name !== "💥");

      setPower(power + powerRegenPerTurn);
      setEntities(newEntities);
      setGameState("waiting");
    }
  }, [playerIndex, gameState, entities, tiles, power, powerRegenPerTurn]);

  // const indicesInActionRange = getIndicesInActionRange(
  //   hand[selectedCard],
  //   colCount,
  //   playerIndex,
  //   rowCount
  // );
  // let hoveredIndices = [];

  // // If an index is being hovered, and it is a targetable index
  // if (hoveredIndex >= 0 && indicesInActionRange.includes(hoveredIndex)) {
  //   const direction = getDirection(playerIndex, hoveredIndex, colCount);
  //   const indicesInDirection = getIndicesInDirection(
  //     playerIndex,
  //     hand[selectedCard].range,
  //     direction,
  //     colCount,
  //     rowCount
  //   );

  //   hoveredIndices = indicesInDirection;
  // }

  const renderTile = (tile, index) => {
    let object = { ...tile };
    delete object.bg; // remove old bg from tile

    // Display warning icons for entity movement
    if (
      entities.some((entity) =>
        getIndicesInRange(entity, colCount).includes(index)
      )
    ) {
      object = { name: "⚠️", img: warningIcon };
    }

    // highlight potential move option
    // if (indicesInActionRange.includes(index)) {
    //   if (object.name === ".") {
    //     object.name = "";
    //   }
    //   object.bg = "◌";

    //   if (hoveredIndices.includes(index)) {
    //     object.bg = "◯";
    //   }
    // }

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
        // onClick={() => tryTakeAction(index)}
        onMouseEnter={() => setHoveredIndex(index)}
      >
        {object.img ? (
          <img src={object.img} />
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

  console.log({
    gameState,
    entities,
    playerIndex,
    turnCount,
    lastSpawned,
    hoveredIndex,
  });

  return (
    <div>
      {gameState === "gameover" ? (
        <p className="gameover">GAME OVER</p>
      ) : gameState === "victory" ? (
        <p className="gameover">VICTORY</p>
      ) : null}
      <Grid
        tiles={tiles}
        colCount={colCount}
        renderTile={renderTile}
        setHoveredIndex={setHoveredIndex}
      />
      <p>
        {power} power + {powerRegenPerTurn}/turn
      </p>
    </div>
  );
};

render(<App />, document.getElementById("app"));
