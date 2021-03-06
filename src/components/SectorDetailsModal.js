import { h } from "preact";
import Modal from "./Modal";
import Checkpoints from "./Checkpoints";
import SectorConditions from "./SectorConditions";
import Button from "./Button";

const SectorDetailsModal = ({
  sectors,
  areCheckpointsEnabled,
  lastCheckpoint,
  winStreak,
  onBack,
}) => {
  return (
    <Modal>
      <div className="header">
        <p className="gameover">
          <span>RUN DETAILS</span>
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
        <Button onClick={onBack}>Back</Button>
      </div>
    </Modal>
  );
};

export default SectorDetailsModal;
