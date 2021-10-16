import { h } from "preact";
import Modal from "./Modal";

const VictoryModal = ({
  onContinue,
  winStreak,
  areCheckpointsEnabled,
  lastCheckpoint,
  sectors,
}) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span className="positive">VICTORY</span>
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
        title="Next Sector Conditions"
        sector={sectors[winStreak]}
      />
      {/* <SystemsList sector={sectors[winStreak]} /> */}
      <div className="button-container">
        <button onClick={onContinue}>Continue</button>
      </div>
    </Modal>
  );
};

export default VictoryModal;
