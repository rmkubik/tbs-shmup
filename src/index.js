import { Fragment, h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import warningIcon from "../assets/warning.png";
import shipIcon from "../assets/ship.png";
import asteroidIcon from "../assets/asteroid.png";

const randInt = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

const areIndicesAdjacent = (a, b, colCount) => {
  return a - 1 === b || a + 1 === b || a - colCount === b || a + colCount === b;
};

const getIndicesInRange = (entity, colCount) => {
  if (entity.targetIndex) {
    // Only return subsection of indices between current and target while animating

    const rowsBetweenCurrentAndDestination = Math.floor(
      (entity.targetIndex - entity.index) / colCount
    );

    return (
      new Array(rowsBetweenCurrentAndDestination)
        .fill()
        // Start at the row _after_ the entity's current position
        .map((_, row) => entity.index + (row + 1) * colCount)
    );
  }

  return (
    new Array(entity.speed)
      .fill()
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

const moveEntity = (colCount) => (entity) => {
  if (isEntityDoneMoving(entity)) {
    // We're at target index, just return unedited
    return entity;
  }

  return {
    ...entity,
    index: entity.index + colCount,
  };
};

const Grid = ({ tiles, colCount, renderTile }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "16px ".repeat(colCount),
        lineHeight: "16px",
        textAlign: "center",
      }}
    >
      {tiles.map((tile, index) => renderTile(tile, index))}
    </div>
  );
};

const Bar = ({ power, maxPower, hand }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <p>
        PWR: {power}/{maxPower}
      </p>
      <ul>
        {hand.map((card) => (
          <li>
            {card.name} - {card.cost}
          </li>
        ))}
      </ul>
    </div>
  );
};

const colCount = 10;
const frameRate = 150;
const initialTiles = new Array(150).fill({ name: "." });

const App = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [playerIndex, setPlayerIndex] = useState(145);
  const [entities, setEntities] = useState([]);
  // waiting, targeting, animating, spawning
  const [gameState, setGameState] = useState("spawning");
  const [moveCount, setMoveCount] = useState(0);
  const [lastSpawned, setLastSpawned] = useState();

  const moveEntities = () => {
    const newEntities = entities.map(moveEntity(colCount));

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
    // Spawn new entities every 3 moves
    // If we're in spawning phase
    // If we haven't already spawned for this moveCount
    if (gameState === "spawning") {
      if (moveCount % 3 === 0 && lastSpawned !== moveCount) {
        const newEntities = [];

        const spawnCount = randInt(1, 3);

        new Array(spawnCount).fill().forEach(() => {
          const spawnIndex = randInt(0, colCount - 1);
          const spawnSpeed = randInt(3, 8);

          newEntities.push({
            name: "🪨",
            speed: spawnSpeed,
            index: spawnIndex,
            img: asteroidIcon,
          });
        });

        setLastSpawned(moveCount);
        setEntities([...entities, ...newEntities]);
      }

      setGameState("waiting");
    }
  }, [gameState, lastSpawned, entities, moveCount]);

  const movePlayer = (newIndex) => {
    if (gameState !== "waiting") {
      // Skip player input unless we're waiting
      return;
    }

    // Can only move to adjacent tile
    if (areIndicesAdjacent(newIndex, playerIndex, colCount)) {
      setPlayerIndex(newIndex);

      setGameState("targeting");

      setMoveCount(moveCount + 1);
    }
  };

  const renderTile = (tile, index) => {
    let object = tile;

    if (
      entities.some((entity) =>
        getIndicesInRange(entity, colCount).includes(index)
      )
    ) {
      object = { name: "⚠️", img: warningIcon };
    }

    const entity = entities.find((entity) => entity.index === index);
    if (entity) {
      object = entity;
    }

    if (index === playerIndex) {
      object = { name: "🔺", img: shipIcon };
    }

    return (
      <div
        style={{ cursor: "pointer", height: "16px", width: "16px" }}
        onClick={() => movePlayer(index)}
      >
        {object.img ? <img src={object.img} /> : object.name}
      </div>
    );
  };

  console.log({ gameState, entities, playerIndex, moveCount, lastSpawned });

  return (
    <div>
      <Grid tiles={tiles} colCount={colCount} renderTile={renderTile} />
      <Bar
        power={3}
        maxPower={3}
        hand={[
          { name: "Strafe", cost: 2 },
          { name: "FTL", cost: 5 },
          { name: "Roll", cost: 2 },
        ]}
      />
    </div>
  );
};

render(<App />, document.getElementById("app"));
