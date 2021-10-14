import { h } from "preact";

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

export default Grid;
