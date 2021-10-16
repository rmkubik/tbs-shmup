import { h } from "preact";
import Modal from "./Modal";

const GameOverModal = ({
  onRestart,
  winStreak,
  areCheckpointsEnabled,
  lastCheckpoint,
  sectors,
}) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span className="negative">GAME OVER</span>
        </p>
        <p className="streak">Sector: {winStreak + 1}</p>
        {areCheckpointsEnabled && (
          <Checkpoints
            lastCheckpoint={lastCheckpoint}
            sectors={sectors}
            winStreak={winStreak}
          />
        )}
      </div>
      <SectorConditions
        title="Current Sector Conditions"
        sector={sectors[winStreak]}
      />
      {/* <SystemsList sector={sectors[winStreak]} /> */}
      <div className="button-container">
        <button onClick={onRestart}>Restart</button>
      </div>
    </Modal>
  );
};

export default GameOverModal;
