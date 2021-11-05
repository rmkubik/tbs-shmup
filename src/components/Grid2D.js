import { h } from "preact";
import { getDimensions, mapMatrix } from "functional-game-utils";

const Grid2D = ({ tiles, renderTile, ...props }) => {
  const { width, height } = getDimensions(tiles);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "16px ".repeat(width),
        lineHeight: "16px",
        textAlign: "center",
      }}
      {...props}
    >
      {mapMatrix(renderTile, tiles)}
    </div>
  );
};

export default Grid2D;
