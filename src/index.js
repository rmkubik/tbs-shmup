import { Fragment, h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import warningIcon from "../assets/warning.png";
import shipIcon from "../assets/ship.png";
import asteroidIcon from "../assets/asteroid.png";

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

const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

const randInt = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

const areIndicesAdjacent = (a, b, colCount) => {
  return a - 1 === b || a + 1 === b || a - colCount === b || a + colCount === b;
};

const createArray = (length) => new Array(length).fill();

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

const getIndicesInActionRange = (action, colCount, origin) => {
  if (!action) {
    return [];
  }

  const indices = [];

  const filterIndicesInRowOnly = (index) => {
    const min = Math.floor(origin / colCount) * colCount;
    const max = min + colCount;

    return index >= min && index <= max;
  };

  action.directions.forEach((direction) => {
    if (direction === "left") {
      indices.push(
        ...createArray(action.range)
          .map((_, index) => origin - (index + 1))
          .filter(filterIndicesInRowOnly)
      );
    }

    if (direction === "right") {
      indices.push(
        ...createArray(action.range)
          .map((_, index) => origin + (index + 1))
          .filter(filterIndicesInRowOnly)
      );
    }

    if (direction === "up") {
      indices.push(
        ...createArray(action.range).map(
          (_, index) => origin - (index + 1) * colCount
        )
      );
    }

    if (direction === "down") {
      indices.push(
        ...createArray(action.range).map(
          (_, index) => origin + (index + 1) * colCount
        )
      );
    }

    if (direction === "upLeft") {
      indices.push(
        ...createArray(action.range).map(
          (_, index) => origin - (index + 1) * colCount - 1
        )
      );
    }

    if (direction === "upRight") {
      indices.push(
        ...createArray(action.range).map(
          (_, index) => origin - (index + 1) * colCount + 1
        )
      );
    }
  });

  return indices;
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

const Bar = ({
  power,
  maxPower,
  hand,
  selectedCard,
  setSelectedCard,
  onEndClick,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <p>
          PWR: {power}/{maxPower}
        </p>
        <button onClick={onEndClick}>End</button>
      </div>
      <ul>
        {hand.map((card, index) => (
          <li
            style={{
              textDecoration: selectedCard === index ? "underline" : "",
              cursor: "pointer",
            }}
            onClick={() => setSelectedCard(index)}
          >
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
  // drawing, waiting, targeting, animating, spawning
  const [gameState, setGameState] = useState("spawning");
  const [moveCount, setMoveCount] = useState(0);
  const [lastSpawned, setLastSpawned] = useState();
  const [selectedCard, setSelectedCard] = useState(0);
  const [graveyard, setGraveyard] = useState([]);
  const [deck, setDeck] = useState(
    shuffle([
      { name: "Strafe", cost: 2, range: 3, directions: ["left", "right"] },
      { name: "FTL", cost: 5, range: 10, directions: ["up"] },
      { name: "Roll", cost: 2, range: 1, directions: ["upLeft", "upRight"] },
      { name: "Stall", cost: 0, range: 0, directions: [] },
      { name: "Charge", cost: 3, range: 0, directions: [] },
      {
        name: "Adjust",
        cost: 1,
        range: 1,
        directions: ["up", "down", "left", "right"],
      },
      {
        name: "Brake",
        cost: 1,
        range: 4,
        directions: ["down"],
      },
    ])
  );
  const [hand, setHand] = useState([]);
  const [power, setPower] = useState(3);
  const [maxPower, setMaxPower] = useState(3);
  const [drawSize, setDrawSize] = useState(3);

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
      if (moveCount % 2 === 0 && lastSpawned !== moveCount) {
        const newEntities = [];

        const spawnCount = randInt(1, 3);

        createArray(spawnCount).forEach(() => {
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

      setGameState("drawing");
    }
  }, [gameState, lastSpawned, entities, moveCount]);

  useEffect(() => {
    if (gameState === "drawing") {
      drawHand();
      setGameState("waiting");
    }
  }, [gameState]);

  const movePlayer = (newIndex) => {
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
        playerIndex
      ).includes(newIndex)
    ) {
      setPlayerIndex(newIndex);

      setMoveCount(moveCount + 1);

      setPower(power - hand[selectedCard].cost);
    }
  };

  const renderTile = (tile, index) => {
    let object = tile;
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
    if (
      getIndicesInActionRange(
        hand[selectedCard],
        colCount,
        playerIndex
      ).includes(index)
    ) {
      // if (object.name === ".") {
      //   delete object.name;
      // }
      object.bg = "◌";
    }

    // Display entity
    const entity = entities.find((entity) => entity.index === index);
    if (entity) {
      object = entity;
    }

    // Display player at current index
    if (index === playerIndex) {
      object = { name: "🔺", img: shipIcon };
    }

    return (
      <div
        style={{
          cursor: "pointer",
          height: "16px",
          width: "16px",
          position: "relative",
        }}
        onClick={() => movePlayer(index)}
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

  const drawHand = () => {
    let newHand = deck.slice(0, drawSize);
    let newGraveyard = [...graveyard, ...hand];
    let newDeck = deck.slice(drawSize);

    const missingCardsFromDraw = drawSize - newHand.length;

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

    setGraveyard(newGraveyard);
    setHand(newHand);
    setDeck(newDeck);
  };

  console.log({
    gameState,
    entities,
    playerIndex,
    moveCount,
    lastSpawned,
    graveyard,
    deck,
    hand,
  });

  return (
    <div>
      <Grid tiles={tiles} colCount={colCount} renderTile={renderTile} />
      <Bar
        power={power}
        maxPower={maxPower}
        hand={hand}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        onEndClick={() => {
          setPower(maxPower);
          setGameState("targeting");
        }}
      />
    </div>
  );
};

render(<App />, document.getElementById("app"));
