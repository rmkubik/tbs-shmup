import { h } from "preact";
import Modal from "./Modal";
import Grid from "./Grid";
import createArray from "../utils/createArray";

const GalaxyMapModal = ({ winStreak, sectors, onResume }) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">GALAXY MAP</p>
      </div>
      <Grid
        tiles={createArray(sectors.length)}
        colCount={10}
        renderTile={(tile, index) => {
          if (index < winStreak) {
            return (
              <div
                style={{
                  height: "16px",
                  width: "16px",
                  position: "relative",
                }}
              >
                ✅
              </div>
            );
          }

          if (index === winStreak) {
            return (
              <div
                style={{
                  height: "16px",
                  width: "16px",
                  position: "relative",
                }}
              >
                🚀
              </div>
            );
          }

          if (index > winStreak) {
            return (
              <div
                style={{
                  height: "16px",
                  width: "16px",
                  position: "relative",
                }}
              >
                🔒
              </div>
            );
          }
        }}
      />
      <div className="button-container">
        <button onClick={onResume}>Resume</button>
      </div>
    </Modal>
  );
};

export default GalaxyMapModal;
