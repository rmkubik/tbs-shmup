import { h, render } from "preact";
import { useState } from "preact/hooks";

const areIndicesAdjacent = (a, b, colCount) => {
  return a - 1 === b || a + 1 === b || a - colCount === b || a + colCount === b;
};

const getIndicesInRange = (entity, colCount) => {
  return (
    new Array(entity.speed)
      .fill()
      // Start at the row _after_ the entity's current position
      .map((_, row) => entity.index + (row + 1) * colCount)
  );
};

const Grid = ({ tiles, colCount, renderTile }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px ".repeat(colCount),
        lineHeight: "32px",
        textAlign: "center",
      }}
    >
      {tiles.map((tile, index) => renderTile(tile, index))}
    </div>
  );
};

const colCount = 10;
const initialTiles = new Array(150).fill({ name: "." });

// initialTiles[2] = { name: "🪨" };
// initialTiles[12] = { name: "⚠️" };
// initialTiles[22] = { name: "⚠️" };
// initialTiles[32] = { name: "⚠️" };

// initialTiles[18] = { name: "🪨" };
// initialTiles[28] = { name: "⚠️" };
// initialTiles[38] = { name: "⚠️" };
// initialTiles[48] = { name: "⚠️" };

const App = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [playerIndex, setPlayerIndex] = useState(145);
  const [entities, setEntities] = useState([
    { name: "🪨", speed: 3, index: 2 },
    { name: "🪨", speed: 3, index: 18 },
  ]);

  const movePlayer = (newIndex) => {
    // Can only move to adjacent tile
    if (areIndicesAdjacent(newIndex, playerIndex, colCount)) {
      setPlayerIndex(newIndex);
    }
  };

  const renderTile = (tile, index) => {
    let object = tile;

    if (
      entities.some((entity) =>
        getIndicesInRange(entity, colCount).includes(index)
      )
    ) {
      object = { name: "⚠️" };
    }

    const entity = entities.find((entity) => entity.index === index);
    if (entity) {
      object = entity;
    }

    if (index === playerIndex) {
      object = { name: "🔺" };
    }

    return (
      <div style={{ cursor: "pointer" }} onClick={() => movePlayer(index)}>
        {object.name}
      </div>
    );
  };

  return <Grid tiles={tiles} colCount={colCount} renderTile={renderTile} />;
};

render(<App />, document.body);
