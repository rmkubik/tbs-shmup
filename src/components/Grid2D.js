import { h } from "preact";
import { getDimensions, mapMatrix } from "functional-game-utils";

const Grid2D = ({ tiles, tileSize, renderTile, ...props }) => {
  const { width, height } = getDimensions(tiles);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${tileSize}px `.repeat(width),
        lineHeight: `${tileSize}px`,
        textAlign: "center",
      }}
      {...props}
    >
      {mapMatrix(renderTile, tiles)}
    </div>
  );
};

export default Grid2D;
