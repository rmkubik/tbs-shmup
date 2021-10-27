import { h } from "preact";
import Modal from "./Modal";
import Checkpoints from "./Checkpoints";
import SectorConditions from "./SectorConditions";
import Button from "./Button";

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
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </Modal>
  );
};

export default VictoryModal;
