import { Fragment, h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import warningIcon from "../assets/warning.png";
import shipIcon from "../assets/ship.png";
import asteroidIcon from "../assets/asteroid.png";
import explosionIcon from "../assets/explosion.png";
import bulletIcon from "../assets/bullet.png";

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

  const createArrayOfIndices = (count) => {
    return (
      createArray(Math.abs(count))
        // Start at the row _after_ the entity's current position
        .map((_, row) => {
          const startIndex = isEntityMovingUp ? -(row + 1) : row + 1;

          return entity.index + startIndex * colCount;
        })
    );
  };

  if (entity.targetIndex) {
    // Only return subsection of indices between current and target while animating

    const rowsBetweenCurrentAndDestination = Math.floor(
      (entity.targetIndex - entity.index) / colCount
    );

    return createArrayOfIndices(rowsBetweenCurrentAndDestination);
  }

  return createArrayOfIndices(Math.abs(entity.speed));
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

const isEntityAboutToMoveIntoIndex = (index) => (entity) => {
  const isEntityMovingUp = entity.speed < 0;
  const nextIndex = isEntityMovingUp
    ? entity.index - colCount
    : entity.index + colCount;

  return !isEntityDoneMoving(entity) && nextIndex === index;
};

const moveEntity =
  (colCount, playerIndex, setPlayerIndex) => (entity, index, entities) => {
    let newIndex = entity.index;

    if (!isEntityDoneMoving(entity)) {
      const isEntityMovingUp = entity.speed < 0;

      newIndex = isEntityMovingUp
        ? entity.index - colCount
        : entity.index + colCount;
    }

    // TODO:
    // - if i move into an entity destroy both of us
    // - how can i mark both of us as destroyed?
    // - i know who I am so, it's easy to set myself destroyed
    // - moveEntity doesn't have any side effects so i can't mark the other one
    //   as destroyed
    // - maybe the right answer, is to do a pass through all entities for each move
    //   and make a collection of all entities that will be colliding with anything.
    // - then make all of these entities into explosions
    // - we also need the use case like this:
    //     . . . .          . . . .
    //     . V . .   -->    . ^ . .
    //     . ^ . .          . V . .
    //     . . . .          . . . .
    // - maybe this is just much easier to solve if we DON'T do it "functionaly"
    // - just let the first thing that crashes into the other thing blow them
    // - both up as a side effecty type dealio

    // TODO:
    // I think we should entirely redo the collision system.
    // It seems to be causing random asteroids to delete themselves.
    // Collisions only work _some_ of the times. Some times a bullet will
    // phase through an asteroid. Some times on thing in the collision
    // dies, some times none of them do. Some times both do.

    const otherEntities = remove(entities, index);

    /**
     * If an entity that is moving will hit us, we should turn into an
     * explosion.
     */
    if (otherEntities.some(isEntityAboutToMoveIntoIndex(newIndex))) {
      console.log("explosion location 1");
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
      otherEntities.some((otherEntity) => {
        const isOtherEntityMovingUp = otherEntity.speed < 0;
        const otherEntityNextIndex = isOtherEntityMovingUp
          ? otherEntity.index - colCount
          : otherEntity.index + colCount;

        return otherEntityNextIndex && isEntityDoneMoving(otherEntity);
      })
    ) {
      console.log("THIS IS WHERE ENTITIES ARE GOING AWAY?");
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

const explodeEntity = (entity) => {
  entity.name = "💥";
  entity.img = explosionIcon;
  entity.speed = 0;
  entity.targetIndex = entity.index;
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
        const collidedEntity = entities.find(
          (entity) => entity.index === newIndex
        );
        if (collidedEntity) {
          // Player crashed into an entity
          setPlayerIndex(-100);
          setPower(0);
          explodeEntity(collidedEntity);
          setEntities(entities);
        } else {
          setPlayerIndex(newIndex);
        }
        break;
      case "shoot":
        const newEntity = {
          index: newIndex,
          name: "*",
          img: bulletIcon,
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
      ArrowUp: () => tryTakeAction(playerIndex - colCount, "move"),
      KeyA: () => tryTakeAction(playerIndex - 1, "move"),
      ArrowLeft: () => tryTakeAction(playerIndex - 1, "move"),
      KeyS: () => tryTakeAction(playerIndex + colCount, "move"),
      ArrowDown: () => tryTakeAction(playerIndex + colCount, "move"),
      KeyD: () => tryTakeAction(playerIndex + 1, "move"),
      ArrowRight: () => tryTakeAction(playerIndex + 1, "move"),
      Space: () => tryTakeAction(playerIndex - colCount, "shoot"),
    },
    [playerIndex]
  );

  const moveEntities = () => {
    // const newEntities = entities.map(
    //   moveEntity(colCount, playerIndex, setPlayerIndex)
    // );

    // copy entities
    // for entity of entities
    // is entity already destroyed? skip it
    // move entity one space
    // is entity colliding? destroy it and other entity
    // go on to next entity

    // Make a copy of entities array
    // (this WILL have side effects if this ends up mattering later)

    // TODO:
    // We should prioritize player projectiles moving _before_ other
    // enemy/neutral entities.
    // This guarantees that a player can last minute shoot down an
    // asteroid that is just about to crash into them.

    const newEntities = [...entities];

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

        const spawnCount = randInt(6, 10);

        createArray(spawnCount).forEach(() => {
          const spawnIndex = randInt(0, colCount - 1);
          const spawnSpeed = randInt(2, 5);

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
    // if (
    //   entities.some((entity) => {
    //     return getIndicesInRange(entity, colCount).includes(index);
    //   })
    // ) {
    //   object = { name: "⚠️", img: warningIcon };
    // }

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
          <Fragment>
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
      <p>Turns survived: {turnCount}</p>
    </div>
  );
};

render(<App />, document.getElementById("app"));
